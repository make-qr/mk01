#!/usr/bin/env python3
"""Generate SEO landing page HTML from outline data."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://monkeymart.one"


def shell(page: dict) -> str:
    slug = page["slug"]
    url = f"{BASE}/{slug}/"

    schema_faq = ""
    if page.get("faq"):
        entities = []
        for q, a in page["faq"]:
            entities.append(
                {
                    "@type": "Question",
                    "name": q,
                    "acceptedAnswer": {"@type": "Answer", "text": a},
                }
            )
        schema_faq = f"""
<script type="application/ld+json">
{json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": entities}, indent=2)}
</script>"""

    content_parts = []
    for block in page["content"]:
        if block["type"] == "h2":
            content_parts.append(f"<h2>{block['text']}</h2>")
        elif block["type"] == "p":
            content_parts.append(f"<p>{block['text']}</p>")
        elif block["type"] == "ul":
            items = "".join(f"<li>{item}</li>" for item in block["items"])
            content_parts.append(f"<ul>{items}</ul>")
        elif block["type"] == "cta":
            content_parts.append(
                f'<p class="guide-cta"><a class="guide-play-btn" href="{block["href"]}">{block["text"]}</a></p>'
            )
        elif block["type"] == "links":
            links = " · ".join(f'<a href="{l["href"]}">{l["text"]}</a>' for l in block["items"])
            content_parts.append(f'<p class="guide-inline-links">{links}</p>')
    if page.get("faq"):
        content_parts.append("<h2>FAQ</h2>")
        for q, a in page["faq"]:
            content_parts.append(f"<h3>{q}</h3><p>{a}</p>")

    content = "\n".join(content_parts)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{page['title']}</title>
<meta name="description" content="{page['description']}"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{url}"/>
<meta property="og:title" content="{page['title']}"/>
<meta property="og:description" content="{page['description']}"/>
<meta property="og:image" content="{BASE}/assets/img/monkey-mart.jpg"/>
<meta property="og:url" content="{url}"/>
<meta property="og:type" content="article"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{page['title']}"/>
<meta name="twitter:description" content="{page['description']}"/>
<meta name="twitter:image" content="{BASE}/assets/img/monkey-mart.jpg"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
<link rel="stylesheet" href="/assets/css/style.css"/>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SWBWGBV5PB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-SWBWGBV5PB');
</script>
<script type="application/ld+json">
{json.dumps({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": page["h1"],
  "description": page["description"],
  "url": url,
  "image": f"{BASE}/assets/img/monkey-mart.jpg",
  "publisher": {"@type": "Organization", "name": "Monkey Mart", "url": BASE + "/"},
}, indent=2)}
</script>{schema_faq}
</head>
<body>
<button class="menu-toggle" id="menu-toggle"><i class="fas fa-bars"></i></button>
<div class="menu-overlay" id="menu-overlay"></div>
<div class="main-wrapper">
<main class="main-content">
<header class="header">
<div class="container">
<div class="header-content">
<div class="logo"><a href="/"><img src="/assets/img/monkeymart.png" alt="Monkey Mart Logo"/></a></div>
<nav class="nav-menu">
<ul>
<li><a href="/" title="Monkey Mart"><i class="fas fa-home"></i> Home</a></li>
<li><a href="/category/game.html"><i class="fas fa-gamepad"></i> All Games</a></li>
<li><a href="/category/play-more.html"><i class="fas fa-cogs"></i> Play More</a></li>
<li><a href="/blog/"><i class="fas fa-book"></i> Game Guides</a></li>
</ul>
</nav>
</div>
</div>
</header>
<section class="game-description">
<div class="container">
<h1>{page['h1']}</h1>
<div class="game-info"><div class="game-details">
{content}
</div></div>
</div>
</section>
</main>
</div>
<footer class="site-footer">
<div class="footer-content">
<div class="footer-section">
<h3>About</h3>
<ul>
<li><a href="/about.html">About Us</a></li>
<li><a href="/contact.html">Contact</a></li>
<li><a href="/faq.html">FAQ</a></li>
<li><a href="/blog/">Blog</a></li>
</ul>
</div>
<div class="footer-section">
<h3>Quick Links</h3>
<ul>
<li><a href="/">Home</a></li>
<li><a href="/category/game.html">Games</a></li>
<li><a href="/category/play-more.html">Play More</a></li>
</ul>
</div>
</div>
<div class="footer-bottom"><p>© 2026 Monkey Mart. All rights reserved.</p></div>
</footer>
<script src="/assets/js/main.js"></script>
</body>
</html>
"""


PAGES = [
    {
        "slug": "how-to-play-monkey-mart",
        "title": "How to Play Monkey Mart — Complete Beginner Guide 2026",
        "description": "Learn how to play Monkey Mart step by step. Controls, harvesting, stocking shelves, upgrades, and helper monkeys explained for new players.",
        "h1": "How to Play Monkey Mart",
        "content": [
            {"type": "cta", "href": "/", "text": "Play Monkey Mart Free"},
            {
                "type": "h2",
                "text": "What is Monkey Mart?",
            },
            {
                "type": "p",
                "text": "Monkey Mart is a casual idle supermarket management game. You play as a monkey running a small store: harvest products, stock shelves, serve customers, collect coins, and unlock upgrades to grow your business.",
            },
            {"type": "h2", "text": "Basic Controls"},
            {
                "type": "p",
                "text": "On desktop, use WASD or arrow keys to move your monkey. On mobile, use touch controls. Walk near items, shelves, and customers to interact automatically.",
            },
            {"type": "h2", "text": "Step 1 — Harvest Products"},
            {
                "type": "p",
                "text": "Start by collecting bananas from growing patches behind your store. As you progress, you will harvest corn, eggs, milk, and more advanced goods.",
            },
            {"type": "h2", "text": "Step 2 — Stock the Shelves"},
            {
                "type": "p",
                "text": "Carry harvested goods to empty shelves. Customers only buy when products are available — empty shelves mean lost sales.",
            },
            {"type": "h2", "text": "Step 3 — Collect Payments"},
            {
                "type": "p",
                "text": "When shoppers finish picking items, money appears at the register. Walk over to collect coins and fund your next upgrades.",
            },
            {"type": "h2", "text": "Step 4 — Buy Upgrades"},
            {
                "type": "ul",
                "items": [
                    "Movement speed — refill shelves faster",
                    "Carrying capacity — fewer trips back and forth",
                    "New product types — higher revenue per customer",
                    "Store expansion — more shelves and sections",
                    "Helper monkeys — automate harvesting and stocking",
                ],
            },
            {"type": "h2", "text": "Tips for Your First 10 Minutes"},
            {
                "type": "ul",
                "items": [
                    "Upgrade speed and capacity before expanding the store",
                    "Keep banana shelves full at all times",
                    "Save coins for new product unlocks early on",
                    "Hire your first helper when shelves go empty while you harvest",
                ],
            },
            {"type": "h2", "text": "More Guides"},
            {
                "type": "links",
                "items": [
                    {"href": "/monkey-mart-tips/", "text": "Tips & Tricks"},
                    {"href": "/monkey-mart-unblocked/", "text": "Play Unblocked"},
                    {"href": "/", "text": "Play Now"},
                ],
            },
            {"type": "cta", "href": "/", "text": "Play Monkey Mart Online Free"},
        ],
        "faq": [
            (
                "Is Monkey Mart free?",
                "Yes. You can play Monkey Mart for free in your browser at monkeymart.one.",
            ),
            (
                "Do I need to download Monkey Mart?",
                "No download is required. Monkey Mart is an HTML5 browser game.",
            ),
            (
                "Can I play Monkey Mart on mobile?",
                "Yes. Open monkeymart.one on your phone or tablet and tap Play.",
            ),
        ],
    },
    {
        "slug": "monkey-mart-tips",
        "title": "Monkey Mart Tips & Tricks — Best Upgrade Strategy 2026",
        "description": "Pro Monkey Mart tips: best early upgrades, product unlock order, helper monkey timing, and coin strategies to grow your store faster.",
        "h1": "Monkey Mart Tips and Tricks",
        "content": [
            {"type": "cta", "href": "/", "text": "Play Monkey Mart Free"},
            {"type": "h2", "text": "Best Early Game Upgrades"},
            {
                "type": "p",
                "text": "Most players progress faster with this upgrade priority:",
            },
            {
                "type": "ul",
                "items": [
                    "Movement speed — reach shelves and fields quicker",
                    "Carry capacity — move more products per trip",
                    "First new product unlock (usually corn) — more sales per customer",
                ],
            },
            {"type": "h2", "text": "Product Unlock Order"},
            {
                "type": "p",
                "text": "Unlock products that match customer demand before spending on floor expansion. A well-stocked small store beats a large store with empty shelves.",
            },
            {"type": "h2", "text": "When to Hire Helper Monkeys"},
            {
                "type": "p",
                "text": "Hire helpers when you consistently have spare coins after restocking and you miss sales because shelves go empty while you harvest. Your first helper should cover your biggest bottleneck — usually harvesting or stocking.",
            },
            {"type": "h2", "text": "Coin Farming Tips"},
            {
                "type": "ul",
                "items": [
                    "Never let your best-selling shelves sit empty",
                    "Collect register money before buying large upgrades",
                    "Focus on one upgrade goal per short play session",
                ],
            },
            {"type": "h2", "text": "Common Mistakes to Avoid"},
            {
                "type": "ul",
                "items": [
                    "Expanding the store too early",
                    "Skipping capacity upgrades",
                    "Unlocking products you cannot keep in stock",
                ],
            },
            {"type": "h2", "text": "Late Game Strategy"},
            {
                "type": "p",
                "text": "In the late game, assign clear roles to multiple helpers, balance expansion with upgrade depth, and prioritize high-traffic shelves during busy periods.",
            },
            {"type": "h2", "text": "Related Guides"},
            {
                "type": "links",
                "items": [
                    {"href": "/how-to-play-monkey-mart/", "text": "How to Play"},
                    {"href": "/monkey-mart-unblocked/", "text": "Unblocked"},
                    {"href": "/", "text": "Play Now"},
                ],
            },
        ],
        "faq": [
            (
                "What should I upgrade first in Monkey Mart?",
                "Movement speed and carrying capacity are usually the best early investments.",
            ),
            (
                "When should I hire helper monkeys?",
                "Hire when you have steady spare income and shelves frequently go empty while you harvest.",
            ),
        ],
    },
    {
        "slug": "monkey-mart-unblocked",
        "title": "Monkey Mart Unblocked — Play Free at School or Work 2026",
        "description": "Play Monkey Mart unblocked in your browser. No download, instant play on desktop and mobile. Free supermarket management game online.",
        "h1": "Play Monkey Mart Unblocked",
        "content": [
            {"type": "cta", "href": "/", "text": "Play Monkey Mart Now"},
            {"type": "h2", "text": "What Does Unblocked Mean?"},
            {
                "type": "p",
                "text": "Unblocked usually refers to games that run directly in a web browser without installing software — helpful on shared computers where downloads are restricted.",
            },
            {"type": "h2", "text": "Play in Your Browser"},
            {
                "type": "p",
                "text": "Monkey Mart on monkeymart.one is an HTML5 browser game. No download, no account required to start. It works on Chrome, Firefox, Safari, and Edge.",
            },
            {"type": "h2", "text": "School and Work Networks"},
            {
                "type": "p",
                "text": "Some networks block game websites. MonkeyMart.one is a lightweight browser experience, but access depends on your network policy. We do not provide tools to bypass network filters.",
            },
            {"type": "h2", "text": "Mobile Play"},
            {
                "type": "p",
                "text": "Open monkeymart.one on your phone browser, tap Play, and use touch controls to manage your supermarket on the go.",
            },
            {"type": "h2", "text": "Why Players Search Monkey Mart Unblocked"},
            {
                "type": "ul",
                "items": [
                    "Quick casual breaks between tasks",
                    "No install footprint on shared computers",
                    "Simple controls and relaxing gameplay loop",
                ],
            },
            {"type": "h2", "text": "Related Pages"},
            {
                "type": "links",
                "items": [
                    {"href": "/how-to-play-monkey-mart/", "text": "How to Play"},
                    {"href": "/monkey-mart-tips/", "text": "Tips & Tricks"},
                    {"href": "/category/game.html", "text": "All Games"},
                ],
            },
            {"type": "cta", "href": "/", "text": "Start Playing — Free & Instant"},
        ],
        "faq": [
            (
                "Is Monkey Mart unblocked at school?",
                "It depends on your school's network filter. Browser-based games may work where app downloads are blocked.",
            ),
            (
                "Is it safe to play on monkeymart.one?",
                "Yes. Play on the official site monkeymart.one and avoid unknown mirror sites.",
            ),
        ],
    },
]


def main() -> None:
    for page in PAGES:
        out_dir = ROOT / page["slug"]
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / "index.html"
        out_path.write_text(shell(page), encoding="utf-8")
        print(f"Wrote {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
