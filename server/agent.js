const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const simpleGit = require("simple-git");
const promptManager = require("../lib/promptManager");
const axios = require("axios");
const cheerio = require("cheerio");
const TurndownService = require("turndown");
const { chromium } = require("playwright");
const beautify = require("js-beautify").js;
const turndown = new TurndownService();

const TOOLS = [
  {
    type: "function",
    function: {
      name: "list_dir",
      description: "List files (Repo Mode only).",
      parameters: {
        type: "object",
        properties: { dirPath: { type: "string" } },
        required: ["dirPath"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read a local file or JS source. Auto-beautifies if it's JS.",
      parameters: {
        type: "object",
        properties: { filePath: { type: "string" } },
        required: ["filePath"]
      }
    }
  },
  {
     type: "function",
     function: {
        name: "fetch_url",
        description: "Visit a URL with a browser (Playwright). Extracts DOM, Metadata, and Network API traffic (XHR/Fetch).",
        parameters: {
          type: "object",
          properties: { 
            url: { type: "string" },
            wait: { type: "boolean", description: "Wait for network idle (recommended for SPAs like React/Vue)." }
          },
          required: ["url"]
        }
     }
  },
  {
    type: "function",
    function: {
      name: "run_command",
      description: "Execute a shell command (Local Mode only).",
      parameters: {
        type: "object",
        properties: { command: { type: "string" } },
        required: ["command"]
      }
    }
  }
];

class SandboxAgent {
  constructor(apiKey, baseUrl, model = "gpt-4o") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || "https://api.openai.com/v1";
    this.model = model;
    this.messages = [];
  }

  async run(url, onLog, onChunk) {
    const debugLog = (msg) => {
        try {
            const logLine = `[${new Date().toISOString()}] ${msg}\n`;
            fs.appendFileSync(path.join(process.cwd(), "agent_debug.log"), logLine);
            onLog(msg);
        } catch(e) {
            onLog(`[Logger Error] ${e.message}`);
        }
    };

    try {
      if (!this.apiKey) {
         debugLog("[Error] API_KEY not found.");
         return;
      }
      
      debugLog("[System] Initializing Hybrid Browser-Enhanced Agent...");
      
      const configManager = require("../lib/configManager");
      const workspaceRoot = configManager.getDefaultWorkspace();
      
      let cloneDir = "";
      let mode = "repo"; 

      if (!url.startsWith("http") && fs.existsSync(url)) {
        cloneDir = path.resolve(url);
        debugLog(`[Setup] Local Mode: ${cloneDir}`);
      } else if (url.includes("github.com")) {
        const parts = url.split("/").filter(Boolean);
        const repo = parts.pop() || "repo";
        const owner = parts.pop() || "owner";
        const ownerDir = path.join(workspaceRoot, owner);
        if (!fs.existsSync(ownerDir)) fs.mkdirSync(ownerDir, { recursive: true });
        cloneDir = path.join(ownerDir, repo);
        const git = simpleGit();
        if (fs.existsSync(cloneDir)) {
          debugLog(`[Setup] Syncing Repo...`);
          try { await git.cwd(cloneDir).pull(); } catch(e) { debugLog(`[Warn] Sync failed.`); }
        } else {
          debugLog(`[Init] Cloning Repo...`);
          await git.clone(url, cloneDir, ["--depth", "1"]);
        }
      } else {
        mode = "web";
        debugLog(`[Setup] Hybrid Web Mode: ${url}`);
        const host = new URL(url).hostname;
        cloneDir = path.join(workspaceRoot, "web_scans", host);
        if (!fs.existsSync(cloneDir)) fs.mkdirSync(cloneDir, { recursive: true });
      }

      const blueprintPath = path.join(cloneDir, "SYSTEM_BLUEPRINT.md");
      let existingKnowledge = "";
      if (fs.existsSync(blueprintPath)) {
          try {
              const blueprint = fs.readFileSync(blueprintPath, "utf8");
              existingKnowledge = `\n\n### PREVIOUS ARCHITECTURAL KNOWLEDGE:\n${blueprint}\n\n`;
          } catch(e) {}
      }

      this.messages.push({
        role: "system",
        content: promptManager.getPrompt("agent") + existingKnowledge + `\n\nENVIRONMENT: ${mode.toUpperCase()}. You are an expert code architect. If Web Mode is active, focus on discovering API endpoints, React bundle logic, and rendering patterns.`
      });
      
      this.messages.push({ role: "user", content: `Target: ${url}. Begin deep analysis.` });

      debugLog(`[Engine] Agent Started. Mode: ${mode.toUpperCase()}...`);

      let done = false;
      let turnCount = 0;
      const MAX_TURNS = 25;
      let toolCallingSupported = true;

      while (!done && turnCount < MAX_TURNS) {
        turnCount++;
        const endpoint = this.baseUrl.endsWith("/chat/completions") ? this.baseUrl : `${this.baseUrl}/chat/completions`;
        
        if (turnCount === MAX_TURNS) {
           this.messages.push({ role: "user", content: "FINAL ROUND. Synthesize all findings now." });
        }

        const body = {
          model: this.model,
          messages: this.messages,
          temperature: 0.1
        };
        if (toolCallingSupported && turnCount < MAX_TURNS) body.tools = TOOLS;

        debugLog(`[Turn ${turnCount}] Requesting AI...`);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${this.apiKey}` },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 400 && toolCallingSupported) {
            toolCallingSupported = false;
            turnCount--;
            continue;
          }
          debugLog(`[Error] API ${response.status}: ${errText.slice(0, 300)}`);
          break;
        }

        const data = await response.json();
        const message = data.choices[0].message;
        this.messages.push(message);

        if (message.tool_calls && message.tool_calls.length > 0 && turnCount < MAX_TURNS) {
          debugLog(`[Agent] Calling ${message.tool_calls.length} tool(s)...`);
          for (const call of message.tool_calls) {
            const name = call.function.name;
            let args;
            try { args = typeof call.function.arguments === "string" ? JSON.parse(call.function.arguments) : call.function.arguments; } catch(e) { args = {}; }
            
            let result = "";
            try {
               if (name === "fetch_url") {
                   debugLog(`[Browser] Simulating user visit to: ${args.url}...`);
                   const browser = await chromium.launch({ headless: true });
                   const page = await browser.newPage();
                   
                   // Network Sniffer
                   const apiCalls = [];
                   page.on("request", req => {
                      const rUrl = req.url();
                      if (rUrl.includes("api") || rUrl.includes(".json") || rUrl.includes("graphql")) {
                         apiCalls.push(`${req.method()} ${rUrl}`);
                      }
                   });

                   try {
                     await page.goto(args.url, { waitUntil: args.wait ? "networkidle" : "domcontentloaded", timeout: 45000 });
                     
                     // Stack Detection (UI metadata based)
                     const meta = {
                        title: await page.title(),
                        scripts: await page.evaluate(() => Array.from(document.querySelectorAll("script[src]")).map(s => s.src)),
                        endpoints: apiCalls.slice(0, 20)
                     };
                     
                     const domContent = await page.content();
                     const md = turndown.turndown(domContent);
                     result = `BROWSER STATUS: OK\n\nMETADATA:\n${JSON.stringify(meta, null, 2)}\n\nRENDERED CONTENT:\n${md.slice(0, 6000)}`;
                     debugLog(`[Browser] Render complete. Found ${apiCalls.length} API calls.`);
                   } catch(e) { result = `Browser error: ${e.message}`; }
                   await browser.close();

               } else if (name === "list_dir" && mode === "repo") {
                   let safePath = path.resolve(cloneDir, args.dirPath || ".");
                   if (fs.existsSync(safePath)) {
                      const entries = fs.readdirSync(safePath);
                      result = entries.join("\n");
                      debugLog(`[Tool] <list_dir> ${args.dirPath}`);
                   } else result = "Not found.";
               } else if (name === "read_file") {
                  if (args.filePath.startsWith("http")) {
                      debugLog(`[Web] Reading & Beautifying Source: ${args.filePath}`);
                      const res = await axios.get(args.filePath);
                      // Auto-beautify if JS/JSON
                      if (args.filePath.includes(".js") || args.filePath.includes(".json")) {
                         result = beautify(res.data, { indent_size: 2, space_in_empty_paren: true });
                      } else {
                         result = res.data.slice(0, 15000);
                      }
                  } else {
                      let safePath = path.resolve(cloneDir, args.filePath);
                      if (fs.existsSync(safePath)) {
                          let content = fs.readFileSync(safePath, "utf-8");
                          if (args.filePath.endsWith(".js") || args.filePath.endsWith(".json")) {
                             content = beautify(content, { indent_size: 2 });
                          }
                          result = content.slice(0, 15000);
                          debugLog(`[Tool] <read_file> ${args.filePath}`);
                      } else result = "Not found.";
                  }
               } else if (name === "run_command" && mode === "repo") {
                   debugLog(`[Tool] <CMD> ${args.command}`);
                   result = execSync(args.command, { cwd: cloneDir, encoding: "utf-8", timeout: 45000 }).slice(0, 8000);
               }
            } catch(e) {
               result = `Error: ${e.message}`;
               debugLog(`[Error] Tool failure.`);
            }
            this.messages.push({ role: "tool", tool_call_id: call.id, name: name, content: result });
          }
        } else if (message.content) {
          debugLog(`[Agent] Deep Synthesis complete.`);
          onChunk(message.content);
          try {
              const header = `<!-- REVERSE ENGINEER BLUEPRINT - WEB/APP MODE - ${new Date().toISOString()} -->\n\n`;
              fs.writeFileSync(blueprintPath, header + message.content, "utf8");
          } catch(e) {}
          done = true;
        }
      }
      debugLog(`[Status] Finished.`);
    } catch(err) {
      debugLog(`[Fatal] Agent Panic: ${err.message}`);
    }
  }
}

module.exports = { SandboxAgent };
