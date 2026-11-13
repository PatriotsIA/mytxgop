# Senate manual count request

`/senate-count` publishes Dan Rogers's supplied letter and five chair instructions.
The shared notice appears immediately above the lawsuit notice on the home,
state and county pages, including county subpages. Its notes start collapsed;
mouse hover opens them, and the native disclosure supports touch and keyboard.
Learn more opens the information page; separate download buttons provide the
PDF and editable Word (.docx) letter on both the banner and information page.

The letter is preserved verbatim in `src/data/senate-count-template.txt`.
The five notes are in `src/data/senate-count.ts`. Per the user's instructions,
notes appear only on the information page and banner, never in the downloads.
No editorial or legal guidance is added to the supplied text.

Regenerate the PDF and editable Word document with:

```sh
node scripts/build-senate-count-template.mjs
```

This requires Chromium, `pdftotext`, and Python 3; the generator verifies the
complete PDF text against the source, ignoring only whitespace introduced by
pagination. The Word generator uses Python's standard library and compares
every document paragraph against the same source. Regenerate Word alone with
`python3 scripts/build-senate-count-docx.py`. The document uses editable normal
paragraphs, with no protection or form-field restrictions.
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

Word-download update: the editable-text link is replaced by a `.docx` download,
also available directly from every shared banner. The Word file opens in
LibreOffice, renders as two US Letter pages, and preserves every source
paragraph. Its rendered text was checked after joining wrapped hyphenated
words, and both pages were visually reviewed. Browser checks confirm the
downloaded bytes, page and banner links, unchanged PDF and notes behavior, and
layouts from 320px to 1440px. Node 22 lint and production build pass.
