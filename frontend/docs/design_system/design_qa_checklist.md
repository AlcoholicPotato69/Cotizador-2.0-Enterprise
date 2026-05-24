# Design QA Checklist
## Frontend Aesthetics & UX Guardrails

Before submitting a Pull Request, all frontend engineers must verify their work against this rigorous checklist to ensure our Enterprise Premium standards (Stripe/Linear quality) are maintained. Breaking aesthetics is considered a blocker.

### 🎨 1. Typography & Readability
- [ ] **No Hardcoded Sizes/Fonts:** Are you using the designated CSS variables/Tailwind classes for font families and sizes?
- [ ] **Contrast Verification:** Do all text elements pass WCAG AA (or AAA) contrast ratios against their backgrounds?
- [ ] **Data Density:** In tables or lists, is the font size appropriate (usually 13px or 14px) to show enough data without feeling cramped?
- [ ] **Alignment:** Are numerical values in tables right-aligned? Are dates and text left-aligned?

### 📐 2. Layout, Spacing & Rhythm
- [ ] **Token Spacing:** Are you using standard spacing tokens (e.g., `gap-4`, `p-6`) instead of arbitrary margins/padding (`margin-top: 17px`)?
- [ ] **Alignment & Grids:** Do elements align perfectly to the grid? Are flexbox/grid containers behaving correctly across screen sizes?
- [ ] **Whitespace:** Is there intentional breathing room around high-level components to establish visual hierarchy?
- [ ] **Responsive Degradation:** Does the UI gracefully scale down to tablet/mobile without horizontal scrolling (unless in a scrollable table container)?

### 🖌 3. Color, Shadows & Borders
- [ ] **Theme Adherence:** Have you tested the component in both **Light** and **Dark** modes?
- [ ] **No Hardcoded Hex:** Are all colors pulling from the semantic token system (e.g., `bg-background`, `text-primary`) for White Label compatibility?
- [ ] **Subtle Borders:** Are borders 1px and using a subtle low-opacity color (`border-neutral-200/50` or similar)? No thick, dark borders unless it's a specific active state.
- [ ] **Elevation:** Are shadows adhering to the design system? (e.g., `shadow-sm` for cards, `shadow-xl` for dropdowns/modals).

### ⚡ 4. Motion & Interaction
- [ ] **Hover States:** Does every interactive element (button, link, table row) have a distinct, subtle hover state?
- [ ] **Focus Rings:** Do inputs and buttons have a clear, accessible focus ring (e.g., `focus:ring-2 focus:ring-primary-500`) for keyboard navigation?
- [ ] **Transitions:** Are hover/active states utilizing smooth, quick transitions (e.g., `transition-all duration-200 ease-in-out`)? No abrupt state changes.
- [ ] **Loading States:** Are skeleton loaders or spinners implemented for asynchronous actions? No UI "jumping" when data loads.
- [ ] **Empty States:** Is there a beautifully designed empty state if a list or table has no data?

### 🛠 5. White Label Compliance
- [ ] **Logo Usage:** Is the logo pulled from the tenant configuration dynamically?
- [ ] **Brand Colors:** Have you ensured no component assumes a specific brand color, allowing the `--color-brand` token to dictate the primary aesthetic?
