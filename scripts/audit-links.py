import os, re
from pathlib import Path
from collections import Counter

root = Path(__file__).resolve().parents[1]
broken = []

def resolve(base: Path, href: str):
    href = href.split("#")[0].split("?")[0]
    if not href or href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
        return None
    if href.startswith("/"):
        return root / href.lstrip("/").replace("/", os.sep)
    return (base.parent / href).resolve()

SKIP_PARTS = {"scripts", "tools", "node_modules"}

for f in root.rglob("*.html"):
    rel_parts = f.relative_to(root).parts
    if any(p in SKIP_PARTS for p in rel_parts):
        continue
    text = f.read_text(encoding="utf-8", errors="ignore")
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    for href in re.findall(r'href=["\']([^"\']+)["\']', text):
        target = resolve(f, href)
        if target is None:
            continue
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            broken.append((str(f.relative_to(root)).replace("\\", "/"), href))

pat = Counter(h for _, h in broken)
print(f"Broken: {len(broken)}")
for h, c in pat.most_common(12):
    print(f"  {c}x {h}")
for name in ("index.html", "blog/index.html"):
    n = sum(1 for f, _ in broken if f == name)
    print(f"{name}: {n} broken")
    if name == "index.html":
        for f, h in sorted((f, h) for f, h in broken if f == name):
            print(f"    {h}")
