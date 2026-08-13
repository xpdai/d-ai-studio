# Accessibility Audit: D.AI 接案網站

**Standard:** WCAG 2.1 AA  
**Date:** 2026-08-13

## Summary

瀏覽器實測後發現手機版有四類互動元素低於 44px 建議高度：品牌首頁連結、頁首 CTA、服務區文字連結與需求範例按鈕。已擴大可點擊區域並重新檢查；目前所有可見連結、按鈕與欄位在 390px 寬度下皆至少為 44 × 44 CSS px。

**修正後未解決項目：0 Critical / 0 Major / 0 Minor。**

## Perceivable

- `lang="zh-Hant"` 已設定。
- 頁面具單一 `h1`，各主要區段使用 `h2`，服務與流程項目使用 `h3`，沒有跳級。
- Logo 圖形在已具文字名稱的首頁連結內使用空 `alt`，避免螢幕閱讀器重複朗讀。
- 主要文字組合的 WCAG 對比：

| Element | Foreground | Background | Ratio | Required | Result |
|---|---:|---:|---:|---:|---|
| 主文字 | `#14243A` | `#F4F7F5` | 14.49:1 | 4.5:1 | Pass |
| 次要文字 | `#526071` | `#F4F7F5` | 5.95:1 | 4.5:1 | Pass |
| CTA 白字 | `#FFFFFF` | `#3157F6` | 5.49:1 | 4.5:1 | Pass |
| 深色區白字 | `#FFFFFF` | `#14243A` | 15.63:1 | 4.5:1 | Pass |
| 薄荷狀態 | `#BDF4D0` | `#14243A` | 12.67:1 | 4.5:1 | Pass |
| 工程藍文字 | `#3157F6` | `#F4F7F5` | 5.09:1 | 4.5:1 | Pass |

## Operable

- 導覽、CTA、範例選項與複製操作均使用原生 `a` 或 `button`。
- 頁首提供「跳至主要內容」連結。
- 全站鍵盤焦點使用 3px 珊瑚橘輪廓與 4px offset；瀏覽器確認焦點樣式可見。
- 所有可見互動元素的手機觸控範圍皆達 44px。
- `prefers-reduced-motion: reduce` 會停止動畫與平滑捲動，並直接顯示 reveal 內容。

## Understandable

- 四個輸入欄位都有可見 `label`；需求草稿輸出有 `aria-label` 與 `readonly` 狀態。
- 複製結果透過 `role="status"` 與 `aria-live="polite"` 宣告。
- 自動複製失敗時會選取輸出文字並提供明確的手動複製指示。
- 表單文字明確說明資料不會送出或儲存。

## Robust

- 頁面具 `header`、`nav`、`main`、`footer` landmark。
- 瀏覽器 DOM snapshot 中所有互動元素都有可辨識名稱；沒有匿名按鈕或連結。
- 桌面與手機瀏覽器 console 均無錯誤或警告。

## Manual follow-up

正式上線前仍建議以 macOS VoiceOver 或 Windows NVDA 完整走一次表單；本次稽核已檢查 DOM 語意、鍵盤焦點、目標尺寸、文字對比與 live region，但未啟動桌面螢幕閱讀器進行真人語音流程測試。
