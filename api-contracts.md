# Tea Sense API contracts (proposal)

These are migration contracts for a future same-origin server. No endpoint below is active in this prototype. Keep secrets on the server; return user-safe errors and avoid exposing model internals.

## Shared shapes

```json
{
  "Drink": {
    "id": "stable-string-id",
    "name": "localized display name",
    "category": "tea | milk | fruit | other",
    "teaType": "localized tea type or null",
    "flavors": ["stable flavor ids"],
    "ingredients": ["stable ingredient ids"],
    "toppings": ["stable topping ids"],
    "allergens": ["stable allergen ids"],
    "allergenStatus": "verified | unverified | unknown",
    "caffeine": { "level": "none | low | medium | high | unknown", "mg": null },
    "nutrition": { "caloriesMin": null, "caloriesMax": null, "unit": "kcal", "source": "unknown" },
    "sweetnessOptions": ["unsweetened", "light", "regular"],
    "updatedAt": null
  }
}
```

IDs remain stable across locale changes. `null` means unknown; it must not be converted to zero or treated as verified safe.

## Endpoints

### `POST /api/recommendations`

Request: `{ "query": "string", "preferences": { "maxCalories": 300, "caffeine": "none", "teaTypes": ["oolong"], "excludeAllergens": ["dairy"], "toppings": ["boba"] }, "conversation": [{ "role": "user|assistant", "content": "string" }], "locale": "zh-Hant|en|ja|ko" }`.

Response: `{ "requestId": "string", "items": [{ "drink": "Drink", "score": 0.0, "reason": "string", "adjustment": "string" }], "appliedFilters": [], "relaxableFilters": [], "warnings": [] }`.

Return `items: []` for no match; never relax allergy exclusions automatically. Suggested statuses: 200 success, 400 invalid input, 429 rate limit, 503 unavailable.

### `GET /api/rankings?category=tea&period=week&sort=popular&cursor=`

Response: `{ "items": [{ "drink": "Drink", "rank": 1, "count": 0 }], "period": "week", "updatedAt": "ISO-8601", "nextCursor": null }`.

### `GET /api/places?lat=...&lon=...&radiusMeters=1000&category=tea&openNow=true`

Response: `{ "items": [{ "id": "string", "name": "string", "coordinates": { "lat": 0, "lon": 0 }, "distanceMeters": 0, "openNow": null, "hours": [], "source": "string", "updatedAt": "ISO-8601" }], "attribution": [] }`.

### `GET /api/news?locale=zh-Hant&cursor=`

Response: `{ "items": [{ "id": "string", "title": "string", "summary": "string", "category": "string", "sourceName": "string", "sourceUrl": "https://...", "publishedAt": "ISO-8601", "imageUrl": null }], "nextCursor": null }`.

### `POST /api/feedback`

Request: `{ "type": "string", "content": "string", "locale": "zh-Hant|en|ja|ko" }`.

Response: `{ "receiptId": "string", "receivedAt": "ISO-8601" }`. Only show a delivered confirmation after the server accepts the request.

## UI states expected from every API adapter

Expose `loading`, `success`, `empty`, `offline`, `error`, and `cancelled` states. Treat abort as cancellation rather than a service failure. Validate status and response shape before rendering. Use same-origin endpoints, bounded timeouts, and server-side authentication/rate limits where needed.
