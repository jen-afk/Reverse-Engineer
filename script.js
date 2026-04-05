// Selectors
const form = document.querySelector("#prompt-form");
const urlInput = document.querySelector("#github-url");
const goalInput = document.querySelector("#goal");
const outputStyleInput = document.querySelector("#output-style");
const languageInput = document.querySelector("#language");
const providerInput = document.querySelector("#provider");
const modelInput = document.querySelector("#model");
const extraContextInput = document.querySelector("#extra-context");
const contextOutput = document.querySelector("#context-output");
const analysisOutput = document.querySelector("#analysis-output");
const sampleBtn = document.querySelector("#sample-btn");
const inspectBtn = document.querySelector("#inspect-btn");
const copyContextBtn = document.querySelector("#copy-context-btn");
const copyAnalysisBtn = document.querySelector("#copy-analysis-btn");
const copyMetaBtn = document.querySelector("#copy-meta-btn");
const statusContainer = document.querySelector("#status-container");
const serverStatusBadge = document.querySelector("#server-status-badge");
const contextInfo = document.querySelector("#context-info");

// Metadata Display
const metaOwner = document.querySelector("#meta-owner");
const metaRepo = document.querySelector("#meta-repo");
const metaBranch = document.querySelector("#meta-branch");
const metaType = document.querySelector("#meta-type");
const metaPath = document.querySelector("#meta-path");

let latestGitHubContext = null;
let providerCatalog = {};

// Helper: Add Terminal Log Entry
function addLog(message, type = "system") {
  const entry = document.createElement("p");
  entry.className = `log-entry ${type}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
  statusContainer.prepend(entry);
}

function renderMetadata(meta) {
  if (meta.error) {
    [metaOwner, metaRepo, metaBranch, metaType].forEach(el => el.textContent = "N/A");
    metaPath.textContent = meta.error;
    metaPath.style.color = "var(--error)";
    return;
  }

  metaOwner.textContent = meta.owner;
  metaRepo.textContent = meta.repo;
  metaBranch.textContent = meta.branch;
  metaType.textContent = meta.type;
  metaPath.textContent = meta.path;
  metaPath.style.color = "var(--neon-cyan)";
}

function updateContextInfo(count) {
  const size = (count / 1024).toFixed(1);
  contextInfo.textContent = `${size} KB`;
}

function buildContextPreview(githubContext) {
  const treeLines = (githubContext.tree || [])
    .map((item) => `${item.type.toUpperCase()} ${item.path}${item.size ? ` (${item.size} bytes)` : ""}`)
    .join("\n");

  const sections = [
    `Repository: ${githubContext.metadata.owner}/${githubContext.metadata.repo}`,
    `Branch: ${githubContext.metadata.branch}`,
    `Type: ${githubContext.metadata.type}`,
    `Path: ${githubContext.metadata.path}`,
    "",
    "Tree preview:",
    treeLines || "- No entries available",
  ];

  if (githubContext.file) {
    sections.push("", `File preview: ${githubContext.file.path}`, githubContext.file.content || "");
  }

  if (githubContext.readme) {
    sections.push("", "README preview:", githubContext.readme.content || "");
  }

  const result = sections.join("\n");
  updateContextInfo(result.length);
  return result;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

async function copyText(text, button) {
  if (!text.trim()) return;
  const originalIcon = button.innerHTML;
  await navigator.clipboard.writeText(text);
  button.innerHTML = '<i class="fas fa-check"></i>';
  button.style.color = "var(--success)";

  window.setTimeout(() => {
    button.innerHTML = originalIcon;
    button.style.color = "";
  }, 2000);
}

async function inspectGitHub() {
  addLog(`Inspecting target: ${urlInput.value.trim()}...`, "loading");
  analysisOutput.value = "";

  const githubContext = await fetchJson(
    `/api/github/inspect?url=${encodeURIComponent(urlInput.value.trim())}`
  );

  latestGitHubContext = githubContext;
  renderMetadata(githubContext.metadata);
  contextOutput.value = buildContextPreview(githubContext);
  addLog(`Inspection complete. Scanned ${githubContext.tree?.length || 0} items.`, "success");

  return githubContext;
}

async function analyzeGitHubContext(githubContext) {
  const provider = providerInput.value;
  addLog(`Requesting synthesis from ${provider}...`, "loading");
  
  const analysis = await fetchJson("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      githubContext,
      goal: goalInput.value.trim(),
      outputStyle: outputStyleInput.value,
      language: languageInput.value,
      provider: providerInput.value,
      model: modelInput.value.trim(),
      extraContext: extraContextInput.value.trim(),
    }),
  });

  // Render markdown
  analysisOutput.innerHTML = marked.parse(analysis.text || "No analysis returned.");
  // Store raw text for copying
  analysisOutput.dataset.raw = analysis.text || "";
  
  addLog(`Synthesis finalized by ${analysis.provider} (${analysis.model})`, "success");
}

async function handleInspect(event) {
  event?.preventDefault();
  try {
    await inspectGitHub();
  } catch (error) {
    latestGitHubContext = null;
    renderMetadata({ error: error.message });
    contextOutput.value = "";
    analysisOutput.value = "";
    addLog(`Error: ${error.message}`, "error");
  }
}

async function handleGenerate(event) {
  event.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalContent = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> SYTHESIZING...';
  
  try {
    const githubContext = await inspectGitHub();
    await analyzeGitHubContext(githubContext);
  } catch (error) {
    latestGitHubContext = null;
    renderMetadata({ error: error.message });
    contextOutput.value = "";
    analysisOutput.value = "";
    addLog(`Error: ${error.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;
  }
}

// Event Listeners
form.addEventListener("submit", handleGenerate);
inspectBtn.addEventListener("click", handleInspect);

sampleBtn.addEventListener("click", () => {
  urlInput.value = "https://github.com/HKUDS/OpenHarness";
  goalInput.value = "Explain the core architecture and integration logic.";
  outputStyleInput.value = "deep";
  languageInput.value = "English";
  addLog("Loaded Example: OpenHarness Repository", "system");
});

copyContextBtn.addEventListener("click", () => copyText(contextOutput.value, copyContextBtn));
copyAnalysisBtn.addEventListener("click", () => copyText(analysisOutput.dataset.raw || "", copyAnalysisBtn));
copyMetaBtn.addEventListener("click", () => {
    const text = `Repo: ${metaOwner.textContent}/${metaRepo.textContent}\nBranch: ${metaBranch.textContent}\nPath: ${metaPath.textContent}`;
    copyText(text, copyMetaBtn);
});

async function loadHealth() {
  try {
    const health = await fetchJson("/api/health");
    providerCatalog = health.providers || {};
    
    serverStatusBadge.className = "badge status-online";
    serverStatusBadge.innerHTML = '<span class="dot"></span> SERVER ONLINE';
    
    renderProviderOptions(health.defaultProvider || "openai");
    addLog(`System initialized. Cluster ready.`, "success");
  } catch {
    serverStatusBadge.className = "badge status-offline";
    serverStatusBadge.innerHTML = '<span class="dot"></span> SERVER OFFLINE';
    addLog("Connection failed. Is the server running?", "error");
  }
}

function renderProviderOptions(defaultProvider) {
  const providerNames = Object.keys(providerCatalog);
  providerInput.innerHTML = providerNames
    .map((name) => {
      const provider = providerCatalog[name];
      const suffix = provider.configured ? "" : " (no key)";
      const disabled = provider.configured ? "" : "disabled";
      return `<option value="${name}" ${disabled}>${provider.label}${suffix}</option>`;
    })
    .join("");

  providerInput.value = providerNames.includes(defaultProvider) ? defaultProvider : providerNames[0];
  syncModelWithProvider();
}

function syncModelWithProvider() {
  const selected = providerCatalog[providerInput.value];
  if (!selected) return;
  modelInput.value = selected.model || "";
}

providerInput.addEventListener("change", () => {
  syncModelWithProvider();
  addLog(`Provider switched to ${providerInput.value}`, "system");
});

// Initial boot
loadHealth();
