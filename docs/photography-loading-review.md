# Photography Loading Review

## Owner decisions on 2026-10-09

- Keep the full original C font; do not adopt segmented font loading.
- Use WebP quality 90, method 6 for all photography images in the home carousel, gallery cards, and lightbox. Keep original files intact.
- Keep all WebP files, including three larger conversions: Yuguang Forest, Taipei 101, and Tasik Cermin 2. The owner reviewed the size increase and selected a consistent setting.

## Implementation and checks

`src/data/photographyImages.ts` maps 19 original filenames to their WebP counterparts in `public/photography/webp/`. The existing URL helper resolves this map and retains remote URLs, unknown-file fallback, and the deployment base path. Public photo names, dates, coordinates, and copy are unchanged.

All 19 output files decoded successfully. Display dimensions and ICC profiles match the source. EXIF display orientation is applied to the pixels and cleared so portrait photos retain their display direction. Original source files have no edits.

The complete image set changed from 33,468,119 to 25,455,032 bytes (about 24% less). This is a file-size comparison, not a measured load-time improvement. The first sunset image changed from 1,672,975 to 458,708 bytes. Originals remain in the build's public assets for preservation, which increases total deployment storage.

Build, lint, typecheck, and whitespace checks passed. Browser checks confirmed WebP paths on all 14 gallery cards, loaded first-card and lightbox images, multi-image preview selection, group navigation, Escape closure, and portrait orientation. Offscreen lazy images are not all loaded by these checks. The existing photography E2E file uses obsolete 12-card placeholder data and the former font; it was not run as current acceptance evidence.

The comparison page, conversion manifest, and screenshots are saved in the task visualization directory. Candidate files retain the full source dimensions and composition; no resizing or cropping was applied.

## Lightbox keyboard review on 2026-10-11

The owner approved focus repair. The lightbox now uses a native modal dialog. On open, it focuses the existing visible close button. Background controls are inert while the dialog is open. Photo and group changes keep the same dialog mounted. Escape starts the existing exit animation; cleanup closes the native dialog and restores the opener when it remains connected.

Browser checks passed for initial focus, reverse Tab, forward traversal through the dialog and embedded map, Escape closure, close-button closure, opener restoration, and group navigation without focus reset. Native traversal can reach browser chrome; no background page control received focus. A 390 px viewport check confirmed the dialog fits the viewport and restores the opener after group navigation and closure. The browser viewport override was reset after checking.

Build, lint, and typecheck passed. The original preview tab retained a failed connection state after the local server stopped; a fresh tab loaded the restarted server and provided the runtime evidence. The screenshots and focus observations are saved as `lightbox-focus-mobile-20261011.png` and `lightbox-focus-checks-20261011.json` in the task visualization directory.

The owner also approved keeping the photo counter at the bottom of the image area. At widths up to 900 px, the stacked lightbox now uses content-sized grid rows. The image stage can no longer overflow a compressed media row and place its counter over the location heading. Browser bounds checks passed at 390 × 844, 390 × 600, 800 × 844, and 1280 × 844: the counter stayed inside the media area and did not overlap the details. Portrait and landscape samples retained `object-fit: contain`. Evidence is saved as `lightbox-counter-mobile-20261011.png` and `lightbox-counter-checks-20261011.json`.

The owner selected an inline row below the photo for group navigation at narrow widths. Below 901 px, only the inline control set is visible and occupies its own grid row before the details. Desktop keeps the existing side controls. Browser checks confirmed the row sits between the media and details, only one next-group button is exposed, group switching retains focus, and desktop previous-group navigation works. Build and lint passed. Evidence is saved as `lightbox-group-row-mobile-20261011.png` and `lightbox-group-layout-checks-20261011.json`.

The owner approved keeping the current large photo area at narrow widths, with details below it and vertical scrolling when required.

The obsolete photography E2E tests were refreshed on 2026-10-11. All three Chromium scenarios passed: current bilingual metadata and font stack, WebP gallery sources and multi-image modal state, close focus and opener restoration, and narrow-screen group controls and counter placement. The first execution was blocked by sandbox local-server access; the authorized run used the existing preview server. Two selector failures were corrected by distinguishing the main photo opener from preview dots and the visible close button from the backdrop close control.

Two homepage photography Chromium scenarios also passed on 2026-10-11. Browser reduced-motion emulation stopped automatic playback for a full playback interval and kept manual button and keyboard navigation with zero transition duration. Normal playback advanced after six seconds, stayed paused while hovered or focused, and resumed only after both left. This is browser emulation evidence; macOS system preference switching was not tested.
