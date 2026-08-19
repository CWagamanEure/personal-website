from pathlib import Path

from flask import Blueprint, abort, current_app, redirect, render_template, send_from_directory, url_for

from .articles import get_article, load_articles


site = Blueprint("site", __name__)
PAPER_DIRECTORY = Path(__file__).parent / "content" / "papers"


@site.get("/")
def home():
    return render_template("home.html")


@site.get("/index.html")
def legacy_home():
    return redirect(url_for("site.home"), code=301)


@site.get("/articles/")
def articles_index():
    return render_template("articles/index.html", articles=load_articles())


@site.get("/articles/<slug>/")
def article_detail(slug):
    article = get_article(slug)
    if article is None:
        abort(404)
    return render_template("articles/detail.html", article=article)


@site.get("/study-planner.html")
def study_planner():
    return render_template("study_planner.html")


@site.get("/papers/<path:filename>")
def paper(filename):
    _require_research_enabled()
    return send_from_directory(PAPER_DIRECTORY, filename)


@site.app_errorhandler(404)
def not_found(_error):
    return render_template("errors/404.html"), 404


def _require_research_enabled():
    if not current_app.config["RESEARCH_ENABLED"]:
        abort(404)
