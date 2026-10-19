import shutil
import subprocess
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from build_static import build
from flask import render_template

from website import create_app
from website.articles import Article, get_article, load_articles


class SiteRoutesTestCase(unittest.TestCase):
    def setUp(self):
        app = create_app({"TESTING": True})
        self.client = app.test_client()
        archived_app = create_app({"TESTING": True, "RESEARCH_ENABLED": False})
        self.archived_client = archived_app.test_client()

    def test_main_pages_render(self):
        routes = (
            "/",
            "/articles/",
            "/study-planner.html",
        )

        for route in routes:
            with self.subTest(route=route):
                response = self.client.get(route)
                self.assertEqual(response.status_code, 200)

    def test_homepage_links_to_github(self):
        response = self.client.get("/")
        self.assertIn(b'href="https://github.com/CWagamanEure"', response.data)
        self.assertIn(b">github</a>", response.data)

    def test_articles_exclude_the_old_blog(self):
        response = self.client.get("/articles/")
        self.assertEqual(response.status_code, 200)
        self.assertNotIn(b"Moment Generating", response.data)
        self.assertNotIn(b"Prediction Markets", response.data)

    def test_homepage_hides_articles_until_one_is_published(self):
        response = self.client.get("/")
        if load_articles():
            self.assertIn(b'href="/articles/"', response.data)
        else:
            self.assertNotIn(b'href="/articles/"', response.data)

    def test_drafts_are_not_published(self):
        self.assertTrue(get_article("mle-gaussian", include_drafts=True).draft)
        self.assertIsNone(get_article("mle-gaussian"))
        self.assertEqual(self.client.get("/articles/mle-gaussian/").status_code, 404)
        self.assertNotIn(b"mle-gaussian", self.client.get("/articles/").data)
        self.assertNotIn(b"mle-gaussian", self.client.get("/").data)

    def test_article_with_a_demo_loads_its_scripts(self):
        article = get_article("mle-gaussian", include_drafts=True)

        app = create_app({"TESTING": True})
        with app.test_request_context():
            rendered = render_template("articles/detail.html", article=article)

        self.assertIn('data-demo="mle-gaussian"', rendered)
        self.assertIn("js/demos/harness.js", rendered)
        self.assertIn("js/demos/mle-gaussian.js", rendered)
        self.assertIn("css/pages/demos.css", rendered)

    def test_every_declared_demo_ships_its_script(self):
        for article in load_articles(include_drafts=True):
            for demo in article.demos:
                with self.subTest(article=article.slug, demo=demo):
                    script = Path("website/static/js/demos") / f"{demo}.js"
                    self.assertTrue(script.is_file())

    def test_demos_are_detected_from_the_markdown(self):
        article = get_article("mle-gaussian", include_drafts=True)
        self.assertEqual(article.demos, ("mle-gaussian",))

    def test_article_without_a_demo_stays_lean(self):
        plain = Article(
            slug="plain",
            title="Plain",
            published="2026-01-01",
            summary="",
            tags=(),
            demos=(),
            html="<p>No demo here.</p>",
        )

        app = create_app({"TESTING": True})
        with app.test_request_context():
            rendered = render_template("articles/detail.html", article=plain)

        self.assertNotIn("js/demos/", rendered)
        self.assertNotIn("css/pages/demos.css", rendered)

    def test_old_blog_routes_are_archived(self):
        routes = (
            "/blog/",
            "/blog/post.html?file=mgf.md",
            "/blog/posts/mgf.md",
        )

        for route in routes:
            with self.subTest(route=route):
                self.assertEqual(self.client.get(route).status_code, 404)

    def test_old_posts_are_not_articles(self):
        self.assertEqual(self.client.get("/articles/mgf/").status_code, 404)

    def test_legacy_routes_redirect(self):
        cases = {
            "/index.html": "/",
        }

        for route, expected_location in cases.items():
            with self.subTest(route=route):
                response = self.client.get(route)
                self.assertEqual(response.status_code, 301)
                self.assertTrue(response.headers["Location"].endswith(expected_location))

    def test_removed_lab_routes_return_404(self):
        routes = (
            "/market-microstructure/",
            "/market-microstructure/journal.html",
            "/market%20microstructure/",
        )

        for route in routes:
            with self.subTest(route=route):
                self.assertEqual(self.client.get(route).status_code, 404)

    def test_research_is_published_by_default(self):
        response = self.client.get("/papers/when_does_lvr_outrun_fees.pdf")
        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.mimetype, "application/pdf")
            self.assertIn(b'href="#research"', self.client.get("/").data)
        finally:
            response.close()

    def test_research_can_be_archived_with_feature_flag(self):
        self.assertEqual(self.archived_client.get("/papers/when_does_lvr_outrun_fees.pdf").status_code, 404)
        self.assertEqual(self.archived_client.get("/static/papers/when_does_lvr_outrun_fees.pdf").status_code, 404)
        self.assertNotIn(b'href="#research"', self.archived_client.get("/").data)

    def test_homepage_showcases_incerto(self):
        response = self.client.get("/")
        self.assertIn(b'href="https://terminal.incerto.app"', response.data)
        self.assertNotIn(b'class="logo-img"', response.data)

    def test_unknown_page_uses_custom_404(self):
        response = self.client.get("/definitely-not-a-page")
        self.assertEqual(response.status_code, 404)
        self.assertIn(b"Page not found", response.data)

    def test_static_site_build(self):
        with TemporaryDirectory() as directory:
            output_directory = Path(directory)
            build(output_directory)

            expected_files = (
                output_directory / "index.html",
                output_directory / "articles" / "index.html",
                output_directory / "static" / "js" / "demos" / "harness.js",
                output_directory / "study-planner.html",
                output_directory / "404.html",
                output_directory / ".htaccess",
                output_directory / "static" / "css" / "base.css",
            )
            for path in expected_files:
                with self.subTest(path=path):
                    self.assertTrue(path.is_file())


class DistributionFittingTestCase(unittest.TestCase):
    """The fitting maths lives in JavaScript, so its checks run under node."""

    @unittest.skipUnless(shutil.which("node"), "node is not installed")
    def test_fits_and_information_criteria(self):
        result = subprocess.run(
            ["node", str(Path(__file__).parent / "test_stats.js")],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
