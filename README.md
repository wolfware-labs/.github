# .github

Organization-level GitHub configuration for [Wolfware LLC](https://wolfware.dev).

This repository is not a product. It holds the files GitHub reads at the organization level:

| Path | Purpose |
| --- | --- |
| [`profile/README.md`](profile/README.md) | The company introduction rendered on [github.com/wolfware-labs](https://github.com/wolfware-labs) |
| `profile/assets/` | Logo variants used by the profile README (light and dark theme) |

## Editing the org profile

`profile/README.md` is what visitors see on the organization page. Changes to it go live as soon as
they land on `main` — there is no build step.

Keep it consistent with the copy on [wolfware.dev](https://wolfware.dev); the mission, product
descriptions, and team blurb are mirrored from the site's home and company pages.

### Logo assets

The wordmark is white in `wolfware-logo-dark.svg` and navy (`#0d1e30`) in `wolfware-logo-light.svg`.
The two files are otherwise identical — the fill is set once on the wordmark `<g>` element, so
recoloring is a one-line change. The profile README selects between them with a `<picture>` element
and `prefers-color-scheme`.

Referenced by absolute `raw.githubusercontent.com` URLs rather than relative paths, because the
profile README is rendered on the organization page rather than in this repository's own context.

## Adding default community health files

GitHub falls back to files in this repository for any org repo that doesn't define its own. Drop
them at the repository root to apply org-wide:

`CODE_OF_CONDUCT.md` · `CONTRIBUTING.md` · `SECURITY.md` · `SUPPORT.md` · `FUNDING.yml` ·
`ISSUE_TEMPLATE/` · `PULL_REQUEST_TEMPLATE.md`

Note that `README.md` is *not* among the files GitHub inherits — this one is only visible to people
who open this repository directly.
