# Marcus Amps-Woodward — sports photography

A configurable sports photography portfolio built with React 19, TypeScript, Vite, React Router and Cloudinary. The existing `RouterConfig` browser routing, CSS modules and integration folders are retained.

## Development and checks

Use Node 22.22.2+ (or Node 24.15+) and npm:

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

Vite builds a static SPA into `dist/`. This project does not currently use SSR or require an application server. The preview command is for checking a build locally; production should use a static host.

## What is included

- Album loading with a shared, cloud/tag-keyed promise cache; concurrent consumers and navigation reuse requests.
- Loading, empty and error states with an explicit retry. A failed request is removed from the cache.
- Configurable albums; curated public IDs or public Cloudinary tags.
- Homepage highlights taken from the same featured album as the portfolio.
- Native lazy image loading, optimized Cloudinary image delivery, and 24-at-a-time gallery rendering.
- A homemade photo viewer: native modal dialog, focus containment/restoration, Escape, arrow keys, swipe, wrapping navigation and captions.
- Album/photo URLs that can be shared or opened directly. Photo enquiries carry the image reference into the contact form.
- A client-only enquiry composer with validated fields, a prefilled starter message, email draft, clipboard and text download.
- Responsive sports styling using central CSS tokens, reduced-motion support, keyboard focus indicators, a skip link and a 404 page.
- Static-host configuration and a corrected Docker build.

## Edit the content

| File | Purpose |
| --- | --- |
| `src/config/SiteConfig.ts` | Name, role, headline, introduction, about copy, services, Instagram, email and enquiry starter |
| `src/config/PortfolioConfig.ts` | Albums, display order, descriptions, tags/public IDs and captions |
| `src/config/PhotographyConfig.ts` | Hero/story photographs, independent cloud names, crop positions and parallax strengths |
| `index.css` | Colours, fonts, spacing, buttons and other shared visual tokens |
| `public/locales/en/translation.json` | Existing i18next page/navigation labels |

The cloud name `dx4aoiw5u` is public configuration, not a secret. For now, the supplied `Decaprio` public ID is used in a **labelled preview collection**. It is a delivery test, not Marcus’s sports photography. You can set the cloud to `demo` to preview the viewer with two sample photographs.

### Albums and Cloudinary

A curated album works without Cloudinary Resource list access:

```ts
{
  id: 'race-day',
  title: 'Race day',
  category: 'Athletics',
  description: 'The action, the crowd and the finish.',
  publicIds: ['events/race/start', 'events/race/finish'],
  captions: { 'events/race/finish': 'The final push, race day' }
}
```

Alternatively, use `tag: 'race-day'` instead of `publicIds`. Tags are **not folder names**. Apply that tag to images in Cloudinary, and enable public Resource list delivery only for images intended for public display. The supplied cloud currently returns 401 for list delivery, so the preview deliberately uses a curated list.

See [Cloudinary’s public asset-list documentation](https://cloudinary.com/documentation/list_assets). Tag lists are public delivery endpoints, not the authenticated Admin API. Cloudinary also caches its tag-list JSON on its CDN, so newly tagged photographs may not appear immediately.

The shared cache keeps immutable image-ID lists for 30 minutes within the current page session. It deduplicates in-flight requests (including React StrictMode), caches empty results and evicts errors. After expiry, the next consumer reloads. Retry explicitly refreshes the current album and still deduplicates simultaneous retries. Reloading the browser starts a new session. This reduces redundant metadata requests; it does **not** eliminate image delivery bandwidth or Cloudinary charges. Generated image URLs are local SDK operations; image bytes use browser/CDN caching.

Replace the preview album with real collections, add descriptive captions, and set `isPreviewPortfolio = false` before launch. Homepage highlights automatically use the first configured album; change `featuredAlbumId` for another choice. The portfolio shows **all configured albums as large, stacked filmstrip galleries**. The collection links jump to those sections, and clicking a photograph opens its album in the focused carousel. Each gallery shows 24 frames initially with a load-more button.

The preview currently contains one explicit public ID (`Decaprio`), so it displays one photograph. No Cloudinary account change is needed to use this preview or to add curated `publicIds`. Add Marcus’s uploaded IDs to make a larger collection, or configure a tag as described above.

## Contact/email

Copy `.env.example` to `.env.local` and set `VITE_CONTACT_EMAIL`. The default `marcus@example.com` is a visibly labelled **non-deliverable test address**.

Visitors write on the website. **Open email draft** uses a standards-based `mailto:` link to ask their configured desktop/mobile/webmail handler to open a draft. They must review and send it from there. The website cannot detect whether the handler opened or the message was sent. It never claims successful delivery.

There is no email service, API key, backend or enquiry storage. Clipboard and a downloadable plain-text draft provide alternatives when no handler is configured; clipboard failures show a selectable draft. Long messages are directed to those alternatives rather than relying on email-app URL limits. Nothing is sent while composing. Drafts are not persisted after reload/navigation.

For reliable sending directly from the website, a hosted form/email service or backend would be needed. That is an architectural decision for a separate change. [MDN’s email-link documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Creating_links) describes the mail-handler behavior.

## Homepage parallax and profile photograph

The original basketball example is restored from Cloudinary’s `demo/cld-sample-3`. Its cloud is independent of the `dx4aoiw5u` portfolio cloud, so the example does not produce a missing-image request there. To replace it, set **both** `VITE_CLOUDINARY_HERO_CLOUD_NAME=dx4aoiw5u` and `VITE_CLOUDINARY_HERO_ID=<your public ID>`.

`PhotographyConfig.ts` preserves the original parallax container strength (`300`) and custom photo travel (`700`). The image overscans its container to prevent blank edges, and its travel is capped for short viewports. Desktop and mobile crop positions can be configured separately. The story section uses a quieter grayscale layer with strength `100` and travel `120`; change its photograph or disable its `parallax.enabled` setting there. Both effects become static when visitors request reduced motion.

The previous header thumbnail is now stored at `public/photos/MarcusProfile.jpg`, and the header/about page both use the configurable profile URL. Replace that file with Marcus’s full-resolution portrait, or set `VITE_PROFILE_PHOTO_URL` to a public Cloudinary delivery URL. This removes the dependency on the previous external thumbnail endpoint.

## Public environment configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_CLOUDINARY_CLOUD_NAME` | `dx4aoiw5u` | Public Cloudinary cloud name |
| `VITE_CLOUDINARY_HERO_ID` | `cld-sample-3` | Homepage hero public ID |
| `VITE_CLOUDINARY_HERO_CLOUD_NAME` | `demo` for the example, portfolio cloud for a custom ID | Independent cloud for the hero image |
| `VITE_PROFILE_PHOTO_URL` | `/photos/MarcusProfile.jpg` | Local profile photograph or public Cloudinary URL |
| `VITE_CONTACT_EMAIL` | `marcus@example.com` | Public enquiry address |

All `VITE_` values are embedded in client assets at build time. **Never put Cloudinary API keys/secrets, email provider credentials or other private credentials in them.** Cloudinary’s public cloud name and photograph IDs do not need a secrets service. If private APIs are added later, their credentials belong on a server/platform secrets store.

Local environment files are ignored by Git and excluded from Docker’s context. A source scan found no embedded private credentials in the current integration. Public photographs and recipient email addresses are inherently visible to visitors.

## Hosting

Build command: `npm run build`. Output directory: `dist`. Set the public environment variables in your hosting provider **before building**. Every non-file application URL must fall back to `index.html` so refreshing `/portfolio`, `/contact` or a shared photo link works.

- Netlify/Cloudflare Pages: `public/_redirects` is copied to `dist` and provides the SPA fallback.
- Vercel: `vercel.json` provides the application-route rewrite.
- Other static hosts: configure the same fallback and serve existing assets normally.
- GitHub Pages needs a subpath/base and routing strategy change; do not deploy this root-path SPA there unchanged.

See [Vite’s static deployment guide](https://vite.dev/guide/static-deploy.html).

### Docker

```sh
docker build -t marcus-photo \
  --build-arg VITE_CLOUDINARY_CLOUD_NAME=dx4aoiw5u \
  --build-arg VITE_CLOUDINARY_HERO_CLOUD_NAME=dx4aoiw5u \
  --build-arg VITE_CLOUDINARY_HERO_ID=Decaprio \
  --build-arg VITE_CONTACT_EMAIL=marcus@example.com .
docker run --rm -p 3000:80 marcus-photo
```

This builds `dist` in Node and serves it with nginx. `nginx.conf` supplies the SPA fallback and immutable caching for hashed assets. Public configuration is baked into the build; runtime environment changes do not rewrite the generated assets.

## Before launching Marcus’s real site

1. Upload Marcus’s photographs and replace the labelled test collection/hero with the actual public IDs or tags.
2. If using tags, verify public Resource list delivery and that every intended album loads.
3. Replace the test email, review the marketing copy/services and verify the profile photograph.
4. Set descriptive captions, remove the preview flag and rebuild with the real public environment values.
5. Configure HTTPS and confirm direct-route refreshes, shared photo links, mobile layout, and an actual email draft on the target devices.
6. Review usage and delivery settings in Cloudinary; the client cache reduces repeated requests but is not a billing cap.

## Original feature list

- [x] Homemade image carousel for portfolio collections.
- [x] Homepage highlights connected to the portfolio.
- [x] Configurable album/content definitions.
- [x] Consistent, configurable sports UI.
- [x] Repair `usePortfolio` and avoid redundant list requests.
- [x] Lazy portfolio images and incremental gallery rendering.
- [x] Production build, static hosting and public/private credential guidance.
- [x] Client-side contact drafting with portable fallbacks.
- [x] Photographer additions: shareable photo links, captions and image-specific print/licensing enquiries.

Design reference: [sports website inspiration](https://www.designrush.com/best-designs/websites/trends/best-sports-websites).
