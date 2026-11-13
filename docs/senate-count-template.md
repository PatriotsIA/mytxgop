# Senate manual count request

`/senate-count` publishes Dan Rogers's supplied letter and five chair instructions.
The shared notice appears immediately above the lawsuit notice on the home,
state and county pages, including county subpages. Its notes start collapsed;
mouse hover opens them, and the native disclosure supports touch and keyboard.
Learn more opens the information page and Download template downloads the PDF.

The letter is preserved verbatim in `src/data/senate-count-template.txt`.
The five notes are in `src/data/senate-count.ts`. Per the user's instructions,
notes appear only on the information page and banner, never in the downloads.
No editorial or legal guidance is added to the supplied text.

Regenerate the PDF and editable text with:

```sh
node scripts/build-senate-count-template.mjs
```

This requires Chromium and `pdftotext`; the generator verifies the complete
PDF text against the source, ignoring only whitespace introduced by pagination.
The checked-in static downloads are served from `/forms/`. No server or external
PDF service is involved. The information page also offers Copy letter.

Publish through the existing `main` Amplify build. `pottercountygop.com` redirects
to `https://mylocalgop.com/tx/potter`, so the Potter county notice covers that
entry point. Confirm the new page and PDF live before releasing the separately
requested Paxton ad removal on The County Post.

Validation: Node 22 lint, production build and all 8 existing unit tests pass.
Browser review covers the home page, Texas state page, Potter, Harris, Los
Angeles, Potter leadership and lawsuit pages. The notice precedes the lawsuit,
starts collapsed, opens and closes by hover, tap and keyboard, and has working
Learn more and PDF download actions. Desktop and 390px mobile layouts fit the
viewport. The information-page letter, copied text, editable download and PDF
match the source. Both PDF pages were visually reviewed. No page errors were
observed during the browser checks.
