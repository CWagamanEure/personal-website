# Personal website

A small Flask application for Cory Wagaman-Eure's portfolio, articles, and study planner. The old blog is preserved separately as an archive, while the new Articles section starts empty.

## Project structure

```text
website/
├── archive/
│   └── blog/            Previous blog posts and supporting files
├── content/
│   ├── articles/        Fresh Markdown articles
│   └── papers/          Archived research papers
├── static/
│   ├── css/             Shared and page-specific styles
│   ├── images/          Site images
│   └── js/              Page-specific browser behavior
│       └── demos/       Demo harness and one module per demo
├── templates/           Shared Jinja layouts and page templates
├── articles.py          Article discovery and rendering
└── routes.py            Public URL handlers
```

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

Open <http://127.0.0.1:5000>. Port `5000` deliberately keeps this site separate from other local apps using `localhost:8000`.

## Build for hosting

UMW's cPanel web root serves static files, so the Flask application is exported before deployment:

```bash
python build_static.py
```

The generated `dist` directory contains the complete deployable website. Run the build again after changing templates, styles, scripts, or articles.

## Adding an article

Create a Markdown file in `website/content/articles`. The filename becomes the URL slug, so `my-first-article.md` appears at `/articles/my-first-article/`.

```markdown
Title: My First Article
Date: 2026-08-18
Summary: A short description shown on the Articles page.
Tags: probability, markets

Write the article here using Markdown.
```

Articles are discovered automatically; no metadata file or route change is required.

## Adding a demo to an article

An article can carry interactive demos. Mount one anywhere in the Markdown:

```markdown
<div data-demo="mle-gaussian"></div>
```

Then write `website/static/js/demos/mle-gaussian.js`. The article page scans its
own rendered HTML for `data-demo` names and loads the harness plus a matching
module for each one, so a demo needs no front matter, route, or template change.
Articles without a demo load neither the harness nor its stylesheet.

The harness owns the controls, the seeded random number generator, canvas
sizing, and the optional animation loop. A demo declares its parameters, builds
state from them, and draws that state:

```js
Demos.register("coin-flips", {
  aspect: 0.45,
  notice: "One sentence on what the reader should watch for.",
  params: {
    n: { min: 1, max: 500, value: 50, step: 1, label: "flips" },
    coin: {
      label: "coin",
      value: "fair",
      choices: [{ value: "fair", label: "Fair" }, { value: "biased", label: "Biased" }],
    },
    bias: { min: 0.5, max: 1, value: 0.7, label: "bias",
            showWhen: (params) => params.coin === "biased" },
  },
  init: (params, rng) => ({ flips: rng.normalSample(params.n) }),
  step: (state, params, rng) => {},   // optional; its presence starts a loop
  draw: (ctx, state, params, size, theme, panel) => {},
  stats: (state, params) => ({ strip: [...], table: {...} }),   // optional
});
```

A parameter with `choices` renders as a dropdown; one with `showWhen` appears
only when that predicate holds, so a control never offers a knob that does
nothing. `stats` returns an optional readout below the canvas: `strip` is a list
of `{ label, value }` pairs and `table` is `{ columns, rows, best, caption }`.

`panel(rect, options)` draws a framed plot area and returns helpers that work in
data coordinates: `curve`, `bar`, `marker`, `shade`, and `legend`. Every
parameter change re-runs `init` against the same seed, so only *new sample*
changes the draw.

`stats.js` carries the distribution fitting used by the statistics demos —
Gaussian, Student t, and two-component mixture fits by maximum likelihood, plus
AIC and BIC. Its results are checked against brute-force optimisation in
`tests/test_stats.js`, which the Python suite runs under node.

See `website/content/articles/mle-gaussian.md` for a worked example.

## Archived blog

The previous blog posts and supporting files live in `website/archive/blog`. They are not routed, listed, or included in the new Articles section.

## Research

The research section and paper downloads are on by default. To hide them (and return 404 for the PDFs) set the flag off:

```bash
RESEARCH_ENABLED=false python app.py
```

## cPanel

The `.cpanel.yml` deployment copies the generated `dist` directory into `/home/corywaga/public_html`. In cPanel Git Version Control, use **Update from Remote** and then **Deploy HEAD Commit**.
