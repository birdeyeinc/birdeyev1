# Settings — business profile (full requirements)

Single reference for **Manage your business profile** (`SettingsBusinessDetailView`) and [`settingsBusinessProfileData.ts`](../src/app/components/settings/settingsBusinessProfileData.ts). Narrative plan + todos: [.cursor/plans/input_white_fill_border_466cbb9c.plan.md](file:///Users/balajikannan/.cursor/plans/input_white_fill_border_466cbb9c.plan.md) (may live under your user `.cursor/plans` folder).

---

## Cross-cutting UX

| Topic | Requirement |
|--------|-------------|
| Section chrome | Title + **Cancel** (link) + **Save** (primary) on one row inside each settings card. |
| Grid | Label column ~**25%**, control ~**75%**; spacing on **8px grid** (`gap-4`, `py-4` between rows — avoid `gap-3` / `p-3` for layout). |
| Typography | Label **bold**; helper **smaller**, `text-muted-foreground`; placeholders light gray. |
| Inputs | White fill, **visible** light border (`theme.css` `--input-background`, `--input`). |
| Copy | Prefer **sentence case** for new product strings; match Birdeye screenshots when parity is required. |
| Icons | Lucide **strokeWidth 1.6** (`absoluteStrokeWidth` when not 24px). |

---

## Field / structure matrix (from reference UI)

### Business information

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Name * | `text` | Required `*`; sub-note + link if in reference. |
| Type | `radio` | Physical location / Provider. |
| Address * | `address` | Country + State `Select`s; street/apt/city/zip grid; 2× checkbox (hide address; service at customer). |
| Map marker * | `mapMarker` | Map embed + fullscreen; **No location found** error state. |
| Main phone number | `text` | Guideline sub-note. |
| Email | `email` | |
| Website | `url` | |
| Category | `category` | Primary * = search combobox (`Command` + `Popover`); Additional = `Input`; **Advanced** link. |
| Business description | `textarea` + counter + AI | Placeholder BirdAI; **0/max** counter; AI affordance bottom-left. |
| Update information on | `checkbox` | Section label + **Your Google Business Profile**. |

### Hours of operation

| Field / block | Control / `kind` | Notes |
|---------------|------------------|--------|
| Time zone | `select` | e.g. `(GMT+05:30) Asia/Calcutta`. |
| Business status | `select` | Open / Closed. |
| Opened on | `date` | Placeholder **Choose date**. |
| Opened-on note | `callout` | Blue info banner (Google “Recently Open” vs others). |
| Regular hours mode | `radio` | **Open 24/7** · **By appointment only** · **Custom**. |
| Weekly schedule | `weeklyHours` | Mon–Sun: **Closed** checkbox; **Start** / **End** `Select`; **+** extra interval; disabled when closed. |
| Special hours | `linkAction` | **+ Add special hours** (+ info on label). |
| Google – More hours | `linkAction` | **+ Add more hours**. |
| Apple – More hours | `linkAction` | **+ Add more hours**. |

### Additional information

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Year established | `text` | Placeholder **Add opening year**. |
| Languages | `text` | **English, Spanish, etc.** |
| Keywords | `textarea` | **0/1000**; comma-separated; note **does not sync** to GBP. |
| Products | `textarea` | **0/1000**; stock / sync note. |
| Services | `textarea` | **0/1000**; discovery / sync note. |
| Payment types | `multiSelect` / combobox | “Select all…”; placeholder **Add the payment methods you accept**. |
| Additional payment types | `text` | |
| Impressum | `textarea` | **0/2000**; legal (AT/DE/CH). |
| **Additional contact information** | `heading` | |
| Local phone number | `tel` | **Enter local phone number**. |
| Tollfree number | `tel` | **Enter toll free number**. |
| **Apps** | `heading` | |
| iOS app URL | `url` | **Enter iOS App URL**. |
| Android app URL | `url` | **Enter Android App URL**. |

### Media gallery

| Block | Control / `kind` | Notes |
|-------|------------------|--------|
| Logo | `mediaLogoSlot` | **All** + info; 1:1 card; **⋯** overflow. |
| Cover photos | `mediaCoverStrip` | Columns **Microsite**, **Google**, **Facebook** + info; dashed primary **Upload photo** tiles. |
| Photo & video albums | `mediaAlbumTabs` | Tabs: Exterior, Interior, At work, Teams, Additional; **Upload photos/videos** zone. |

### Google business listing

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Store id | `text` | |
| Google phone number | `text` | Override main phone for Google. |
| Google override business description | `textarea` | **0/750**; BirdAI; override default description. |
| Update information on | `checkbox` | **Your Google Business Profile**. |
| Google website override link | `url` | |
| Appointment / Reservation / Menu / Order ahead | `url` | Placeholders **Enter … link**; helper sentences. |
| WhatsApp Business link | `url` | Info on label. |
| Text message number | `text` | |
| **Google attributes** | `heading` | |
| ACCESSIBILITY, CROWD, PLACE PAGE ATTRIBUTES, PARKING, RECYCLING, PLANNING, FROM THE BUSINESS, SERVICE OPTIONS, OFFERINGS, AMENITIES | `linkAction` | **+ Add {category}** (uppercase labels per reference). |

### Apple business listing

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Apple business name | `text` | **Enter business name**. |
| Apple phone number | `text` | Helper + **Enter phone number**. |
| Apple website override link | `url` | **Enter Apple override link**. |
| Location attributes | `linkAction` | Info; **+ Add location attribute.** |
| Action link | `linkAction` | Info; **+ Add action link.** |

### Facebook listing

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Facebook override business description | `textarea` | BirdAI pattern; max TBD until screenshot locked (often mirrors other channels). |
| Facebook phone number | `text` | |
| Facebook website override link | `url` | |

### Bing listing

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Bing override business description | `textarea` | **0 / 4,096**; BirdAI; info on label. |
| Bing phone number | `text` | Override copy. |
| Bing website override link | `url` | **Enter Bing override link**. |

### Yelp listing

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Yelp business name | `text` | **Enter business name**. |
| Yelp description | `textarea` | **0/1,000**; help icon; BirdAI. |
| Yelp phone number | `text` | Override copy. |
| Yelp website url | `url` | |

### Microsite listing

| Field | Control / `kind` | Notes |
|-------|-------------------|--------|
| Microsite URL | `readOnlyLink` | Primary `<a>`; not an input. |
| Microsite override business description | `textarea` | **0/5,000**; BirdAI; override copy + info icon. |

### Social profiles (fixed platform list)

| Platform | Control | Placeholder |
|----------|---------|-------------|
| Google, Facebook, X (Twitter), YouTube, LinkedIn, Instagram, Pinterest, BBB, LendingTree | `url` | **Please enter a URL** |

### Custom fields (tenant-defined)

| `kind` | Control | Notes |
|--------|---------|--------|
| Text | `text` | Default **Please enter the value of {label}.** |
| Single select | `select` | **Select option** when empty. |
| Multi select | `multiSelect` | Trigger **{n} selected**. |
| URL | `url` | e.g. **https://** |
| Number | `number` | |
| Long text | `longText` / `textarea` | Tall field for long strings. |

---

## Suggested TypeScript shape (implementation)

```ts
export type ProfileFieldControl =
  | "text" | "textarea" | "url" | "email" | "tel"
  | "readOnlyLink" | "linkAction" | "checkbox" | "select" | "heading";

export interface ProfileField {
  label: string;
  value?: string;
  description?: string;
  placeholder?: string;
  maxLength?: number;
  control?: ProfileFieldControl;
  required?: boolean;
  options?: string[];
  checkboxLabel?: string;
  linkActionLabel?: string;
  subsection?: string;
  showAiHint?: boolean;
}
```

`SettingsBusinessDetailView` should dispatch on `control` (with safe fallbacks), include **`fieldValues` in `useMemo` deps** for active section content so inputs update while typing, and reuse one **section card** pattern (title + Cancel/Save + rows).

---

## Implementation status

| Area | Status |
|------|--------|
| Requirements consolidated | **This doc** + merged `.cursor/plans` narrative. |
| Code parity (phase 1) | **`ProfileField`** extended with `control`, `description`, `placeholder`, `maxLength`, `subsection`, etc.; mock data expanded (Google/Apple/Bing/Yelp/Microsite, additional info, custom fields); **`SettingsBusinessDetailView`** uses two-column rows, per-section **Cancel** / **Save**, textareas with counters + BirdAI affordance, **checkbox**, **select**, **readOnlyLink**, **linkAction**, social URL placeholder, hours info **Alert**, **`fieldValues` in `useMemo` deps**. |
| Still planned | Full **weeklyHours** UI, **media** upload tiles, **mapMarker** component, **CommandInput** combobox shell, **theme** token pass, payment **multiSelect**, custom-field **multiSelect**. |

---

## Key files

| File | Role |
|------|------|
| [SettingsBusinessDetailView.tsx](../src/app/components/settings/SettingsBusinessDetailView.tsx) | Section nav + form body. |
| [settingsBusinessProfileData.ts](../src/app/components/settings/settingsBusinessProfileData.ts) | Mock profile + future typed fields. |
| [SettingsBusinessDetailView.stories.tsx](../src/stories/App/Settings/SettingsBusinessDetailView.stories.tsx) | Storybook. |
| [theme.css](../src/styles/theme.css) | Input fill + border tokens. |
| [command.v1.tsx](../src/app/components/ui/command.v1.tsx) | Category combobox search shell. |
