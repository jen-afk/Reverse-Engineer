# REVERSE ENGINEER

![REVERSE ENGINEER - AI Repository Analysis](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/title.png)

> [!TIP]
> [English Version here](README-EN.md)

## ระบบวิเคราะห์และถอดรหัสโครงสร้าง GitHub Repository ด้วย AI

**REVERSE ENGINEER (v1.1.0)** เป็นเครื่องมือระดับวิศวกรรมสำหรับวิเคราะห์และทำความเข้าใจโครงสร้างซอฟต์แวร์ที่ซับซ้อน โดยการดึงบริบทจริงจาก GitHub, Local Path และ **Live Websites** โดยมีระบบ AI Agent ที่สามารถรัน Browser จริงเพื่อสกัดข้อมูลสถาปัตยกรรม (Architecture), ตรวจสอบ API Endpoints ลับ และสร้างพิมพ์เขียวทางเทคนิค (Technical Blueprints) ได้อย่างแม่นยำ

---

## คุณสมบัติหลัก

### 1. Web Dashboard (Bento UI)

- **Bento Interface**: การจัดวางข้อมูลแบบโมเดิร์นที่รวบรวมฟังก์ชันการทำงานไว้ในหน้าเดียว
- **Cinematic Dark Mode**: ดีไซน์ระดับพรีเมียมที่ออกแบบมาเพื่อลดมลภาวะทางสายตาสำหรับการวิเคราะห์เชิงลึก
- **Blueprint Mode**: ระบบสร้าง Technical Prompts สำหรับส่งต่อข้อมูลสถาปัตยกรรมไปยัง AI ตัวอื่นเพื่อการสร้างโค้ดที่มีความแม่นยำสูง

### 2. Professional 4-Phase TUI

- **Structured Workflow**: ระบบการทำงานแบบ 4 ขั้นตอน ตั้งแต่การตรวจสอบระบบ (Handshake), การสกัดข้อมูล (Extraction), การวิเคราะห์เชิงลึก (Synthesis) ไปจนถึงการส่งมอบข้อมูล (Delivery)
- **Engineering Aesthetics**: ธีมระดับพรีเมียมที่ได้รับแรงบันดาลใจจาก Claude พร้อมโลโก้ ASCII สำหรับผู้ใช้งานผ่าน Terminal

### 3. Blueprint Generation (The System Architect)

- แตกต่างจากการสรุปโค้ดทั่วไป โหมดนี้ออกแบบมาเพื่อสร้าง "ข้อกำหนดทางเทคนิค (Technical Specification)" ที่ครอบคลุมทั้งโครงสร้างข้อมูล, ตรรกะสำคัญ และความสัมพันธ์ระหว่างโมดูล
- เหมาะสำหรับการนำพิมพ์เขียวไปใช้ใน AI Coding Assistants เพื่อจำลองระบบหรือพัฒนาต่อยอด (Re-implementation)

### 4. Hybrid Analysis Engine (New in v1.1.0!)

- **Web Detective Mode**: รองรับการวิเคราะห์เว็บไซต์จริง (Live URLs) ไม่ใช่แค่ GitHub Repository อีกต่อไป
- **Browser Simulation (Playwright)**: AI สามารถสั่งเปิด Browser จริงเพื่อเรนเดอร์ JavaScript (SPA) และสแกนหา API ที่แอปเรียกใช้งานเบื้องหลัง (XHR/Fetch Sniffing)
- **Automatic De-obfuscation**: ระบบจัดรูปเล่มไฟล์ JavaScript ที่ถูกบีบอัด (Minified) ให้กลับมาอ่านง่ายโดยอัตโนมัติเพื่อให้ AI วิเคราะห์ตรรกะได้ลึกซึ้งที่สุด

### 5. Unified Launcher

- ระบบ Launcher ที่ช่วยให้เข้าถึงทั้ง Web Interface และ TUI Mode ได้ผ่านการควบคุมเดียว โดยระบบจะจัดการการทำงานของ Server ในพื้นหลังให้อัตโนมัติ

---

## หน้าตาของระบบ (Interface Showcase)

### 🕵️‍♂️ The Complete Engineering Journey (12-Step Walkthrough)

สัมผัสประสบการณ์การถอดรหัสซอฟต์แวร์เต็มรูปแบบ ตั้งแต่การเปิดเครื่องไปจนถึงการสกัดเอาพิมพ์เขียวออกมาครับ:

| Phase | Description | Interface Preview |
|-------|-------------|-------------------|
| **01** | **Launcher & Operation Select**: จุดเริ่มต้นภารกิจ เลือกโหมดการทำงาน | ![Step 01](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/01_launcher_menu.png) |
| **02** | **TUI Command Center**: ยินดีต้อนรับสู่ศูนย์บัญชาการ Terminal | ![Step 02](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/02_tui_main_menu.png) |
| **03** | **AI Provider Intelligence**: เลือกสมอง AI ที่คุณต้องการใช้งาน | ![Step 03](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/03_provider_config.png) |
| **04** | **Strategy Choice**: เลือกรูปแบบการวิเคราะห์ (Blueprint/Security/etc) | ![Step 04](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/04_prompt_selection.png) |
| **05** | **Deep Customization**: ปรับแต่ง Prompt ให้เข้ากับหน้างานจริง | ![Step 05](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/05_prompt_editor.png) |
| **06** | **Target Lockdown**: กำหนด Workspace และเป้าหมายการแง่ะ | ![Step 06](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/06_workspace_setup.png) |
| **07** | **Engine Handshake**: ตรวจสอบความพร้อมของระบบและเครือข่าย AI | ![Step 07](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/07_handshake_status.png) |
| **08** | **Deep Extraction**: สกัด Metadata และโครงสร้างไฟล์แบบละเอียด | ![Step 08](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/08_extraction_phase.png) |
| **09** | **Agent Sandbox Active**: AI เริ่มรัน Browser จริงเพื่อแง่ะ Logic ลึกซึ้ง | ![Step 09](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/09_agent_sandbox.png) |
| **10** | **Synthesis Complete**: AI ประมวลผลและสร้าง Technical Specification | ![Step 10](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/10_synthesis_complete.png) |
| **11** | **Multi-Format Export**: บันทึกผลลัพธ์ลงเครื่องในรูปแบบต่างๆ | ![Step 11](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/11_delivery_export.png) |
| **12** | **Engineering Insights**: พิมพ์เขียวสถาปัตยกรรมฉบับสมบูรณ์ | ![Step 12](https://raw.githubusercontent.com/JonusNattapong/Reverse-Engineer/main/assets/12_blueprint_showcase.png) |

---

## การเริ่มต้นใช้งาน

### 1. วิธีที่เร็วที่สุด (Quick Start)

สามารถรันผ่าน npx ได้ทันทีโดยไม่ต้องติดตั้ง:

```bash
npx blueprompt
```

### 2. การติดตั้งแบบถาวร (Installation)

```bash
npm install
```

### 3. การตั้งค่าระบบ (Configuration)

**REVERSE ENGINEER (blueprompt)** รองรับการตั้งค่าผ่าน 2 ช่องทาง:

1. **Persistent Config (แนะนำ)**: เมื่อรันโปรแกรมครั้งแรก ท่านสามารถเลือกเมนู `[*] Configure API Keys / Models` เพื่อบันทึก Key ลงในเครื่องอย่างถาวร (AppData) ทำให้ไม่ต้องกรอกใหม่ทุกครั้งที่เปลี่ยนโฟลเดอร์ทำงาน
2. **ไฟล์ .env**: หรือสร้างไฟล์ `.env` ที่ Root เพื่อระบุ API Keys:

```env
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
KILOCODE_API_KEY=your_key_here
GITHUB_TOKEN=recommended_for_higher_limits
```

### 4. การปรับแต่ง Prompt (Prompt Customization)

ท่านสามารถแก้ไข **System Prompt** ที่ AI ใช้ในการวิเคราะห์โค้ดได้เองผ่านเมนู `[P] Edit Prompt Templates` ซึ่งจะช่วยให้ท่านควมคุมพฤติกรรมของ AI Agent ได้ตามต้องการ (เช่น สั่งให้เน้นหาบั๊ก, สั่งให้สรุปแบบสั้นๆ หรือเปลี่ยนบุคลิก AI)

### 5. การรันระบบ

```bash
npm start
```

*ระบบจะเริ่มทำงานที่ `http://localhost:4040`*

---

## ฟีเจอร์ระดับ Pro (New!)

1. **Persistent Workspace**: ระบบจัดเก็บโปรเจกต์ถาวร สามารถกำหนด Path ได้เองผ่านเมนู [W]
2. **AI Memory**: ระบบจำสถาปัตยกรรมผ่านไฟล์ `SYSTEM_BLUEPRINT.md` ทำให้ AI ฉลาดขึ้นทุกครั้งที่วิเคราะห์
3. **Hybrid Web Agent**: AI Agent มี "ดวงตา" (Browser) สำหรับการท่องเว็บจริงเพื่อค้นหา API และ Logic ลับหลังบ้าน
4. **Full Terminal Access**: AI Agent สามารถสั่งรันคำสั่ง CMD ใน Workspace เพื่อการวิเคราะห์ที่ล้ำลึกที่สุด

สำหรับการรันคำสั่งโดยตรงผ่าน Terminal พร้อมพารามิเตอร์:

```bash
# วิเคราะห์ทั้ง Repository ในรูปแบบ Blueprint (ภาษาไทย)
npm run tui --url "[github-url]" --style blueprint --language Thai

# เจาะจงวิเคราะห์ไฟล์ด้วย Anthropic Claude
npm run tui --url "[github-file-url]" --provider anthropic --model claude-3-5-sonnet-latest
```

---

## โครงสร้างโครงการ

- `/cli`: ตรรกะและอินเทอร์เฟซผู้ใช้งานผ่าน Terminal
- `/server`: API Gateway และระบบการจัดการข้อมูลจาก GitHub
- `/public`: ระบบแสดงผลหน้าเว็บ (Dashboard)
- `index.js`: ระบบ Launcher หลัก

---

© 2026 REVERSE ENGINEER | Engineered for Architects and Security Researchers.
