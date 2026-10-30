# Idam beta readiness

Approved scope: prepare the four proposed launch steps while the user is away: real-browser validation, performance/accessibility, release/landing materials, and a five-person beta kit. Keep the current feature scope. Prepare deployment and invitations; do not send invitations or publish publicly as part of this preparation.

## Approach

Use the current checkout and existing dark Metro design. The landing page is static and local, ready for the planned domain. Separate tasks own site/, docs/beta/, and a read-only accessibility review; the main task owns native browser validation, fixes, screenshots, release assembly and integration. Use isolated test profiles exclusively.

## Work

- [x] Validate fresh install, upgrade/reload persistence, offline tasks/notes/shortcuts, narrow layouts and Vivaldi vertical tabs where available. Record exact browser versions and limits.
- [x] Measure returning-tab load and inspect keyboard, focus, labels, contrast, reduced motion; fix reproduced blockers with focused regression coverage.
- [x] Capture actual product screenshots with fictional demo data; prepare the beta ZIP, integrity checks and release notes.
- [x] Build a responsive dark landing page with working download/install/feedback links and accurate privacy disclosures.
- [x] Prepare installation/update instructions, store copy, five-person tracking, invitation draft, observation tasks, day-seven questions and release criteria.
- [x] Check all deliverables together, record remaining human review/submission steps, and provide local previews and artifacts.

## Acceptance

Passing automated checks and package validation; actual test evidence distinguished from untested platforms; no user profile changes; no invented users, testimonials or performance guarantees; external favicon requests disclosed; no added analytics/accounts; site functions without a backend and starts dark under light OS preference.

Outcome:0.6.1 candidate prepared with native browser validation, three application fixes, landing/site/privacy/store assets and a five-person beta kit. Public deployment, store submission and invitations remain owner actions. Evidence and gaps are in docs/beta/VALIDATION.md.
