# CJK Font Loading Comparison

Status: owner selected the original full font. Candidate assets and CSS were moved out of the repository to temporary storage. The comparison evidence below records the reviewed experiment.

Keep the existing Noto Sans TC source file, variable weight range, glyph shapes, metrics, and public copy. The normal site keeps its current font loading until the owner selects a comparison.

## Comparison

1. Use fontTools and its WOFF dependencies in a task-specific temporary directory, without global installation or changes to project dependencies.
2. Read the source font's Unicode mappings, weight axes, names, and metrics. Split its full character coverage into WOFF2 ranges. Do not build a site-only character set that drops future content.
3. Compare the original and segmented loading through an explicit preview. Check Unicode coverage, variable axes, representative glyphs, layout dimensions, bilingual pages, and normal build checks. Report file sizes separately from measured transfer or loading time.

Do not replace the original font, add external fonts, change type stacks, or publish the comparison before owner review.

## Evidence on 2026-10-09

- The owner approved a temporary installation. fontTools 4.66.1, Brotli 1.2.0, and zopfli 0.4.3 are installed only in `/private/tmp/ethan-web-font-tools-20261009`. Project dependencies and global Python remain unchanged.
- The candidate retains all 20,745 mapped characters, 18 variation-selector mappings, the 100–900 weight axis, metrics, and source copyright and license metadata. Outline and advance-width checks passed for 83,012 comparisons at weights 100, 400, 700, and 900. This does not test every continuous weight.
- The original WOFF2 is 5,415,804 bytes. The common segment is 348,524 bytes. All 21 derived segments total 6,439,240 bytes; full coverage takes more storage than the original.
- Normal pages use the original font. Explicit `?font=segmented` previews use the candidate. The comparison CSS is imported into both modes and adds about 28 KB gzip to the CSS bundle. This is a review cost, not a measured production load-time result.
- Browser asset inventories for the candidate home and Chinese Jetson article showed only the common CJK segment, plus unchanged Inter and Manrope. They did not show the original CJK font as a loaded resource. These inventories and local file sizes do not measure transferred bytes or network timing.
- At a 375 px content width, the home heading had the same 343 × 108 px bounds and position after entrance motion settled. Both modes had no horizontal overflow. The Chinese article used the candidate family for headings and body text and had no horizontal overflow.
- Build, lint, typecheck, and diff whitespace checks passed. Screenshots and browser inventories are saved in the task visualization directory. The source font remains intact.
