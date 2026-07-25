# Site mirrors — how they were made / how to refresh

Each `companies/<name>/site-mirror/` holds an **offline copy of two real pages** from the company's
live website (homepage + one more), captured with all page assets so they render without internet.
Purpose: a realistic surface to embed the Ribbo widget on for the demo. See the "Website mirrors"
section of the root `README.md` for how to add the widget.

Captured **25 July 2026** with `wget`. To refresh a mirror, delete its `site-mirror/` folder and
re-run the matching command from the repo root.

## Pages mirrored

| Company | Pages | Entry files |
|---|---|---|
| Safarilink | Home, About | `flysafarilink.com/index.html`, `flysafarilink.com/about-us/about.html` |
| Sai Office | Home, Contact | `www.sai-office.com/kenya/index.html`, `www.sai-office.com/kenya/contact-us/index.html` |
| Ramco Printing | Home, The Company | `www.ramcoprinting.com/index.html`, `www.ramcoprinting.com/the-company.html` |
| Kitchens & Beyond | Home, About Us | `kitchensandbeyond.co.ke/index.html`, `kitchensandbeyond.co.ke/about-us.html` |

## Commands

Flags: `-E` adjust extensions, `-H` span hosts (grab CDN assets), `-k` convert links for offline
viewing, `-p` page requisites, `-nv` less noise. A browser UA avoids naive blocks.

```bash
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

# Safarilink
wget -e robots=off --no-check-certificate -E -H -k -p -nv -U "$UA" \
  -P companies/safarilink/site-mirror \
  https://flysafarilink.com/ \
  https://flysafarilink.com/about-us/about

# Sai Office
wget -e robots=off --no-check-certificate -E -H -k -p -nv -U "$UA" \
  -P companies/sai-office/site-mirror \
  https://www.sai-office.com/kenya/ \
  https://www.sai-office.com/kenya/contact-us/

# Ramco Printing
wget -e robots=off --no-check-certificate -E -H -k -p -nv -U "$UA" \
  -P companies/ramco-printing/site-mirror \
  https://www.ramcoprinting.com/ \
  https://www.ramcoprinting.com/the-company

# Kitchens & Beyond
wget -e robots=off --no-check-certificate -E -H -k -p -nv -U "$UA" \
  -P companies/kitchens-beyond/site-mirror \
  https://kitchensandbeyond.co.ke/ \
  https://kitchensandbeyond.co.ke/about-us
```

## Notes

- **Static snapshots.** Forms, booking flows and live data don't work — that's expected. The widget
  is what's being demoed, over a realistic page.
- Some third-party embeds (Google Maps, remote fonts) may not render offline; harmless for the demo.
- `-H` pulls cross-host page requisites into per-host folders (e.g. `use.fontawesome.com/…`), which
  is why each mirror contains more than just the company domain folder.
- **Internal demo use only** — these are copies of the companies' live sites. Don't redistribute or
  host them publicly.
