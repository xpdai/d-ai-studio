# D.AI 接案形象網站

一頁式靜態形象網站，完整介紹網站、系統、自動化、API、AI 與 Shopify 客製開發服務。訪客可以從常見情境開始，填寫四個簡短欄位，產生一段可直接複製的洽談草稿。

## 本機預覽

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

開啟 `http://127.0.0.1:4173/`。

## 執行測試

```bash
npm test
```

網站沒有 runtime dependency，也不會傳送或儲存訪客輸入。

## 更換聯絡方式

目前所有主要 CTA 都導向頁內的需求草稿產生器。取得正式聯絡網址後，修改 `js/app.js` 頂端的 `CONTACT_URL`：

```js
const CONTACT_URL = 'https://你的聯絡網址';
```

可使用 LINE、Email、Instagram、Messenger 或其他聯絡頁。設定為空字串時會自動維持 `#contact`。

## 品牌資產

- Logo 圖形：`assets/logo-mark.svg` / `assets/logo-mark.png`
- 橫式字標：`assets/logo-lockup.svg` / `assets/logo-lockup.png`
- 品牌名稱、概念與色票：`docs/brand-guide.md`
- 網站設計規格：`docs/superpowers/specs/2026-08-13-freelance-engineer-site-design.md`

品牌名稱為 **D.AI**，呼應創辦人的名字 Dai，也保留數位產品與 AI 技術的聯想。正式申請公司、商號、商標或網域前，請另行完成可用性與權利檢索。
