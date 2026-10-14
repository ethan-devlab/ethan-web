# Design System Inspired by Shopify

## Page and navigation refinements (2026-10-11)

- On English pages, use Space Grotesk for the hero name and main-content headings. Use -0.02em tracking for the English hero name. Preserve the Chinese name's Noto Sans TC font and -0.04em tracking, Chinese pages, Inter body text, navigation, sizes, and weights. Keep the self-hosted variable font and OFL license in `src/assets/fonts/Space_Grotesk/`. The owner approved this replacement on 2026-10-13 after local comparisons.

- Keep the current hero fade, translation, scale, durations, and delays under normal motion preferences. Under system reduced motion, render the name, portrait, and role immediately without initial hidden states, motion, or delays.

- Use the approved 1745 × 1745 WebP portrait through a picture source, with the original JPEG as the format fallback. Set the JPEG fallback after the picture is attached to avoid WebKit requesting both formats. Preserve the original composition, color metadata, dimensions, and frame shadow. Remove the portrait format comparison query. The WebP is 351,174 bytes compared with the original 541,325-byte JPEG.

- Preload navigation page code on hover or keyboard focus without mounting the target page or requesting its photos/PDF. Show a deep forest loading line below the header while page code is pending, including internal links and history navigation. Keep the previous page during router transitions and reserve the main area on direct visits. The line moves slowly under normal motion preferences and stays static under reduced motion. In dark mode, use the original white at 28% opacity for its track. Do not add loading copy or a progress percentage.

- Load blog metadata separately from article bodies. The list must not request article bodies. Load only the selected article body when opening it, reuse the loaded module on later visits, and keep the loading line active until it arrives. Preserve all copy, filters, ordering, routes, draft visibility, syntax highlighting, and callouts.

- Load homepage photography carousel code when its section is within one viewport height of the visible area. Reserve the same section height before it loads. During loading, show the first original photo and its existing name, date, and location with pale decorative arrows. Keep this content accessible; controls become operable after initialization. Start the existing six-second playback after initialization. Preserve the full images, controls, pause rules, and reduced-motion behavior. Load immediately when viewport observation is unavailable.

- After an internal link opens another page and its code is ready, start at the top of the new page. For keyboard activation, focus the main content so Tab continues within that page. Pointer activation does not force content focus. Preserve same-page anchors and downloads. Browser back/forward restores the scroll position of each history entry after its content is ready. Keep these positions in memory for the current app session.

- For the selected contour refinement, use the original white for dark-mode primary arcs, slightly heavier primary text, pale secondary arcs, and transparent primary and secondary backgrounds. The owner approved removing the dark fill on 2026-10-13. Hover reveals complete contours over 320ms without a background change. Buttons keep their size while pressed. Keyboard focus uses one complete white outer outline; hide the inner arcs while focused to prevent a second contour.

- Contact rows keep transparent backgrounds, fixed positions, and unchanged separator colors on hover. Reveal a fine underline below the existing channel name over 320ms. Use the same underline for keyboard focus and show it immediately under reduced motion. Preserve channel labels, URLs, icons, layout, and focus outlines.

- Homepage technology tags use the current theme's muted text color at 55% opacity for their borders. Preserve tag shape, size, spacing, and copy.

- Article code blocks use 14px text at widths up to 767px and retain their existing desktop size. Preserve syntax colors, source text, internal horizontal scrolling, and keyboard focus.

- Allow long strings in article paragraphs, list items, and links to wrap when needed. Preserve the full source text and code-block horizontal scrolling. Long URLs must not expand the page beyond the viewport.

- Wrap article tables in a keyboard-focusable horizontal scroll container. Preserve table semantics, source text, column order, and font sizes. Use one deep forest focus outline in light mode and one white outline in dark mode, without an outer shadow.

- Homepage photography arrows, gallery preview arrows, and lightbox photo/work arrows use the approved pale arcs, 320ms contour reveal on hover, and one white outer keyboard focus outline. Keep existing control dimensions, positions, and navigation behavior. Arrows do not lift or scale on hover. The lightbox close control keeps its complete circular border.

- Record the actual gallery opener for lightbox focus restoration. Return focus to that button after closing, including WebKit pointer activation that does not focus the button before the dialog opens. Preserve Escape, modal focus, layout, and motion behavior.

- The header language switch uses pale arcs with the same 320ms reveal and single outer focus outline. Preserve its label, dimensions, and language routing. Keep the theme toggle as an icon without a visible border.
- On the scrolled forest header, use white at 55% opacity for the language-switch arcs in both themes. Keep the existing arc color on the transparent header.
- Blog list tags use transparent backgrounds and 1px borders from the theme's muted text color at 55% opacity. Keep the current text color, pill shape, font size, and outer dimensions. Article-row hover does not change tag colors.
- Use a single 2px outline without a shadow ring for keyboard focus on the language switch: forest green on the light transparent header, white on the scrolled forest header and in dark mode.

- Blog search and native filters use fine bottom borders instead of complete frames. Keyboard focus uses a brighter, three-pixel bottom line without a rectangular outline or outer shadow. Keep control dimensions and positions fixed. Preserve all existing labels, values, and filter behavior. Remove the unselected frame comparison.

- Use the original muted-text token for the blog search placeholder at full opacity. Preserve the existing placeholder copy.

- At widths from 360 to 767 px, blog search and the tag filter span the full width; language and category share a row. Below 360 px, keep all four controls stacked to preserve label space. Keep existing tablet/desktop layouts and keyboard order. Remove the unselected mobile layout comparison.

- The owner approved the contour system for all text buttons, with each button's existing semantic hierarchy. It is the default without query parameters. Remove the unselected A/C finishes, motion levels, circle/text-roll, and shape comparisons; preserve comparison screenshots as reference artifacts. Preserve existing labels and links. Disabled buttons do not show hover feedback. Photography controls use the existing deep forest functional accent; single-image dialogs hide photo arrows and retain group navigation.
- Keep text-only project rows; do not add product screenshots.
- Photography includes a warm exhibition light string between its heading and the first works. Use the approved clear, round-bellied 3D bulbs with short cylindrical necks, black sockets, and spiral filaments: seven above 560 px, three at smaller widths, about 70 px high. Keep the staggered suspension heights, slight sway, and slow independent brightness changes.
- Use the approved clean exhibition illumination near each bulb, with inverse-square diffuse-wall lighting and faint single air scattering. Keep photographs unfiltered. Use the efficient model, pixel ratio capped at 2, full-resolution glass transmission, and a Worker for the unchanged illumination formula at 250 ms intervals. This is a visual physical approximation, not full global illumination.
- Load the 3D scene within one viewport height, stop rendering outside the visible area or in a hidden document, and follow reduced-motion changes immediately. Dispose GPU resources and terminate Workers when leaving the page. If scene loading, WebGL, or illumination fails, remove the decoration and its reserved height while preserving the photography content. Remove the local iframe and unselected lamp comparison parameters.
- Pause background lamp rendering and illumination while the lightbox is open. Keep the last frame and reserved space. Resume according to visibility and system motion preferences after the lightbox closes; preserve its photo controls and focus return.
- Rebuild theme-specific lamp scenes on separate canvases. Release the retired WebGL context without affecting the new scene, and ignore failure callbacks from retired scenes. Theme changes must preserve the lamp decoration without a page reload.
- Footer icon links have targets of at least 24 × 24 px, with centered 20 px icons and separate adjacent targets. Preserve their existing colors, URLs, and labels.
- At widths up to 640 px, use 48 px top and bottom padding for the homepage project, photography, and capability sections. Keep desktop spacing, hero spacing, and row spacing. The mobile hero keeps its previously approved 48 px top padding with sufficient selector specificity.

- Match homepage project separators to the accepted blog separator colors. Preserve the project content, layout, and spacing.
- In light mode, use the original deep forest functional accent for homepage project numbers and highlight dots. Preserve the dark mode colors.
- In light mode, keep the closing CTA buttons' backgrounds and text colors fixed on hover; reveal only their contours. Keep the existing outer card appearance, but remove its hover lift, brightness, and shadow change so the button interaction stays stable.
- All light mode text buttons use the approved shared rules: transparent primary backgrounds with deep forest text and 1.5 px deep forest arcs; transparent secondary backgrounds with pale arcs and fixed text colors on hover; existing tertiary underlines. Preserve labels, the 320 ms reveal, stronger primary text, fixed dimensions, single focus outlines, and disabled states. Remove the surface comparison parameter and retain dark mode unchanged.
- Render the existing not-found content inside the shared layout, including navigation, footer, language/theme controls, and the contour button system. Derive its layout language from the URL when no language route parameter exists. Preserve the existing error copy and fallback route matching.
- Keep the existing pale separators on the light experience timeline.
- Keep the existing experience summary and timeline text widths. Separate adjacent responsibility list items by 8 px on both desktop and mobile. Preserve copy, type sizes, date columns, and separators. Remove the timeline spacing comparison parameter.
- In light mode, use a transparent resume preview container without its outer rounded border or shadow. Preserve the PDF boundary, title, dimensions, dark mode appearance, and mobile preview rule. Remove the resume surface comparison parameter.
- Hide the entire English resume preview area when its PDF is unavailable. Keep both document cards and their existing availability-based button states. Preserve the Chinese preview and its fallback behavior.
- Use a full-width single column on desktop while the English preview is unavailable. Restore the existing split layout when its PDF is available. Keep the Chinese preview layout and mobile arrangement. Remove the resume layout comparison parameter.
- Use transparent footers in light mode. Keep the original separator, copy, icons, links, spacing, and dark mode appearance. Remove the footer surface comparison parameter.
- Under system reduced motion, render experience entries and photography cards immediately without hidden initial states, movement, or delays. Disable photography card hover movement and dialog, preview, photo, and group transition effects. Keep manual controls and focus return. Preserve normal motion behavior.
- Apply system motion preference changes immediately on the hero, experience entries, and photography surfaces without a page reload. Stop active transforms, fades, and blur effects while retaining an open dialog and its manual controls.
- Under system reduced motion, open and close the mobile navigation panel immediately without translation or fading. Apply preference changes immediately. Preserve the normal 200 ms animation, layout, dismissal, and focus rules.
- Limit the mobile navigation panel to the viewport height minus its 64 px top offset and 16 px bottom clearance. Scroll excess content inside the panel and contain vertical scroll chaining. Preserve labels, spacing, colors, and text size at browser zoom and in short windows.
- Above 900 px, constrain the photography dialog grid to the viewport height. Fit the full photo within the media area and scroll the details column independently. Keep the close and group controls visible, with the existing column proportions, copy, colors, and motion.
- For landscape viewports up to 900 px wide and 600 px high, keep the stacked photography dialog and scale its media area to the viewport height. Show the full photo and counter before scrolling. Keep the close control fixed while the details scroll. Preserve portrait layouts and remove the height comparison parameter.
- At widths up to 900 px, keep the photography close control fixed while its content scrolls. Preserve its original top-right position, circular outline, portrait photo size, stacked layout, and focus return.
- At desktop widths of 1376 px and above, place photography group controls 24 px outside the centered dialog. Keep existing positions below that width and on mobile. Preserve dimensions, contour motion, colors, fine edges, and focus behavior. Remove the position comparison parameter.
- Isolate page-code failures inside the main content area. Keep navigation and the footer available, clear the loading state, and center the existing home return link with a transparent background in both themes. Isolate article-body failures inside the article while preserving its heading and existing blog return link. Do not add failure copy. For a page-module load failure, reload the current destination once only when a JavaScript-specific request confirms the old entry is missing and a fresh HTML response names a different same-origin entry. Record the target in session storage before reloading to prevent loops. Network failures and unchanged versions retain the fallback without reloading.
- Isolate homepage carousel-code failures inside its section and retain the existing first-photo placeholder, metadata, and pale decorative arrows. Keep the rest of the homepage available. Do not add failure copy, retry controls, or automatic reloads.
- When a photography WebP request fails, try the same original photo once in homepage placeholders, carousel slides, gallery previews, and dialogs. Keep normal WebP-only requests, composition, and copy. Stop after an original request also fails.
- In light mode, homepage photography arrows use a transparent background and the original deep forest functional accent. Keep the background transparent on hover and reveal only the contours. Preserve control dimensions, hit areas, keyboard focus, and playback behavior.
- In light mode, photography dialog group controls use transparent backgrounds and deep forest arrows and arcs. Above 900 px, add fixed white fine edges to separate the arrows and arcs from the backdrop. At 900 px and below, keep pure deep forest controls on the light details surface. Preserve positions, dimensions, the 320 ms reveal, focus behavior, and the circular close control. Remove the group surface comparison parameter.

- Keep all languages as the default blog list filter.
- Use the selected resume split composition: document controls on the left and the existing PDF preview on the right above 1024 px; stack controls before the preview from 768 to 1023 px. Keep the original hidden preview below 768 px, as confirmed by the owner. Show the Chinese document first, retain the disabled English controls, and preserve all existing copy and PDF sources.
- At widths up to 640 px, use 48 px top and bottom padding on the experience, blog list, contact, and resume page sections. Preserve article and photography page spacing.

- Keep the original article heading, introduction, and paper width. The narrower reading preview was rejected and removed.
- Use one 2 px outline for focused article code blocks: the existing deep forest functional accent in light mode and original white in dark mode. Keep the existing rounded corners, native scrolling, code, and unfocused appearance.
- Keep lightbox controls consistent across themes based on their background: transparent group controls use deep forest arrows and arcs with fine white edges; transparent photo controls over the black media area use white arrows and pale white arcs. Preserve dimensions, positions, and the 320 ms reveal. Reserve the counter height below the complete photo with a 16 px gap.
- Gallery pagination keeps its 7 px inactive dots and 18 by 7 px active marker. Use separated 24 by 24 px button hit areas with the original labels and navigation; preserve the visible markers' vertical centers.
- Use complete original photo proportions for the gallery cards. Place the 14 works at successive lowest column positions, keep their source and keyboard order, and update card heights and controls when previews or viewport widths change. Remove the layout comparison parameter.
- On the existing experience mobile layout (up to 900 px), add 8 px between responsibility list items. Preserve desktop spacing, copy, typography, and timeline separators; remove the spacing comparison parameter.
- Keep all five homepage project rows at the existing equal hierarchy. The owner rejected the Codex Token Dashboard featured composition; remove its query comparison and styles while retaining reference screenshots.
- Add the existing secondary button below each article, aligned left. Reuse `返回部落格 / Back to Blog` and return to the list in the current route language.
- Make each blog list title link to the same article as its existing reading link.
- Preserve the current search, language, category, and tag filters through article links, the article return button, and browser back/forward navigation using router navigation state. Replace the current list history entry when filters change. Direct article visits return to the unfiltered list. Do not add persistent storage or filter query parameters.

The owner selected single-column blog article rows. Above 900 px, metadata, article content, and the reading link occupy separate columns; narrower widths stack them. Put the pin indicator next to the date, with the category below. Preserve all titles, descriptions, tags, links, pinned ordering, and filters. Separators use the existing deep forest accent at 55% opacity in light mode and the existing muted-text token in dark mode. Keep the original description text color.

The owner selected a contact grid with fine row separators, two equal columns above 900 px, and one column at narrower widths. Remove the outer card and individual channel frames, and remove the Chinese and English channel eyebrow labels. Preserve the four original links, labels, values, icons, and their order.

The owner selected an icon-only mobile menu button: three horizontal lines when closed and a cross when open, with no background or visible border. Keep its existing accessible name, expanded state, keyboard focus indication, and Escape behavior. Mobile navigation links align left; desktop navigation stays unchanged. Clicking outside the menu panel and toggle closes the menu; controls inside the panel remain operable without outside dismissal.

The owner selected the split timeline after browser comparison. Above 900 px, dates occupy a 200 px left column and align with the top of each entry title. At narrower widths, dates precede the content. Fine token-based separators replace card surfaces and shadows. Preserve all original entry text, the summary, the resume link, and the existing section headings. The owner rejected the shorter summary-width candidate; keep the original full width.

## Confirmed Refinement (2026-10-09)

This section supersedes the earlier direction palettes. Preserve the original forest-green colors, alpha values, gradients, and shadows; convert their notation to OKLCH without a color redesign. Original black and white remain equivalent neutral endpoints by the owner's explicit choice. Use the C prototype fonts: Manrope for display, Inter for body, and Noto Sans TC for Chinese. Use the C native disclosure pattern for skills, with existing labels and items; all start closed and multiple groups can stay open. Use the selected split hero, with a separate Chinese name line, more space between names, no added portrait ring, and the original portrait shadow. At mobile widths, place the portrait before the name and introduction. Homepage order is hero, five project rows, photography carousel, skills, and the original closing CTA. Show the first image from each photography group in full, without a link, with existing name, date, and location. Use six-second autoplay plus manual navigation; pause on hover or focus, resume after both leave, and disable autoplay and transitions for system reduced motion. Do not add a pause button or motion settings UI. Do not introduce AI-generated copy. Ask before other visual or narrative decisions.

## Homepage Direction Review (2026-10-08)

This section takes precedence for the three review homepages. The owner approved a new visual direction and retained all five current projects, six navigation destinations, and current contact channels, including LinkedIn. The earlier Shopify reference remains a baseline for the original homepage and other pages until a direction is selected.

- **A, Systems builder:** technical partners review work on a desktop in a quiet evening workspace. Forest surfaces and a layered structural composition frame the engineering work. Precise, connected, grounded. Restrained mint accents. Manrope display, Inter and Noto Sans TC text.
- **B, Engineer in practice:** a hiring manager reads a profile on a laptop in a bright office. Mist-white surfaces and ink-blue type support fast reading in light mode; dark mode has the same hierarchy. Portrait and current experience precede projects. Clear, personal, capable. Stronger display weight, existing font files only.
- **C, Observe & build:** a curious peer explores original photography and software on a phone after work. Night surfaces, copper accents, and original Malaysian and Taiwanese images express the personal perspective. Observant, tactile, exploratory. Photography provides the main color commitment; controls remain restrained. A warm light theme supports daylight use.

All new palette values use OKLCH and role tokens in `src/styles/directions.css`. Light/dark palettes have separate luminance and chroma values. Do not use pure black or white in the new palette. Keep body text below 68ch and preserve readable localized type. Use native disclosures for the full skills list, full-width project rows, and real route links. The structural image is explicitly conceptual, not a disclosed private architecture.

The direction picker is a review-only control. Remove it when the owner selects the production direction. Entrance motion uses opacity and transform with an exponential ease-out; reduced-motion users receive static content. Do not claim award-level quality or WCAG conformance from self-evaluation alone. The selected direction still needs a full-site refinement pass.

## 1. Visual Theme & Atmosphere

Shopify.com is a dark-first digital theatre — a website that stages its commerce platform like a cinematic premiere. The entire experience unfolds against an abyss of near-black surfaces that carry the faintest whisper of deep forest green (`#02090A`, `#061A1C`, `#102620`), creating a nocturnal atmosphere that feels less like a SaaS marketing page and more like an exclusive product reveal at a tech keynote. This darkness isn't cold or corporate — it's the warm, enveloping dark of a luxury experience, like sitting in the front row of a darkened auditorium.

The typography is the undeniable star. Inter is loaded from Google Fonts and used as the unified English typeface across Windows and macOS, avoiding unavailable local fonts such as Neue Haas Grotesk or Helvetica. At display scale (96px) with impossibly light weight (330-400), it creates headlines that feel etched in light rather than printed in ink. The same variable family handles body text with surgical precision, using unusual weights (420, 450, 550) that live in the spaces between traditional weight stops. This precision signals a company that sweats every detail.

Color is used with extreme restraint. The primary accent is Shopify Neon Green (`#36F4A4`) — an electric mint that appears exclusively on focus rings and accent highlights, pulsing like a bioluminescent signal against the dark canvas. Softer green tints (Aloe `#C1FBD4`, Pistachio `#D4F9E0`) provide atmospheric washes. White is the only text color that matters on dark surfaces, while a zinc-based neutral scale (`#A1A1AA` through `#3F3F46`) handles the hierarchy of quiet information. The result is a design that makes commerce technology feel like it belongs in a science-fiction future.

**Key Characteristics:**
- Dark-first design with deep forest-teal undertones (not pure black)
- Ultra-light display typography (weight 330) at monumental scale (96px) creating an ethereal presence
- Neon Green (`#36F4A4`) as the singular high-energy accent against darkness
- Full-pill buttons (9999px radius) as the primary interactive shape
- Layered, multi-stage box shadows creating photographic depth
- Product screenshots embedded in dark UI contexts, matching the surrounding darkness
- Zinc-based neutral scale for text hierarchy — balanced between warm and cool

## 2. Color Palette & Roles

### Primary

- **Shopify White** (`#FFFFFF`): Primary text on dark surfaces, button fills, high-contrast elements
- **Shopify Black** (`#000000`): Body background, button text on white, maximum contrast base (--color-shade-100)

### Secondary & Accent

- **Neon Green** (`#36F4A4`): The signature accent — focus rings, interactive highlights, active state indicators. Electric and bioluminescent
- **Aloe** (`#C1FBD4`): Soft green wash for decorative backgrounds, atmospheric cards (--color-aloe-10)
- **Pistachio** (`#D4F9E0`): Lightest green tint for subtle surface differentiation (--color-pistachio-10)

### Surface & Background

- **Void** (`#000000`): Root page background — true black for maximum depth
- **Deep Teal** (`#02090A`): Card surfaces, content containers — near-black with green undertone
- **Dark Forest** (`#061A1C`): Section backgrounds with visible green character
- **Forest** (`#102620`): Elevated dark surfaces, header backgrounds — the warmest dark shade
- **Dark Card Border** (`#1E2C31`): Card borders on dark surfaces, subtle boundary definition

### Neutrals & Text (Zinc Scale)

- **Shade-30** (`#D4D4D8`): Lightest neutral, barely-there borders on dark (--color-shade-30)
- **Muted Text** (`#A1A1AA`): Secondary text, metadata, descriptions — the quiet voice
- **Shade-50** (`#71717A`): Tertiary text, timestamps, least important info (--color-shade-50)
- **Shade-60** (`#52525B`): Disabled text, decorative neutrals (--color-shade-60)
- **Shade-70** (`#3F3F46`): Subtle dividers, barely-visible UI boundaries (--color-shade-70)
- **Light Border** (`#E4E4E7`): Borders on light surfaces (rare — only in light-mode modals)

### Semantic & Accent

- **Link Muted** (`#9797A2`): Muted link text with underline decoration
- **Link Sage** (`#9DABAD`): Teal-tinted muted links
- **Link Lavender** (`#BDBDCA`): Lighter link variant
- **Link Mint** (`#99B3AD`): Green-tinted link variant for themed sections

### Gradient System

- **Dark Teal Wash**: Radial gradient from `#102620` center to `#02090A` edge — used behind product showcases
- **Green Atmospheric**: Subtle green-tinted ambient gradients behind hero sections, creating depth without solid colors
- **Spotlight**: Focused bright area fading to black — creates keynote-style presentation lighting

## 3. Typography Rules

### Font Family

**Display:** Inter (Google Fonts variable font)
- Fallbacks: Noto Sans TC, Arial, sans-serif
- Available weights: 100-900; use 330, 360, 400, 500, and 750 where the design calls for precision
- Used for all headings, hero text, and large display elements

**Body:** Inter (Google Fonts variable font)
- Fallbacks: Noto Sans TC, Arial, sans-serif
- Available weights: 100-900; use 400, 420, 450, 500, and 550 for body and UI hierarchy
- Used for body text, links, buttons, UI elements

**Traditional Chinese:** Noto Serif TC for localized Chinese page typography, with Noto Sans TC available for mixed-language hero/name fallback.

**Mono:** ui-monospace
- Fallbacks: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New
- Used for code snippets, data labels, technical content

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Display XL | 96px | 400 | 1.00 | — | Inter, hero headlines |
| Display XL Bold | 90.74px | 750 | 1.00 | 4.54px | Inter, emphasis display |
| Display XL Tracked | 96px | 400 | 1.00 | 2.4px | Inter, spaced display |
| Display Light | 96px | 330 | 0.96 | — | Inter, ethereal display |
| Heading 1 | 70px | 330 | 1.00 | — | Inter, section titles |
| Heading 2 | 55px | 330 | 1.16 | — | Inter, subsections |
| Heading 3 | 48px | 330 | 1.14 | — | Inter, feature titles |
| Heading 4 | 32px | 360 | 1.14 | 0.32px | Inter, card headings |
| Heading 5 | 28px | 500 | 1.28 | 0.42px | Inter, small headings |
| Heading 6 | 24px | 400 | 1.14 | 0.36px | Inter, minor headings |
| Body Large | 20px | 500 | 1.40 | 0.3px | Inter, lead paragraphs |
| Body | 18px | 400 | 1.56 | — | Inter, standard body |
| Body Medium | 18px | 550 | 1.56 | — | Inter, emphasized body |
| Body Small | 16px | 400 | 1.50 | — | Inter, compact body |
| Body Small Medium | 16px | 420 | 1.50 | — | Inter, slightly emphasized |
| Button | 16px | 400 | 1.50 | — | Inter, CTA text |
| Nav Link | 18px | 500 | 1.25 | 0.72px | Inter, navigation items |
| Caption | 14px | 500 | 1.49 | 0.28px | Inter, metadata |
| Caption Medium | 14px | 550 | 1.49 | 0.28px | Inter, emphasized caption |
| Overline | 15.36px | 400 | 1.50 | 1.54px | Inter, wide-tracked labels |
| Micro | 13px | 500 | 1.50 | -0.13px | Inter, tight-tracked small text |
| Label | 12px | 400 | 1.20 | 0.72px | Inter, uppercase labels |
| Code | 16px | 400 | 1.50 | — | ui-monospace, uppercase, code blocks |
| Code Small | 12px | 400 | 1.33 | — | ui-monospace, uppercase, inline code |

### Principles

Shopify's typography is a masterclass in variable font precision. The display layer lives almost exclusively at weights 330-400 — featherweight text that appears to hover above the dark background like projected light. This is the opposite of the bold, heavy approach most SaaS sites take: where others shout, Shopify whispers at scale. The 96px headlines at weight 330 create a paradox of enormous size and delicate stroke that feels both monumental and fragile. Inter handles both the display and body layers with surgical precision, using weights like 420 and 550 that exist between the traditional stops — every piece of text has exactly the visual weight it needs while rendering consistently across Windows and macOS.

## 4. Component Stylings

### Buttons

**Primary (White Fill)**
- Background: White (`#FFFFFF`)
- Text: Black (`#000000`)
- Border: 2px solid transparent
- Border radius: full pill (9999px)
- Padding: 12px 26px 12px 16px (asymmetric — more right padding for visual balance)
- Hover: slight opacity reduction or background shift
- Focus: 2px `#36F4A4` (Neon Green) outline ring
- Transition: all 200ms ease

**Secondary (Ghost/Outlined)**
- Background: transparent
- Text: White (`#FFFFFF`)
- Border: 2px solid White (`#FFFFFF`)
- Border radius: full pill (9999px)
- Padding: 12px 26px 12px 16px
- Hover: fills to white bg with black text
- Focus: 2px `#36F4A4` outline

**Badge/Tag (Neutral Filled)**
- Background: `rgba(255, 255, 255, 0.2)` (frosted glass)
- Text: White (`#FFFFFF`)
- Border: none
- Border radius: subtly rounded (4px)
- Padding: 12px 16px
- Font: 16px regular

### Cards & Containers

- Background: Deep Teal (`#02090A`) on dark pages
- Border: 1px solid `#1E2C31` (Dark Card Border) — barely visible boundary
- Border radius: 8px for standard cards, 12px for featured cards, 20px 20px 0 0 for top-rounded cards
- Shadow: Multi-layered system:
  - Resting: `rgba(0,0,0,0.1) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 2px 2px, rgba(0,0,0,0.1) 0px 4px 4px, rgba(0,0,0,0.1) 0px 8px 8px` + `rgba(255,255,255,0.03) 0px 1px 0px inset`
  - The inset white highlight creates a subtle top-edge glow
- Hover: shadow expands, card may slightly brighten
- Transition: box-shadow 300ms ease, transform 200ms ease

### Inputs & Forms

- Background: transparent or Dark Forest (`#061A1C`)
- Text: White (`#FFFFFF`)
- Border: 1px solid `#3F3F46` (Shade-70)
- Border radius: 8px
- Padding: 12px 16px
- Focus: 2px solid `#36F4A4` (Neon Green focus ring)
- Placeholder: Shade-50 (`#71717A`)
- Transition: border-color 200ms ease

### Navigation

- Background: transparent (overlaid on dark hero), becomes Forest (`#102620`) on scroll
- Height: ~64px
- Left: Shopify wordmark logo (SVG, white on dark)
- Center/Right: nav links in 18px/500 Inter, white, letter-spacing 0.72px
- CTA: White pill button "Start for free" (right)
- Secondary CTA: Ghost button with white border
- Hover: links shift to Muted Text (`#A1A1AA`) or gain underline
- Mobile: hamburger menu, full-screen dark overlay
- Transition: background 300ms ease on scroll

### Image Treatment

- Product screenshots: embedded in dark UI contexts, matching the surrounding darkness
- Admin interface previews: shown on dark backgrounds with subtle card borders
- Aspect ratios: varied — hero images are wide (16:9-ish), feature shots are flexible
- All images sit flush within dark containers — no bright borders or frames
- Lazy loading with dark placeholder surfaces

### Trust Indicators

- Statistics displayed prominently: "15+" (years), "150M+" (buyers)
- Numbers at display scale in Inter
- Partner/developer ecosystem callout sections
- Dark-themed testimonials integrated into the page flow

## 5. Layout Principles

### Spacing System

Base unit: 8px

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Tight inline gaps |
| space-2 | 8px | Base unit, icon gaps |
| space-3 | 12px | Card padding, tight margins |
| space-4 | 16px | Standard element padding |
| space-5 | 24px | Card gaps, section padding |
| space-6 | 28px | Medium section spacing |
| space-7 | 32px | Section breaks |
| space-8 | 36px | Large padding |
| space-9 | 40px | Major section padding |
| space-10 | 64px | Hero section padding, large gaps |

### Grid & Container

- Max container width: ~1280px (centered)
- Hero: full-width, edge-to-edge dark background with centered text
- Feature sections: 2-column layouts with text and product screenshots
- Stats sections: horizontal layout with large numbers
- Horizontal padding: 64px desktop, 32px tablet, 16px mobile
- Grid gap: 24-32px between major content blocks

### Whitespace Philosophy

Shopify's whitespace strategy is theatrical. Sections are separated by vast expanses of dark space — 80px to 120px of pure black breathing room — that create the pacing of a presentation, not a webpage. Each content block is its own "slide" in a keynote-style scroll. Within sections, spacing is tighter and more deliberate, creating focal density against the expansive void. The contrast between macro-level emptiness and micro-level precision is what gives the site its cinematic cadence.

### Border Radius Scale

| Value | Context |
|-------|---------|
| 4px | Tags, badges, micro-elements |
| 8px | Standard cards, inputs, video containers |
| 12px | Featured cards, image containers, buttons (non-pill) |
| 20px | Top-rounded cards (20px 20px 0 0), modal headers |
| 340px | Large rounded decorative elements |
| 9999px | Pill buttons, pill badges, nav elements |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | No shadow, dark surface | Default page background |
| Subtle | `rgba(0,0,0,0.1) 0px 0px 0px 1px` + inset white glow | Resting cards |
| Medium | Multi-layer: 1px ring + 2px + 4px + 8px shadow stack | Elevated cards, featured sections |
| High | `rgba(0,0,0,0.25) 0px 25px 50px -12px` | Modals, dropdowns, overlays |
| Focus | `0px 0px 0px 2px #36F4A4` | Keyboard focus ring (Neon Green) |

Shopify's shadow system is unusually sophisticated. Rather than single-value shadows, cards use a stacked, multi-layer approach: a 1px ring for boundary definition, 2px/4px/8px progressive blurs for natural light falloff, and a delicate inset white glow (`rgba(255,255,255,0.03)`) that simulates a top-lit glass surface. On dark backgrounds, shadows darken from already-dark surfaces, so the shadows function more as "ambient occlusion" than traditional elevation — the card appears to sink slightly into the surface rather than float above it.

### Decorative Depth

- **Dark teal gradients**: Ambient radial washes behind hero sections and product showcases
- **Spotlight effects**: Bright centered areas fading to black, creating keynote-style theatrical lighting
- **Edge glow**: Subtle light colored edges on dark cards via inset box-shadow
- **Green atmospheric halos**: Faint green tints in background gradients, echoing the brand accent

## 7. Do's and Don'ts

### Do

- Use the dark teal-black surface hierarchy (Void → Deep Teal → Dark Forest → Forest) for depth
- Keep display typography at weight 330-400 — the ethereal lightness is the design's signature
- Use Neon Green (`#36F4A4`) exclusively for focus states and critical accent highlights
- Apply 9999px radius to all primary CTA buttons — the full pill is non-negotiable
- Use the multi-layered shadow system for card elevation — single shadows look flat
- Use Inter for English body text, headings, navigation, buttons, and display typography
- Use Noto Serif TC for localized Traditional Chinese page typography and Noto Sans TC for mixed-language fallback
- Create theatrical spacing between sections (80px+) for cinematic pacing

### Don't

- Don't use pure black (#000000) for text on dark backgrounds — use white (#FFFFFF) only
- Don't introduce warm colors (orange, red, yellow) — the palette is strictly cool (greens, teals, neutrals)
- Don't rely on unavailable proprietary or system-dependent English fonts such as Neue Haas Grotesk or Helvetica
- Don't use font weights above 500 for standard body text — heavy weights break the ethereal feel
- Don't apply green accents to large surfaces — Neon Green is for small, precise highlights only
- Don't use sharp corners (0px radius) on interactive elements — everything rounds
- Don't add bright backgrounds — the dark theme is fundamental, not optional
- Don't use single-layer box shadows — the stacked approach is the system
- Don't set line-height above 1.56 for body text — Shopify's text is relatively compact
- Don't mix multiple English sans families for the same role — Inter should remain the unified English font
- Don't use letter-spacing below 0 for headings — Shopify headings track neutral or positive

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, hamburger nav, display text scales to 48px, 16px padding |
| Tablet | 640-1024px | 2-column grids begin, display text at 70px, 32px padding |
| Desktop | 1024-1440px | Full layout, expanded nav, 96px display, 64px padding |
| Large Desktop | >1440px | Max-width container centered, increased section spacing |

### Touch Targets

- Minimum touch target: 44x44px (WCAG AAA)
- Pill buttons: 48px height minimum with generous horizontal padding
- Nav links: 44px touch area
- Card surfaces: full card is tappable where linked

### Collapsing Strategy

- **Navigation**: Full horizontal links → hamburger menu below 1024px; logo and CTA button remain visible
- **Hero section**: 96px display → 70px at tablet → 48px on mobile; maintains single-column center alignment
- **Feature sections**: 2-column text+image → stacked single column below 768px
- **Stats**: Horizontal row → stacked vertical on mobile
- **Section padding**: 64px → 40px → 24px → 16px as viewport narrows
- **Cards**: Grid → stack, maintaining full-width on mobile

### Image Behavior

- Product screenshots: responsive within dark containers, maintain aspect ratio
- Hero images: full-width on all breakpoints, lazy loaded with dark placeholders
- Admin UI previews: scale proportionally, may crop on mobile
- All images use CDN (`cdn.shopify.com`) with responsive srcset

## 9. Agent Prompt Guide

### Quick Color Reference

- Primary CTA: Shopify White (`#FFFFFF`)
- Page background: Void Black (`#000000`)
- Card surface: Deep Teal (`#02090A`)
- Section bg: Dark Forest (`#061A1C`)
- Elevated bg: Forest (`#102620`)
- Accent: Neon Green (`#36F4A4`)
- Body text: White (`#FFFFFF`)
- Muted text: Muted (`#A1A1AA`)
- Border dark: Dark Card Border (`#1E2C31`)

### Example Component Prompts

- "Create a hero section on true black (#000000) background with a 96px/330 Inter headline in white, a 20px/500 subtitle in #A1A1AA, and two pill buttons: white filled (9999px radius) and ghost with 2px white border"
- "Design a feature card on Deep Teal (#02090A) with 1px #1E2C31 border, 12px radius, multi-layer shadow (1px ring + 2px/4px/8px blur at 10% black), containing a 32px/360 white heading and 18px/400 #A1A1AA body text"
- "Build a stats section on Dark Forest (#061A1C) with 96px/750 white numbers (Inter), 16px/400 #A1A1AA descriptive labels, and generous 64px spacing between stat blocks"
- "Create a sticky nav with transparent background (becomes #102620 on scroll), white Shopify logo left, 18px/500 white nav links with 0.72px letter-spacing, and a white pill 'Start for free' button right"
- "Design a tag/badge with rgba(255,255,255,0.2) frosted glass background, 4px radius, 12px 16px padding, white 16px text — floating over a dark card surface"

### Iteration Guide

When refining existing screens generated with this design system:
1. Focus on ONE component at a time
2. Reference specific color names and hex codes from this document
3. Remember: this is a DARK-FIRST design — light surfaces are the exception, not the rule
4. Display text should always feel feather-light (weight 330-400) — if it looks heavy, reduce the weight
5. Neon Green (#36F4A4) is precious — use sparingly for focus and accent only
6. The dark surface hierarchy (black → deep teal → dark forest → forest) creates subtle depth
7. Shadows are multi-layered — a single `box-shadow` value won't capture the Shopify card feel
8. Inter must remain the unified English font for typographic consistency across Windows and macOS
