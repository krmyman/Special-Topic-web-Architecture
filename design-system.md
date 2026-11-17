# Tea Sense visual system

## Foundations

- **Canvas and surfaces:** `--paper`, `--white`, `--line`; night theme overrides these tokens through `body.dark`.
- **Primary tea green:** `--green`, `--green-dark`, `--green-soft`.
- **Accent flavors:** `--gold`, `--gold-soft`, `--rose`; use for category accents and chart series.
- **Typography:** DM Sans with Noto Sans TC/JP/KR fallbacks. Global scaling is controlled by `--font-scale`.
- **Shape:** small controls use 7–9 px radius, cards 10–14 px, pills 20 px or more. Keep focus rings visible in both themes.
- **Motion:** short opacity/translate transitions; all motion must honor `prefers-reduced-motion`.

## Drink illustrations

The recommendation card uses one cup silhouette and category-specific palette: pure tea (sage), milk (warm cream), fruit (citrus), other (tea beige). The emoji is a temporary sample garnish. Replace emoji with a commissioned or authored SVG asset while preserving a shared viewBox, baseline, contrast, and alt-text policy.

## Flavor graph

- Tea nodes use sage, flavor nodes use gold, topping nodes use rose.
- Edge weights are sample scores from 1 to 5; line thickness and opacity communicate strength. They are illustrative values, not model confidence.
- Selection dims unrelated nodes and retains keyboard focus indication. The graph legend must explain both node types and edge weight.

## Component behavior

Recommendation cards order information as name, flavor, reason, adjustment, nutrition/caffeine, allergen caveat, then actions. Empty and error states include a next action. Dark-theme equivalents should use the same semantic tokens and maintain readable contrast.

## 2026-11-17 茶室 UI 更新

- `refresh.css` 在既有樣式後載入，集中管理新版色票、首頁排版與控制元件。
- 首頁採左右文字與茶杯插畫，小螢幕改為置中單欄；插畫為本機 `assets/daily-cup.svg`，不依賴外部圖片。
- 日夜主題維持相同幾何配置，偏好、對話與多語系沿用既有行為及文字。
- 輸入框、送出按鈕及快速需求加強視覺層級；鍵盤操作保留明顯焦點。
- 驗證：既有 Node 測試 10/10 通過；Chrome 實測桌面 1440×960、手機 390×844 無水平溢位，偏好開關、對話送出及排行切換可操作，未觀察到 JavaScript 頁面錯誤。另檢查夜間英文手機首頁無水平溢位。
- 預覽截圖：`preview/desktop.png`、`preview/mobile.png`。
- 此次為本機修改，未部署或推送原始儲存庫。

## v7.0.5 手機版修正（2026-11-17）

- 排行榜搜尋欄獨立一列，篩選選單並列；飲品卡改為具彈性文字欄的網格，避免名稱逐字換行。
- 風味圖允許區域內橫向滑動，保留節點大小，左右節點皆可捲動至可見處並點選。
- 對話訊息與比較表各自保留排版空間；比較表可捲動，不再與訊息互相遮蓋。
- 手機對話中的回饋按鈕移至頁尾，避免遮住送出或比較操作。
- Chrome 手機模擬操作通過：偏好選擇與套用、快捷推薦、換一杯、加入比較、確認重置、排行搜尋／清空／更新、店家篩選、定位拒絕提示、風味圖兩側節點、示範回饋、語言與夜間設定保存。
- 此次驗證使用瀏覽器手機模擬，未以實體 iOS Safari 或 Android 手機測試。
