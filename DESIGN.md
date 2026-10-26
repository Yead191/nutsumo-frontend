# LocalHomeFix design system

Visual tokens taken from the Plumby template (`html.vecurosoft.com/plumby`), then tightened for a product UI. Content stays LocalHomeFix.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| Primary | `#0D56D6` | Buttons, links, selected states |
| Primary hover / secondary | `#00A1DE` | Hover and supporting actions |
| Title | `#00151D` | Headings |
| Text | `#5B5B5B` | Body |
| Body / surface | `#ECF1F5` | Page chrome |
| Smoke | `#F1F6FF` | Soft panels |
| Ink | `#01133C` | Hero and footer |
| Accent | `#FA951F` | Sparse emphasis |
| Success / error | `#28a745` / `#dc3545` | Status only |

## Type

- Display: Rubik, 700
- Body: Archivo, 400
- Body size: 16 / 26 desktop, 14 / 24 mobile
- Product headings stay on the template scale (H1 36–48, H2 32–40). Hero copy does not use the 74px marketing size.

## Controls

- Default button: Rubik 700, 16px, 50px tall, radius 10px, primary fill
- Large button: 18px, 56px tall, radius 10px
- Inputs: 50px tall, radius 10px, `#d7e2ea` border, primary focus
- Cards: radius 14–20px, 24px padding
- Hero / page banner slider: radius 0 only
- Container: 1320px, 20px page gutter
- Section space: 56px mobile, 88px desktop

## Hierarchy

- Section labels: 12px uppercase, primary, no pill.
- Headings: title `#00151D`. On dark surfaces, force white.
- Body: copy `#5B5B5B`.
- Icons: smoke well + primary glyph. Hover inverts to primary well + white glyph.
- Primary fill is for CTAs and one accent per block. Do not paint every chip, check, and heading blue.
- White text on primary / secondary buttons. Title text on white buttons.

## Rules

- Tokens live in `src/app/globals.css`. Components use token classes, not raw hex.
- Ant Design is themed from the same palette in `src/lib/antd-theme.ts`.
- Do not invent service categories. Use the nine catalog trades only.
- Do not show a homeowner checkout or a project-payment button.
- Do not repeat the same policy paragraph on every section.
