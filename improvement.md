## PDF 履歷

位子：Experience 旁邊建立 Resume 導覽入口

導覽順序：
```
Home
Experience
Resume
Photography
Blog
Contact
```

不要把完整 PDF 直接嵌入首頁。PDF viewer 在手機上的體驗不穩定，也會破壞首頁快速掃描作品的節奏。

### 架構

```
/zh/resume
/en/resume

/resume/Ethan-Chan-Resume-EN.pdf
/resume/Ethan-Chan-Resume-ZH.pdf
```

我會把 PDF 放在 `public/resume` 目錄下：

```
public/
└── resume/
    ├── Ethan-Chan-Resume-EN.pdf
    └── Ethan-Chan-Resume-ZH.pdf
```

Resume 頁面不需要複雜，建議包含：

```
Resume
Software Engineering · Database Design · System Architecture

Last updated: July 2026

[View English PDF] [Download English PDF]
[View Chinese PDF] [Download Chinese PDF]

Desktop PDF preview
```

### PDF 入口的優先級

* Header 的 Resume
* Experience 頁面頂部的 View Resume PDF
* 首頁 Projects 後方 CTA 的 Resume
* Footer 的次要連結

## 首頁排版修改

從工具包開始修改。

改成

```
Hero                        保持不變

Toolbox / Capabilities
├── 短版說明
├── Current Focus
└── Capability cards

Projects carousel

Closing CTA
├── View Experience
├── Resume PDF
└── Contact

Footer
```

### A. Toolbox：從工具清單改成能力架構

目前有 9 個 skill group，合併成 8 個較清楚的能力群組：

1. Backend Engineering
2. Database & Data Modeling
3. System Architecture
4. Web Development
5. AI Applications
6. Drone & Computer Vision
7. DevOps, Cloud & Containers
8. Automation & IoT

source 裡有一個被註解掉的 System Architecture group，恢復它，並放在前三個位置。

Desktop 版的 Toolbox 改成 3 欄，Mobile 版改成 2 欄。以下 CSS 內容 **JUST FOR REFERENCE**：

```css
.skill-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .skill-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .skill-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

工具包說明目前同時放了 Python、AI、網站與無人機專題描述，資訊比較集中。 縮成一行，再獨立加入三個 Current Focus 標籤：

```
Current Focus

AI Agent Applications
Backend & Data Systems
UAV Vision Navigation
```

### B. 降低專案卡片的 badge 密度

目前每張卡片同時把完整 tech stack 和 highlights 都做成 badge。

例如第一個專案有七個技術 stack 加四個 highlights，視覺上容易變成一大片膠囊標籤。

建議每張卡片改成：

```
[AI APPLICATION]                       Private

Local AI Customer Service System

Local-first customer service workflow with
agent decision-making and LINE integration.

Role
System Design & Implementation

Python · Flask · LlamaIndex · Docker · +3

• Agent workflow design
• Local model deployment

[Project overview]
```

規則：

* 技術 badge 最多顯示 4 個
* 剩餘項目使用 +3
* Highlights 改成普通 bullet，不再使用 badge
* 加上 Role、Year 或 Project Type
* CTA 固定在卡片底部

### C. 移除重複 GitHub 連結

目前專案標題本身連到 GitHub，卡片底部又有一次 GitHub link。

保留底部 CTA 即可，標題保持普通文字，避免使用者不知道點擊標題會離開網站。

第一個 private project 現在的 GitHub URL 指向你的 GitHub 個人首頁，容易讓人誤以為專案 repository 可以公開查看。

改成：

```
Private Project
Repository unavailable
```

### D. Projects 後方加入結尾 CTA

現在 ProjectCarousel 後就直接結束首頁。補一個簡潔 CTA panel：

```
Explore more:

[View Experience] [Resume PDF] [Contact]
```
