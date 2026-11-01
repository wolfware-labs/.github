# .github

Organization-level GitHub configuration for [Wolfware LLC](https://wolfware.dev).

This repository is not a product. It holds the files GitHub reads at the organization level:

| Path | Purpose |
| --- | --- |
| [`profile/README.md`](profile/README.md) | The company introduction rendered on [github.com/wolfware-labs](https://github.com/wolfware-labs) |
| `profile/assets/` | Logo variants used by the profile README (light and dark theme) |

## Editing the org profile

`profile/README.md` is what visitors see on the organization page. Changes to it go live as soon as
they land on `main`. There is no build step.

Keep it consistent with the copy on [wolfware.dev](https://wolfware.dev). The tagline and licensing
section mirror the site's homepage, the product tables mirror `src/data/products.ts` in the landing
repo (name, category, tagline, link), and the team blurb mirrors the company page. Like the site,
the profile describes what each product is, not where development stands: no versions, milestones
or progress.

### Logo assets

The wordmark is white in `wolfware-logo-dark.svg` and navy (`#0d1e30`) in `wolfware-logo-light.svg`.
The two files are otherwise identical: the fill is set once on the wordmark `<g>` element, so
recoloring is a one-line change. Use them with a `<picture>` element and `prefers-color-scheme`
wherever the plain wordmark is needed.

`wolfware-banner.svg` is the profile header. It draws the honeycomb from the landing site's hero
(`src/lib/honeycomb.ts`) with the logo mark in the centre cell, and loops the same slow ripple
(turned off under `prefers-reduced-motion`). The text is converted to Poppins outlines, so it renders
the same without any fonts installed. The banner is dark in both GitHub themes, so it has no light
variant.

All assets are referenced by absolute `raw.githubusercontent.com` URLs rather than relative paths, because the
profile README is rendered on the organization page rather than in this repository's own context.

## Adding default community health files

GitHub falls back to files in this repository for any org repo that doesn't define its own. Drop
them at the repository root to apply org-wide:

`CODE_OF_CONDUCT.md` · `CONTRIBUTING.md` · `SECURITY.md` · `SUPPORT.md` · `FUNDING.yml` ·
`ISSUE_TEMPLATE/` · `PULL_REQUEST_TEMPLATE.md`

Note that `README.md` is *not* among the files GitHub inherits, so this one is only visible to people
who open this repository directly.
