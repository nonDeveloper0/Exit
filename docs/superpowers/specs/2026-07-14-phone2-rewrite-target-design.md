# phone2 rewrite target design

## Goal

Keep the public route `/screen/phone2` unchanged while serving the already-present `public/screen/dongguri_phone_room.html` static screen instead of `public/screen/phone2.html`.

## Approach

Update only the `/screen/phone2` entry returned by `rewrites()` in `next.config.ts`:

```ts
{ source: "/screen/phone2", destination: "/screen/dongguri_phone_room.html" }
```

Next.js rewrites preserve the incoming URL, so visitors continue to see `/screen/phone2`. The destination is an existing file in `public/screen/`; no screen HTML, additional route, redirect, or compatibility alias is needed.

## Validation

Run the project lint command and inspect the rewrite entry to confirm the route retains its original source and has the requested destination.
