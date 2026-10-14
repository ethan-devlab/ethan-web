# Homepage Direction Review

## Current State (2026-10-09)

The owner selected the original forest-green palette, equivalent OKLCH notation, and C's font stack. The active homepage order is split hero, five expanded project rows, photography, skills, and the original closing CTA. The split hero has separate English and Chinese name lines with added spacing, the original portrait shadow, and no added ring. The mobile order is portrait, name, introduction. Project roles and private notices are hidden; private projects have no source link. The owner accepted the project rows and full-image photo framing. Photography maps the first image of all 14 current groups, uses existing name/date/location, and has no image link. Six-second autoplay pauses on hover or focus and system reduced motion disables autoplay and transitions. Skills start closed and can open independently. Public-facing AI copy is prohibited. Query parameters `hero=split` and `hero=original` retain the comparison control; the default homepage uses the selected split layout. The older direction URLs no longer select a prototype. Records below describe the earlier prototype phase.

Integrated revision: build, lint, and typecheck passed. Desktop browser checks confirmed five project rows, 14 photo slides, contain image fitting, working next and scoped arrow controls, and no horizontal overflow at the observed desktop width. The owner reported photo clipping despite contain fitting; Grid intrinsic sizing made the image larger than its frame. A minmax(0, 1fr) row and zero minimum heights fixed this. Browser measurements then placed the full image inside the frame, and the owner accepted the result. The original portrait shadow was verified from computed styles. A later check applied the viewport override to the displayed tab: a 390px viewport produced a 375px document after scrollbar space, with portrait before name and introduction and no horizontal overflow. The earlier background-tab capture was not mobile evidence. The owner subsequently selected 48px mobile top spacing; the full responsive matrix still needs a current check. Later runtime checks found the navigation refs were null during Swiper initialization. Buttons now invoke the existing Swiper slide methods directly. Both buttons were verified. A focused button held the same photo for more than seven seconds; focus outside with the pointer still inside also held the photo, and autoplay resumed after both left. Runtime reduced-motion checks remain pending. No commit, deployment, or merge has occurred.

Current revision checks: build, lint, typecheck, and seven existing blog browser tests passed. Sixteen browser combinations (two languages, two themes, four widths) showed no horizontal overflow and retained eight skill disclosures. Computed typography matches Manrope/Inter/Noto Sans TC; the direction picker is absent, the original name heading is present, and Enter opens a skill disclosure. The color conversion covers 51 literals and 26 distinct RGB values with a maximum inverse-roundtrip error of 0.000047818 in an 8-bit channel. The conversion was delegated to GPT-6 Luna with max reasoning and reviewed by the parent. Screenshot and matrix files are named `forest-skills-20261009.jpg` and `forest-checks-20261009.json` in the task visualization directory. Full-site quality checks and carousel tests remain pending because the corresponding design choices are not confirmed.

Date: 2026-10-08. Branch: `codex/portfolio-design-directions`.

## Scope

The owner requested three working homepage directions before selecting a full-site design. Each direction uses the existing five projects, eight skill groups, bilingual routes, navigation, and contact data. Other page designs remain the baseline. The original homepage is available for comparison.

| Direction | Audience and action | Design decision |
| --- | --- | --- |
| A, Systems builder | Technical partners; discuss a project | Forest OKLCH palette, light display type, custom structural SVG, work first |
| B, Engineer in practice | Hiring teams; view the resume | Mist and ink-blue OKLCH palette, original portrait, stronger type, current experience first |
| C, Observe & build | Creative peers; explore photography | Night and copper OKLCH palette, original Malaysian and Taiwanese photographs, code and observation |

Open `/zh/?direction=systems`, `/zh/?direction=profile`, or `/zh/?direction=observatory`. English equivalents start with `/en/`. Use the direction picker to compare, and the header controls to change language or theme. `/zh/?direction=original` retains the baseline. Language switching keeps the direction query.

## Self-review and corrections

1. Replace repeated skill cards with native disclosures and project cards with structured rows. Keep real source links and explicit private-project states.
2. Correct the CSS specificity of the direction tokens after the browser showed that legacy theme variables overrode the new backgrounds.
3. Make the photographic composition distinct from the portrait composition. Correct its height so the photograph fits the desktop introduction.
4. Increase prototype menu and language controls to at least 44px. Add Escape handling, return focus to the menu button, close the menu when language changes, and add a keyboard skip link.
5. Apply `MotionConfig reducedMotion="user"` and a CSS reduced-motion rule. Keep the page usable with no entrance animation.
6. Use the existing sans-serif font stack for prototype Chinese navigation as well as content, avoiding an additional serif face for the prototype shell.

## Validation evidence

- `pnpm build`, `pnpm lint`, and `pnpm typecheck`: passed on the final implementation.
- Existing blog callout, pinned-post, and syntax-highlighting browser suites: 7 tests passed. The final later changes were prototype typography, image dimensions, and source formatting.
- Codex in-app browser: 48 combinations checked, across three directions, English and Traditional Chinese, dark and light themes, and widths of 1440, 768, 390, and 320px. No document-level horizontal overflow; one H1, five projects, and eight skill disclosures in each combination. No broken eager images were detected.
- Keyboard: the skip link focuses main content; Enter opens a skill disclosure; Escape closes the mobile menu and focuses its button.
- Mobile menu: all six destinations visible; language switching retained `direction=observatory`.
- In-app browser console inspection: no error or warning entries during prototype interactions.
- Screenshots and the JSON responsive matrix are saved in the task's visualization directory, outside the repository.

Palette contrast was calculated from the browser's resolved OKLCH tokens, converted to linear sRGB luminance. These values describe the named palette pairs, not every rendered pixel or a complete accessibility audit.

| Palette | Primary text/background | Muted text/background | Button label/fill |
| --- | ---: | ---: | ---: |
| A dark | 16.23:1 | 8.21:1 | 12.08:1 |
| A light | 15.40:1 | 7.33:1 | 9.67:1 |
| B dark | 16.12:1 | 8.15:1 | 10.74:1 |
| B light | 14.68:1 | 7.42:1 | 10.02:1 |
| C dark | 15.33:1 | 8.23:1 | 9.62:1 |
| C light | 13.48:1 | 7.29:1 | 8.75:1 |

## Limits and next gate

- These are direction prototypes, not a claim of Awwwards, Webby, or FWA qualification. The concept, distinctiveness, evidence, and full-site execution still need refinement after direction selection. [Webby's official criteria](https://www.webbyawards.com/judging-criteria/) provide a reference for content, visual design, navigation, functionality, interactivity, and overall experience.
- Full-site visual review, Safari/Firefox checks, screen-reader evaluation, and a formal WCAG 2.2 AA audit are pending.
- Reduced-motion rules were inspected in source. Runtime reduced-motion emulation is pending because the in-app browser exposes no media-emulation control.
- Lighthouse and throttled performance measurements were not run. The in-app browser's read-only page interface does not expose the Performance API. Build size is an identified risk: the shared JS is about 1.16MB raw (248KB gzip), and the available full Chinese fonts are 5.42MB and 7.64MB. Prototype C's hero and interlude each reference an existing image of about 1.9MB. Use responsive derivatives and review font delivery in the selected full-site design.
- The existing photography test fixture expects 12 obsolete photo groups and remote placeholder images. That suite was not run or rewritten in this homepage phase. The live dataset has 14 groups.
- Keep the original content claims unchanged. Do not infer employment outcomes, measured project results, or private system architecture from visual treatments.
- After the owner selects a direction, remove the comparison control, apply the chosen system across all existing pages, optimize media delivery, expand runtime validation, and repeat the visual review. Do not deploy, commit, or merge until the owner approves.

Suggested commit message for this completed prototype phase: `feat: add three bilingual portfolio design directions`
