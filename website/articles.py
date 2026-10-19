import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path

from markdown import Markdown


ARTICLE_DIRECTORY = Path(__file__).parent / "content" / "articles"
DEMO_PATTERN = re.compile(r'data-demo="([\w-]+)"')


@dataclass(frozen=True)
class Article:
    slug: str
    title: str
    published: str
    summary: str
    tags: tuple[str, ...]
    demos: tuple[str, ...]
    html: str
    draft: bool = False

    @property
    def display_date(self):
        if not self.published:
            return ""
        try:
            return date.fromisoformat(self.published).strftime("%B %-d, %Y")
        except ValueError:
            return self.published


def load_articles(include_drafts=False):
    """Published articles, newest first. Drafts stay out unless asked for."""
    articles = [_load_article(path) for path in ARTICLE_DIRECTORY.glob("*.md")]
    if not include_drafts:
        articles = [article for article in articles if not article.draft]
    return sorted(articles, key=lambda article: article.published, reverse=True)


def get_article(slug, include_drafts=False):
    return next(
        (article for article in load_articles(include_drafts) if article.slug == slug),
        None,
    )


def _load_article(path):
    renderer = Markdown(extensions=("meta", "fenced_code", "tables"))
    html = renderer.convert(path.read_text(encoding="utf-8"))
    metadata = renderer.Meta

    return Article(
        slug=path.stem,
        title=_metadata_value(metadata, "title") or path.stem.replace("-", " ").title(),
        published=_metadata_value(metadata, "date"),
        summary=_metadata_value(metadata, "summary"),
        tags=tuple(
            tag.strip()
            for tag in _metadata_value(metadata, "tags").split(",")
            if tag.strip()
        ),
        demos=_demo_names(html),
        html=html,
        draft=_metadata_value(metadata, "draft").lower() in {"1", "true", "yes"},
    )


def _demo_names(html):
    """Names of the demo modules an article mounts, in first-appearance order."""
    return tuple(dict.fromkeys(DEMO_PATTERN.findall(html)))


def _metadata_value(metadata, key):
    values = metadata.get(key, [])
    return values[0].strip() if values else ""
