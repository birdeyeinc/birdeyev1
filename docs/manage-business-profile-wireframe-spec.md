# Manage Your Business Profile - Wireframe Spec

## Page Shell

- Title row
  - Left: `Manage your business profile`
  - Right: `Actions` button + optional `Learn more` link
- Readiness banner/card
  - Copy: "Update X fields to publish your listings for this location"
  - Secondary action: `View details`
- Content container
  - Single-column stack of section cards
  - Max width: `1200px`
  - Horizontal page padding: `32px`
  - Vertical spacing between section cards: `24px`

## Spacing Rhythm (8px Grid)

- Global
  - Section-to-section: `24px`
  - Card padding: `24px`
  - Subsection gap inside card: `16px`
- Field rows
  - Label to input: `8px`
  - Input to helper/error text: `4px`
  - Row-to-row in forms: `16px`
- Dense metadata
  - Badge/icon gaps: `4px`
  - Inline status chip spacing: `8px`

## Section Blueprint (Repeatable Card Pattern)

Each section uses the same frame:

- Card header
  - Section title (left)
  - Optional status chip (for example: `Incomplete`, `Synced`)
  - Optional tertiary action (for example: `Learn more`)
- Card body
  - Fields in 2-column responsive grid (desktop)
  - Collapse to 1-column on narrow widths
- Card footer
  - `Save section` primary button
  - `Discard` text button (only when dirty)

## Component Types by Section

## A. Business information

- Inputs
  - `Name` -> text input
  - `Type` -> select
  - `Address` -> address input + map preview panel
  - `Phone number`, `Texting number`, `Email`, `Website` -> text/URL inputs
  - `Category` -> searchable select
  - `Business description` -> textarea
- Special
  - `Enable texting for your account` -> switch/toggle with helper text
  - `Linked entities / Provider details` -> multi-select launcher + modal

## B. Hours of operation

- Inputs
  - `Time zone` -> select
  - `Business status` -> segmented control or select
  - `Opened On` -> date picker
- Regular hours
  - 7-day repeatable rows (day + open/close times + closed checkbox)
- Special hours
  - Repeater list (`date`, `open`, `close`, `closed`)
- Channel extras
  - `Google - More hours`, `Apple - More hours` -> optional expandable groups

## C. Additional information

- Optional metadata fields
  - text, multi-select, chips input for `Languages`, `Services`, `Keywords`, `Products`, etc.
  - URL inputs for app links
- Grouped subheadings
  - `Additional contact information`
  - `Apps`

## D. Media gallery

- Uploader blocks
  - `Logo` uploader card with constraints
  - `Cover photos` tabs: Microsite / Google / Facebook
  - `Photo & video albums` multi-upload
- Required microcopy near uploaders
  - format, min/max file size, dimensions, aspect ratio
- Preview state
  - thumbnail + replace/remove actions
- Sync indicator
  - static info chip: "Synced to your Google and Facebook profiles"

## E. Listing override sections (Google/Apple/Facebook/Bing/Yelp/Microsite)

- Use same subsection template
  - Header: `<Channel> listing`
  - Body: channel-specific override fields (text, URL, textarea, select)
- Keep collapsed by default except one active section to reduce scan load

## F. Social profiles

- Repeated rows
  - platform label + URL input + status (`Connected` / `Click to add`)
- Platforms
  - Google, Facebook, X, YouTube, LinkedIn, Instagram, Pinterest, BBB, LendingTree

## G. Custom fields

- Dynamic renderer
  - support text, number, URL, single-select, multi-select
- List model
  - label + current value + inline edit affordance
- Utility link
  - `Click here to view/manage all your fields`

## Interaction Patterns

- Edit mode
  - Any changed input marks section as dirty
  - Sticky "unsaved changes" bar at section/footer level
- Save model
  - Per-section save preferred
  - Global unsaved warning on route change
- Inline empty state
  - Show placeholder action: `Click to add`
- Validation
  - On blur for simple fields
  - On save for section-level checks
  - URL format checks + field-specific constraints
- Async feedback
  - Saving: inline spinner in section footer
  - Success: toast + status chip update
  - Error: inline error summary at top of section

## Essential States to Wireframe

- Default loaded (mixed filled + empty fields)
- Dirty section (with Save/Discard active)
- Validation error state (text, URL, upload failures)
- Upload in progress / uploaded / rejected file
- Collapsed vs expanded listing override sections
- Provider linking modal opened
- Publishing readiness banner (`X fields remaining`)

## Responsive Behavior

- Desktop (>=1200)
  - 2-column field layout
  - map preview and key business fields can sit side-by-side
- Tablet (768-1199)
  - mostly 1-column, keep compact paired fields where possible
- Mobile (<768)
  - 1-column only
  - collapsible sections default closed except current

## Suggested Information Architecture Order

1. Business information
2. Hours of operation
3. Additional information
4. Media gallery
5. Channel listing overrides (Google -> Apple -> Facebook -> Bing -> Yelp -> Microsite)
6. Social profiles
7. Custom fields
