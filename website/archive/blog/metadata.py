from dataclasses import dataclass


@dataclass(frozen=True)
class BlogPost:
    filename: str
    title: str
    date: str
    display_date: str
    summary: str
    tags: tuple[str, ...]
    tag_label: str


BLOG_POSTS = (
    BlogPost(
        "mgf.md",
        "MGF",
        "2026-02-01",
        "Feb 1, 2026",
        "Now we get to study some expectations.",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "poisson.md",
        "Poisson",
        "2026-01-08",
        "Jan 8, 2026",
        "Poisson",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "bernoulli.md",
        "Bernoulli and Binomial",
        "2026-01-07",
        "Jan 7, 2026",
        "Bernoulli and Binomial",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "pmf.md",
        "PMF",
        "2026-01-03",
        "Jan 3, 2026",
        "PMF and intro to random variables",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "bayes.md",
        "The Bayes Theorum",
        "2026-01-01",
        "Jan 1, 2026",
        "Understanding the Bayes Theorum",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "independence.md",
        "Types of Independence",
        "2025-12-30",
        "Dec 30, 2025",
        "Simple yet important discussion of types of independence.",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "prediction_markets.md",
        "Prediction Markets",
        "2025-12-28",
        "Dec 28, 2025",
        "My thoughts on prediction markets, addressing the gambling perspective at the end.",
        ("microstructure", "defi"),
        "DeFi Microstructure",
    ),
    BlogPost(
        "inclusion.md",
        "Inclusion-Exclusion",
        "2025-12-27",
        "Dec 27, 2025",
        "This is getting super tricky",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "axioms_prob.md",
        "Sample Spaces, Events, and Axioms",
        "2025-12-24",
        "Dec 24, 2025",
        "Now we can apply all this counting to probability.",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "dyck_paths.md",
        "Dyck Paths and Catalan Numbers",
        "2025-12-23",
        "Dec 23, 2025",
        "Getting a little more complex",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "app_specific_sequencing.md",
        "Notes on App Specific Sequencing",
        "2025-12-21",
        "Dec 21, 2025",
        "Shoutout John Beecher",
        ("microstructure", "defi"),
        "DeFi Microstructure",
    ),
    BlogPost(
        "notes_on_mev.md",
        "Notes on MEV and Flashbots",
        "2025-12-21",
        "Dec 21, 2025",
        "Personal notes on MEV and Flashbots solutions",
        ("microstructure", "defi"),
        "DeFi Microstructure",
    ),
    BlogPost(
        "recurrence.md",
        "Recurrence",
        "2025-12-20",
        "Dec 20, 2025",
        "Recurrence and dynamic programming",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "bars-and-stars.md",
        "Bars and Stars",
        "2025-12-19",
        "Dec 19, 2025",
        "Bars and Stars",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "binomial-theorum.md",
        "The Binomial Theorem",
        "2025-12-18",
        "Dec 18, 2025",
        "Learning about the Binomial Theorem",
        ("prob",),
        "Probability",
    ),
    BlogPost(
        "learning-to-count.md",
        "My Discoveries While Learning to Count",
        "2025-12-17",
        "Dec 17, 2025",
        "The beginning of my journey learning probability theory",
        ("prob",),
        "Probability",
    ),
)
