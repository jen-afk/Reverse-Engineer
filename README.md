# Reverse-Engineer

เว็บสำหรับวางลิงก์ GitHub แล้วให้ระบบ:

- ดึง `tree` หรือ `file content` จริงจาก GitHub API
- ส่ง context ที่ดึงได้เข้า AI provider ที่เลือก
- คืนผลวิเคราะห์สำหรับ reverse engineering โค้ดและสถาปัตยกรรม

## Setup

1. ติดตั้ง dependencies

```bash
npm install
```

2. สร้างไฟล์ `.env` จาก `.env.example`

```bash
cp .env.example .env
```

3. ใส่ค่า API key ตาม provider ที่ต้องการใช้

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.2
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
GROQ_API_KEY=
XAI_API_KEY=
MISTRAL_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_PROVIDER=openai
GITHUB_TOKEN=optional_github_token
PORT=3000
```

4. รันเซิร์ฟเวอร์

```bash
npm start
```

5. เปิด `http://localhost:3000`

หรือใช้ผ่าน TUI:

```bash
npm run tui
```

## วิธีใช้

1. วางลิงก์ GitHub เช่น repo root, `tree`, หรือ `blob`
2. ใส่เป้าหมายการวิเคราะห์
3. กด `Inspect + Analyze`
4. เลือก provider/model ที่ต้องการ
5. ระบบจะดึง context จาก GitHub ก่อน แล้วค่อยส่งเข้า provider ที่เลือก

## TUI

ต้องรัน server ไว้ก่อน แล้วใช้ได้ 2 แบบ

แบบ interactive:

```bash
npm run tui
```

แบบ command line:

```bash
node cli.js --url "https://github.com/vercel/next.js/blob/canary/packages/next/src/server/app-render/app-render.tsx" --style deep --language Thai
```

ระบุ provider/model:

```bash
node cli.js --url "https://github.com/vercel/next.js/blob/canary/packages/next/src/server/app-render/app-render.tsx" --provider anthropic --model claude-sonnet-4-20250514
```

inspect อย่างเดียว:

```bash
node cli.js --url "https://github.com/vercel/next.js/tree/canary/packages/next/src/server/app-render" --inspect-only
```

## หมายเหตุ

ตอนนี้รองรับ:

- public repositories โดยไม่ต้องใส่ `GITHUB_TOKEN`
- private repositories หรือ rate limit สูงขึ้นผ่าน `GITHUB_TOKEN`
- file preview, tree preview, และ AI analysis ในหน้าเดียว
- หลาย provider: `OpenAI`, `Anthropic`, `Gemini`, `OpenRouter`, `Groq`, `xAI`, `Mistral`, `Ollama`, `KiloCode`

API ภายในที่มี:

- `GET /api/health`
- `GET /api/providers`
- `GET /api/github/inspect?url=...`
- `POST /api/analyze`
