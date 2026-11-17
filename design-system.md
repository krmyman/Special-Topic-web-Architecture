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
