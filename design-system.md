# Tea Sense visual system

## Information architecture and editorial layout

- Desktop navigation uses a 64px top rail with the brand, five primary destinations, and account/settings access. The mobile layout keeps the compact slide-out navigation.
- Main content is centered at a maximum width of 1200px. Use whitespace and clear type hierarchy to separate sections; reserve bordered surfaces for interactive or data-heavy areas.
- News uses a two-column editorial layout on wide screens and a single column on phones. Ranking, map, and flavor graph keep their existing data tools and interactions.
- Use a neutral paper/charcoal foundation, with tea green reserved for meaningful selected, focus, and category states. The dark theme follows the same neutral surfaces and semantic contrast.
- Body copy starts at 16px, controls have visible keyboard focus, and mobile navigation/actions retain at least 44px touch targets. Honor `prefers-reduced-motion`.
- `editorial-layout.css` is the presentation override layer for this structure. Keep behavior, data, and stable DOM hooks in `app.js`, `data.js`, `i18n.js`, and `index.html`.

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
