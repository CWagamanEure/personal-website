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

## Archived blog

The previous blog posts and supporting files live in `website/archive/blog`. They are not routed, listed, or included in the new Articles section.

## Archived research

The research section and paper downloads are disabled by default. The PDFs and homepage content remain preserved. Restore them with:

```bash
RESEARCH_ENABLED=true python app.py
```

## cPanel

The `.cpanel.yml` deployment copies the generated `dist` directory into `/home/corywaga/public_html`. In cPanel Git Version Control, use **Update from Remote** and then **Deploy HEAD Commit**.
