import os

from flask import Flask


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_mapping(
        RESEARCH_ENABLED=_environment_flag("RESEARCH_ENABLED", default=True),
    )

    if test_config:
        app.config.update(test_config)

    from .routes import site

    app.register_blueprint(site)
    return app


def _environment_flag(name, default=False):
    value = os.getenv(name, "").strip().lower()
    if not value:
        return default
    return value in {"1", "true", "yes", "on"}
