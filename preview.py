"""Local preview of the Jekyll site without Ruby (emulates the few Liquid tags used)."""
import re, pathlib, shutil
R = pathlib.Path(__file__).parent; OUT = R / "_site"
shutil.rmtree(OUT, ignore_errors=True); shutil.copytree(R / "assets", OUT / "assets")
L = (R / "_layouts/default.html").read_text()
for f in list(R.glob("*.html")) + list(R.glob("insights/*.html")):
    raw = f.read_text(); fm, body = re.match(r"---\n(.*?)\n---\n(.*)", raw, re.S).groups()
    meta = {k: v.strip().strip('"') for k, v in (l.split(":", 1) for l in fm.splitlines())}
    rel = f.relative_to(R).as_posix(); url = "/" + ("" if rel == "index.html" else rel)
    t = meta["title"]
    h = L.replace("{% if page.title contains '000093' %}{{ page.title }}{% else %}{{ page.title }} | 000093{% endif %}", t if "000093" in t else t + " | 000093")
    h = h.replace("{% if page.article %}article{% else %}website{% endif %}", "article" if meta.get("article") else "website")
    h = re.sub(r"{% if page.tools %}(.*?){% endif %}", lambda m: m.group(1) if meta.get("tools") else "", h)
    h = h.replace("{{ content }}", body)
    for k in ("title", "description", "root", "url"):
        h = h.replace("{{ page.%s }}" % k, url if k == "url" else meta.get(k, ""))
    h = h.replace("{{ site.canonical }}", "https://000093.com")
    o = OUT / rel; o.parent.mkdir(parents=True, exist_ok=True); o.write_text(h)
print("preview built in _site/")
