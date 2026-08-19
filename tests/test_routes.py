import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from build_static import build
from website import create_app


class SiteRoutesTestCase(unittest.TestCase):
    def setUp(self):
        app = create_app({"TESTING": True})
        self.client = app.test_client()
        research_app = create_app({"TESTING": True, "RESEARCH_ENABLED": True})
        self.research_client = research_app.test_client()

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

    def test_articles_start_fresh(self):
        response = self.client.get("/articles/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"No articles yet", response.data)
        self.assertNotIn(b"Moment Generating", response.data)
        self.assertNotIn(b"Prediction Markets", response.data)

    def test_homepage_links_to_articles(self):
        response = self.client.get("/")
        self.assertIn(b'href="/articles/"', response.data)
        self.assertIn(b">articles</a>", response.data)

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

    def test_research_is_archived_by_default(self):
        self.assertEqual(self.client.get("/papers/when_does_lvr_outrun_fees.pdf").status_code, 404)
        self.assertEqual(self.client.get("/static/papers/when_does_lvr_outrun_fees.pdf").status_code, 404)
        self.assertNotIn(b'href="#research"', self.client.get("/").data)

    def test_research_can_be_restored_with_feature_flag(self):
        response = self.research_client.get("/papers/when_does_lvr_outrun_fees.pdf")
        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.mimetype, "application/pdf")
            self.assertIn(b'href="#research"', self.research_client.get("/").data)
        finally:
            response.close()

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
                output_directory / "study-planner.html",
                output_directory / "404.html",
                output_directory / ".htaccess",
                output_directory / "static" / "css" / "base.css",
            )
            for path in expected_files:
                with self.subTest(path=path):
                    self.assertTrue(path.is_file())


if __name__ == "__main__":
    unittest.main()
