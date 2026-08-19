import shutil
from pathlib import Path

from website import create_app
from website.articles import load_articles


PROJECT_ROOT = Path(__file__).parent
DEFAULT_OUTPUT_DIRECTORY = PROJECT_ROOT / "dist"
STATIC_DIRECTORY = PROJECT_ROOT / "website" / "static"


def build(output_directory=DEFAULT_OUTPUT_DIRECTORY):
    output_directory = Path(output_directory)
    if output_directory.exists():
        shutil.rmtree(output_directory)

    shutil.copytree(STATIC_DIRECTORY, output_directory / "static")

    app = create_app({"TESTING": True})
    client = app.test_client()
    pages = {
        "/": output_directory / "index.html",
        "/articles/": output_directory / "articles" / "index.html",
        "/study-planner.html": output_directory / "study-planner.html",
        "/definitely-not-a-page": output_directory / "404.html",
    }

    for article in load_articles():
        pages[f"/articles/{article.slug}/"] = (
            output_directory / "articles" / article.slug / "index.html"
        )

    for route, destination in pages.items():
        response = client.get(route)
        expected_status = 404 if destination.name == "404.html" else 200
        if response.status_code != expected_status:
            raise RuntimeError(f"Could not build {route}: HTTP {response.status_code}")

        destination.parent.mkdir(parents=True, exist_ok=True)
        html = "\n".join(line.rstrip() for line in response.get_data(as_text=True).splitlines())
        destination.write_text(f"{html}\n", encoding="utf-8")

    (output_directory / ".htaccess").write_text(
        "Options -Indexes\nErrorDocument 404 /404.html\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    build()
