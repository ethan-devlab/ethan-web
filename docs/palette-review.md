# Palette Application Review

Date: 2026-10-09. Branch: `codex/portfolio-design-directions`. The audit was read-only. The owner then approved the applications recorded below.

## Scope and method

Review the existing forest palette across the shared styles, homepage, experience, resume, photography, blog, and contact styles. Inspect actual browser styles for the homepage, scrolled header, blog controls, article links, and photography cards. Convert resolved OKLCH colors to linear sRGB, then use WCAG relative luminance. Ratios below describe opaque token pairs, not every background gradient or rendered pixel.

The original palette remains unchanged. Equivalent OKLCH notation does not improve an existing low-contrast pair. Pure black and white are owner-approved endpoints, not defects in this review.

## Token pairs

| Pair | Dark | Light | Assessment |
| --- | ---: | ---: | --- |
| Main text / base background | 21.00:1 | 16.93:1 | Strong |
| Muted text / base background | 8.19:1 | 7.09:1 | Strong on this opaque pair |
| Muted text / third surface | 6.21:1 | 6.50:1 | Strong |
| Accent / base background | 14.63:1 | 2.24:1 | Light accent needs restricted use |
| Accent / white or first surface | 13.99:1 | 2.39:1 | Light accent fails normal text contrast |
| Input border / base background | 2.01:1 | 1.40:1 | Weak control boundary; actual backdrop varies |
| Card border / first surface | 1.40:1 | 1.39:1 | Appropriate only when decorative separation is sufficient |

The comparison JSON is saved outside the repository as `palette-token-contrast-20261009.json` in the task visualization directory.

## Findings

### P1: Light article links use a low-contrast accent

`src/styles/globals.css` applies `--color-neon-green` to article links. The browser confirmed 16px links and a white article surface on `/zh/blog/jetson-nano-setup-guide`. Their token contrast is 2.39:1; normal text needs at least 4.5:1. Underlining identifies a link but does not remove its text contrast requirement. Links inside tinted callouts need separate background checks.

Recommended decision: keep the bright accent for decoration and reuse an existing sufficiently dark palette color for reading links. Do not add or darken a palette color without the owner's decision.

### P1 candidate: Light focus indicators use the same pale accent

Shared controls, native skill disclosures, homepage photography controls, and the skip link use the accent for focus. Against light base surfaces it is below 3:1. Focus must remain visible against each adjacent surface, including the dark scrolled header. Use a context-specific existing color rather than applying one light-theme override to every surface.

### P2: Search and select boundaries are hard to distinguish

Blog search and selects are transparent, with the low-contrast input-border token. Carets, content, and layout can provide other identification cues, so the low border ratio alone is not a complete WCAG finding. Stronger boundaries would make the controls easier to locate. Decorative project and skill dividers do not need the same boundary treatment.

### P2: Some interactions bypass theme-specific accent roles

Contact icon backgrounds, borders, hover states, and photography navigation hover use the fixed dark accent, while contact icon foregrounds use the theme accent. This is a confirmed role inconsistency, not evidence that every use is unreadable. Photo navigation deliberately uses a dark backing with white icons over images, which helps preserve contrast.

### Backdrop checks still needed

The dark page gradient brightens the top of the page; muted text there cannot inherit the opaque-base passing ratio. Photography position controls use white dots over changing images and must be checked on bright photos. These are unresolved contextual checks, not confirmed failures from token calculations.

## Sound choices to retain

- Forest and teal backgrounds form an orderly dark surface scale. Light surfaces use restrained green tints.
- Main and secondary text are distinct and readable on the measured opaque surfaces.
- Large green project ordinals are decorative and hidden from assistive technology; they do not establish a text contrast defect.
- Photography's fixed white cards create a deliberate print-like treatment, with dark captions. They are not a broken-theme defect.
- The light scrolled header explicitly switches both its background and text together; browser inspection confirmed white text on the dark header.
- Code styles use separate theme variables. Callout hues distinguish semantic types and include an icon; there is no reason to force them all to forest green.

## Approved applications

- After comparing dark contact screenshots, the owner selected original dark forest backgrounds with original white foregrounds for dark functional accents. Keyboard focus uses a white outline with a forest outer layer. White photography-card position controls retain forest outlines. All pages use this selection. The owner approved removal of the earlier `?accent=neon` comparison entry on 2026-10-12.

- Light reading links and focus on light surfaces reuse the original dark forest `#061a1c`, expressed in equivalent OKLCH. The original bright accent remains for decoration and dark-background control focus in light mode. Dark-mode focus now follows the owner-selected forest/white rule. The browser confirmed the new article-link color and a 2px keyboard focus outline. Its contrast is 17.91:1 on white and 15.42:1 on the third light surface.
- Blog input boundaries use the existing muted-text color, keeping their 1px thickness. The owner selected this after comparing both themes; the temporary comparison parameter was removed.
- Photography retains its white print cards. Position indicators move to the white area below the image, with original dark forest filled/outlined states. The owner selected this after a working comparison. Click targets remain at the original size by explicit choice; this leaves the small-target usability concern unresolved.
- The mobile split hero uses 48px top spacing at widths up to 600px, as selected by the owner.
- Desktop blog filters use four columns at widths of 1024px and above, two columns from 768px, and the original single column below that. The owner accepted the working screenshot.
- Resume document cards remain visible. HEAD checks require a PDF content type before enabling view and download links. The missing English document has disabled native buttons without new helper copy, as selected by the owner. The Chinese document remains available. Both language pages were checked in the browser.
- Experience section headings remain in their original English by owner choice.
- Blog controls have fixed accessible names from existing bilingual copy. The owner approved a query-based preview; the labels now apply normally and the temporary preview logic is removed. Browser accessibility-tree names were checked; VoiceOver speech has not been tested.

## Loading optimization

The owner authorized changes without visual changes. Non-home routes now use React lazy loading within the existing layout. Homepage entry and shared JavaScript total about 165.79 KB gzip, compared with 248.13 KB before route splitting. This comparison excludes fonts, images, and CSS, and is not a measured page-load duration. Blog content remains in its existing shared blog module. No media, font files, or public copy were changed.

Build, lint, typecheck, and seven existing blog browser tests passed after route splitting. Browser navigation confirmed the experience route, preserved language switching, 14 photography cards, and four blog filters. All changes remain uncommitted on the review branch.

## Remaining checks

1. Top-gradient text contrast at actual text positions.
2. Whole-site light/dark visual review. Twelve current full-page captures were created, one pair for each navigation destination. The gallery manifest is `site-palette-gallery-20261009.json` in the task visualization directory.
3. Keyboard, mobile, and image-context checks after the selected photography indicator change.

Only explicit owner decisions above were implemented. No deployment, commit, or merge has occurred.

References: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## Later browser review

The owner accepted the dark forest skill controls and the current mobile home/blog layouts. The 390px viewport produced a 375px content width without horizontal overflow. A nearby-background JPEG sample for dark mobile blog description text estimated 3.8-3.9:1; this is an approximate contextual check, not formal conformance evidence. The owner compared original gray and original white text and selected original gray. White-text preview logic was removed. The contextual contrast concern remains recorded.

The owner also compared image-control keyboard focus and explicitly selected forest/white focus for dark scrolled headers, image navigation, and lightbox controls. The earlier bright-focus override is now limited to light mode. White paper position controls keep their forest-only exception.

The latest responsive JSON records 72 unique page/language/theme/width cases, with content widths 375, 785, and 1265 pixels and no horizontal overflow. Mobile menu theme switching and Escape focus return were verified. Production English blog controls retained their accessible names after Tutorial filtering and Jetson search; clearing both restored nine published posts with Hello World first.
