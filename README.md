# GOP Connect

Responsive React + Vite + TypeScript SPA for county GOP sites across all 254 Texas counties.

## Commands

```bash
npm install
npm run dev
npm run build
```

## County Data

All county routes are powered by `src/data/counties.ts`. The registry uses the official 254-county list, generates slugs with `src/lib/slugifyCounty.ts`, and creates default county records with `src/data/defaultCountyFactory.ts`.

County-specific content belongs in override files such as `src/data/potterCounty.ts`, then gets added to the `countyOverrides` map in `src/data/counties.ts`. Do not create separate React pages per county.

## Calendar Feeds

Set `county.calendar.icsUrl` for a single county ICS feed, or `county.calendar.icsUrls` for multiple feeds. Potter County is seeded with its configured Mighty Networks calendar feed.

Mighty calendar links often start with `webcal://`. Add the stable URL without `nocache` or tracking params when possible:

```ts
calendar: {
  icsUrls: [
    "webcal://community.patriotsinaction.com/spaces/{spaceId}/calendar.ics?calendar_token={token}"
  ],
  proxyUrl: "/api/calendar?county=potter",
  submitEventUrl: "/potter/submit-event",
  useInternalSubmitEventForm: true
}
```

The React app normalizes `webcal://` to `https://`, combines multiple ICS feeds into one calendar, parses feeds with `ical.js`, expands recurring events up to two years, removes duplicate title/start-time matches, filters past events, and paginates three events at a time.

Direct browser fetches can fail when the remote ICS host does not allow CORS. This repo includes a Vercel-style allowlisted proxy at `api/calendar.ts`, used by Potter through `/api/calendar?county=potter`. The proxy should:

- Look up the county from configured server-side county data.
- Fetch only allowlisted `icsUrl` or `icsUrls` values for that county.
- Never accept arbitrary feed URLs from query strings.
- Return the ICS text with an appropriate content type.

On Vercel, `api/calendar.ts` uses the `county` query param to resolve configured URLs. On Netlify, port the same allowlist into `netlify/functions/calendar.ts` and route `/api/calendar` to that function. Kinsta or other static hosts need an equivalent serverless/API rewrite.

## EmailJS Setup

This app uses EmailJS from the browser for contact and event submission forms. It does not include a custom email backend.

1. Create an EmailJS account.
2. Connect the sending email service.
3. Create one template that can handle both contact and event submissions.
4. Copy the Service ID, Template ID, and Public Key.
5. Add them to `.env` or `.env.local`:

```bash
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_DEFAULT_CONTACT_TO_EMAIL=info@mytexasgop.com
```

6. Configure allowed domains in EmailJS for `localhost`, `mytexasgop.com`, and any preview domains.
7. Run `npm run dev`.
8. Test `/potter/contact-us` and `/potter/submit-event`.

Only `VITE_*` variables are exposed to the Vite client. Never put private email provider credentials in this app. The recipient email comes from county data or the default fallback, not from user input. Enable EmailJS allowed domain restrictions, and add reCAPTCHA if spam becomes a problem.

The shared template receives `submission_type` as either `contact` or `event`, so the same EmailJS template can format the email conditionally or include all fields.

Contact template variables: `submission_type`, `county_name`, `county_slug`, `to_email`, `from_name`, `from_email`, `phone`, `subject`, `message`, `page_url`, `submitted_at`.

Event template variables: `submission_type`, `county_name`, `county_slug`, `to_email`, `submitter_name`, `submitter_email`, `submitter_phone`, `event_name`, `event_date`, `event_start_time`, `event_end_time`, `event_location`, `event_address`, `event_description`, `event_url`, `requested_calendar`, `consent`, `page_url`, `submitted_at`.

## SPA Redirects

Netlify uses `public/_redirects`:

```text
/* /index.html 200
```

Vercel uses `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

For Kinsta or other static hosting, configure all non-file requests to rewrite to `index.html`.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
