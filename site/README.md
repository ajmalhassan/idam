# Idam website

Static, dark-by-default HTML/CSS. No build step, runtime dependencies, client-side scripts, external fonts or analytics.

## Preview

From the repository root:

```sh
python3 -m http.server 8787 --bind 127.0.0.1 --directory site
```

Open http://127.0.0.1:8787/. The privacy policy is `privacy.html`. Relative URLs work at the GitHub project path and custom domain.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the two HTML pages, CSS, logo and home screenshot. It excludes operational documentation, beta packages and other repository content. No extension build or Node installation is needed.

The workflow runs on site/workflow changes in `feat/onboarding-motion` (current release work) and `main`. Once that work is integrated into `main`, remove the development branch from the trigger and job condition. The `github-pages` environment must permit the deployment branch. Repository Settings → Pages → Source must be **GitHub Actions**.

Default address: https://ajmalhassan.github.io/idam/

Intended custom domain: `idam.ajmalhassan.com`. Set it in repository Pages settings, then add this record at the domain's DNS provider:

| Type | Name | Target |
| --- | --- | --- |
| CNAME | idam | ajmalhassan.github.io |

No path or protocol in the DNS target. Do not change the apex domain or other subdomains. Enable Enforce HTTPS once GitHub provisions the certificate. A CNAME file does not configure the domain for a custom Actions workflow; the repository Pages setting is authoritative.

## Store release

The page explicitly says the extension is not yet available on the Chrome Web Store. Once published, replace the coming-soon CTA and installation explanation with the verified store listing URL. Keep the optional Vivaldi CSS theme separate. The privacy policy names GitHub Pages and links its privacy statement.

The ignored local ZIP is for development/beta packaging only and is not deployed by Pages. There are no public ZIP links.

## Verification

Before deployment, check local links/assets, desktop and narrow layouts, keyboard navigation and dark appearance under a light OS preference. After deployment, check both HTML pages and assets over HTTPS. Keep screenshots fictional and version/privacy text aligned with the extension.
