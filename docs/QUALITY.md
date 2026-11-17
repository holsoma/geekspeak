# Quality review

Reviewed on 18 November 2026 against a local production build. This is an independent estimate using the jury skill rubric, not an Awwwards result.

**Strict independent score: 7.53/10.** Design contributes 40%, Usability 30%, Creativity 20% and Content 10%.

**Rough jury-style estimate: 8.6/10.** The skill adds 1.1 to its strict critic score. That adjustment was calibrated against only two websites, so it has limited predictive value. The review does not support a near-10 claim.

| Criterion                 | Score | Finding                                                                                                                                   |
| ------------------------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Design                    |   7.6 | Clear headline composition, controlled colours and consistent illustrations. Lesson screens and the repeated footer are less distinctive. |
| Usability                 |   7.7 | Guest navigation, lessons, search, bookmarks and progress work. Connected account services remain unavailable.                            |
| Creativity                |   7.0 | Translation cards and the idempotency demonstration suit the subject. Deeper screens use familiar lists and question forms.               |
| Content                   |   7.8 | Practical examples, common mistakes and primary-source links. Some summaries introduce other technical terms without explaining them.     |
| Semantics and SEO         |   8.0 | Forty-page audit: zero failures and zero warnings. Unique metadata and a real 404 response.                                               |
| Animation and transitions |   7.2 | Visible card and button feedback. Route transition timing cannot be established from still frames alone.                                  |
| Accessibility             |   7.8 | Final axe checks found no violations across nine representative routes. Visible skip links and sampled focus stops; reduced motion works. |
| Performance               |   8.0 | Corrected lesson mobile LCP 1.964 seconds and CLS 0 under simulated slow 4G and 4x CPU slowdown.                                          |
| Responsive layout         |   7.8 | No reported horizontal overflow. Phone lessons, examples and lists remain readable.                                                       |
| Markup and metadata       |   8.0 | Titles, descriptions, language, canonicals and working Open Graph images were checked.                                                    |

## What was verified

- Six content and progress tests, a production build, and the browser learning checks pass. GitHub Actions repeats these checks on Linux.
- The browser checks exercise search, saved terms, wrong-answer retries, lesson completion, persistence after reload, successful and failed test-out, phone navigation, metadata and accessibility.
- The full application's unauthenticated API ownership and cross-origin rejection checks pass. The exported preview excludes these server-only checks.
- Twelve page types were captured across desktop, throttled phone and reduced motion, with separate captures of learning states and direct hover pairs.
- The final forty-page structural audit reported zero failures and zero warnings. The heaviest audited page was approximately 270 KB, including 180 KB of gzipped JavaScript.
- Home mobile LCP was 1.168 seconds and CLS 0. The highest remaining measured CLS was 0.035 on the leaderboard. These are local simulated measurements, not field data from actual phones.

The review led to corrections for accessible lesson labels, mobile lesson access, dictionary pagination, focus visibility, term link size, loading layout movement, hover contrast and unavailable account wording. The lesson's measured mobile CLS fell from 0.101 to 0 after its loading space was reserved.

## Limits and remaining work

GitHub OAuth, database persistence and real leaderboard participation are implemented in the server application but have not been verified against configured production services. The private Sites deployment is a guest-only export. No users or leaderboard scores are invented.

The critic recommends carrying the pack artwork and colour into study, question and completion states; explaining mathematical summaries more directly; improving account-page spacing; and indicating leaderboard availability before navigation. These remain improvements, not completed changes.

Keyboard captures sampled four to eight focus stops per page. Automated checks do not establish complete assistive-technology compatibility or learning effectiveness. Misaligned hover crops from the review script were excluded from scoring; direct full-viewport captures were used instead. Raw captures remain in ignored local `.jury/` folders to avoid publishing redundant build artefacts.

The runtime dependency audit reported no vulnerabilities. The development-only ESLint dependency tree has an unresolved picomatch advisory; see the setup guide.
