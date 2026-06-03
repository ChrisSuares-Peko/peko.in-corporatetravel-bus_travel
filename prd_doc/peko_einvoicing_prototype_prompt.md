# Peko E-Invoicing — Frontend Prototype Build Spec

**For:** Cursor / Claude Code build session
**Audience:** Engineering handoff
**Backend assumption:** Marmin UAE E-Invoicing API (`docs.ae.marmin.ai/docs/2026-01-01`) is the ASP. All Marmin calls are proxied through Peko's BFF — the frontend never talks to Marmin directly. Mock the BFF responses with realistic payloads matching Marmin's schema.

---

## 0. Critical setup instructions (read first)

**Use Peko's existing tech stack and codebase structure. Do NOT introduce new frameworks, libraries, or styling systems.**

Before writing any code:
1. Inspect the existing Peko repo structure — folder conventions, routing patterns, state management, API client setup, auth handling, i18n setup.
2. Use Peko's **internal component library** for every UI element (buttons, inputs, modals, tables, status indicators, toasts, etc.). Do NOT install shadcn/ui, MUI, Ant Design, or any other component library.
3. Match existing patterns for: form handling, validation, error states, loading states, i18n, mocking.
4. Reuse existing TypeScript types, utility functions, and hooks where applicable. Build new components only when nothing comparable exists.
5. Follow the same file/folder naming conventions already in the repo.

**If unclear about any existing convention, ask before guessing.**

---

## 1. Entry point — Dashboard tile

The E-Invoicing flow is launched from the **Peko Dashboard → Quick Actions section**.

**Action required:**
- Locate the existing Quick Actions component on the dashboard.
- Replace the existing placeholder tile with the E-Invoicing tile.
- Use the same tile component/styling as other Quick Actions tiles — do NOT create a new tile design.

**Tile content:**
- Icon: invoice/document icon from Peko's existing icon set
- Title: `E-Invoicing`
- Subtitle (dynamic based on SMB state):
  - Not activated: `"Activate now — UAE mandate from 2027"`
  - Activated, healthy: `"X cleared this month"` (live count)
  - Has rejections: `"X invoices need attention"` (red indicator)

**Tile click behaviour:**
- If `einvoicing_status = INACTIVE` → route to `/einvoicing/activate`
- If `einvoicing_status = PENDING` → route to `/einvoicing/onboarding` (resume where left off)
- If `einvoicing_status = ACTIVE` → route to `/einvoicing` (overview page)

---

## 2. Routing & app structure

Add an `/einvoicing` route tree under the existing app routing structure. Follow whatever routing pattern Peko already uses (file-based, react-router config, etc.).

Routes to create:
```
/einvoicing/activate                       → §3.1
/einvoicing/eligibility                    → §3.2
/einvoicing/onboarding                     → §3.3
/einvoicing                                → §3.4 (overview)
/einvoicing/sales-invoices                 → §3.11 (list)
/einvoicing/sales-invoices/new             → §3.5
/einvoicing/sales-invoices/:id             → §3.12 (detail)
/einvoicing/credit-notes                   → §3.11 (list)
/einvoicing/credit-notes/new               → §3.7
/einvoicing/purchase-invoices              → §3.11 (list)
/einvoicing/purchase-invoices/new          → §3.8
/einvoicing/purchase-credit-notes          → §3.11 (list)
/einvoicing/purchase-credit-notes/new      → §3.9
/einvoicing/bulk-upload                    → §3.10
/einvoicing/archive                        → §3.13
/einvoicing/settings/profile               → §3.14
/einvoicing/settings/api                   → §3.15 (feature-flagged)
/einvoicing/settings/branches              → §3.16
```

**Section sidebar (within /einvoicing):** Use Peko's existing sidebar/sub-nav component pattern. Do not invent a new navigation pattern.

**Global states to handle in section shell:**
- E-Invoicing not activated → activation wall
- Activated but profile pending → use Peko's existing banner component, show "setup in progress"
- Active and healthy → normal nav
- Marmin service degraded → use Peko's existing banner/toast for "FTA processing is slower than usual"

---

## 3. Screen-by-screen build spec

Each screen below specifies: **purpose**, **fields with validation**, **states**, **API contract**, **edge cases**.

### 3.1 Activation wall (`/einvoicing/activate`)

**Purpose:** First-time landing when SMB clicks the E-Invoicing tile.

**Layout:** Use existing Peko page layout. Three-step horizontal explainer, single primary CTA at bottom.

**Content blocks:**
1. "What is UAE E-Invoicing?" — 2 sentences, neutral tone.
2. "What Peko handles" — list: digital signing, FTA submission, archive, status tracking.
3. "What you need" — TRN, business details, customer TRN per invoice.

**CTA:** `Activate E-Invoicing` (primary button from existing component lib) | `Learn more` (secondary, opens external doc)

**No API calls on this screen.**

---

### 3.2 Eligibility gate (`/einvoicing/eligibility`)

**Purpose:** Filter out SMBs who aren't ready (no TRN).

**Form fields (use Peko's form components):**

| Field | Type | Validation | Required |
|---|---|---|---|
| `is_vat_registered` | radio: Yes / No | — | Yes |
| `has_trn` | radio: Yes / No | — | Yes |
| `issues_b2b_invoices` | radio: Yes / Mostly B2C / Both | — | Yes |

**Branching:**
- All "Yes/Yes/Yes or Both" → continue to onboarding
- `has_trn = No` → show deflection card (existing card component): "You need a TRN first. [Open EmaraTax →] [Notify me when ready]"
- `is_vat_registered = No` → show info card "You may still need to register for e-invoicing. We'll help you get a TIN." Continue to onboarding with `non_vat` flag.

**CTA:** `Continue` (disabled until all 3 answered)

**State to persist:** `eligibility_passed`, `non_vat_flag`, `notify_when_ready` toggle.

---

### 3.3 Onboarding wizard (`/einvoicing/onboarding`)

**Purpose:** Capture everything Marmin needs to provision the org + business profile in one flow.

**Use Peko's existing wizard / multi-step form pattern.** If none exists, build a minimal stepper using existing components.

#### Step 1 — Business details

| Field | Type | Maps to Marmin field | Validation |
|---|---|---|---|
| `legal_name_en` | text | `businessProfile.legalName.en` | Required, max 200 |
| `legal_name_ar` | text (RTL) | `businessProfile.legalName.ar` | Required, max 200, Arabic chars |
| `trade_license_number` | text | `businessProfile.tradeLicense` | Required |
| `trn` | text | `businessProfile.trn` | Required, exactly 15 digits, regex `^\d{15}$` |
| `business_activity_code` | select | `businessProfile.activityCode` | Required, from Code Lists |
| `vat_registration_status` | select: Standard / Zero / Exempt / Mixed | `businessProfile.vatStatus` | Required |

**Pre-fill** from existing Peko SMB profile where available (read-only with "Edit" toggle).

**Inline validation** on TRN: 15 digits or block submit. Don't validate against FTA on this step — too slow.

#### Step 2 — Address

| Field | Type | Maps to | Validation |
|---|---|---|---|
| `building_number` | text | `address.buildingNumber` | Required |
| `street_en` / `street_ar` | text | `address.street` | Required |
| `district` | text | `address.district` | Required |
| `city` | text | `address.city` | Required |
| `emirate` | select (7 emirates) | `address.emirate` | Required |
| `postal_code` | text | `address.postalCode` | Optional, numeric |
| `country` | locked = `AE` | `address.country` | — |

#### Step 3 — Branches (skippable for solo entities)

Toggle: "I have multiple branches" → reveal list editor.

Per branch:
- `branch_name`, `branch_code` (must be unique within org), `address` (full address subform), `invoice_number_prefix` (e.g., `INV-DXB-`).

**Don't submit branches yet** — collect and submit after profile creation succeeds.

#### Step 4 — Invoice defaults

| Field | Type | Default |
|---|---|---|
| `default_currency` | select | AED |
| `default_tax_rate` | select | 5% |
| `invoice_number_format` | text with placeholder | `INV-{YYYY}-{SEQ}` |
| `logo_upload` | file (PNG/JPG, max 1MB) | — |
| `bank_account_holder` | text | — |
| `bank_iban` | text, IBAN format | Optional |
| `bank_swift` | text | Optional |

#### Step 5 — Review & confirm

Single read-only page summarising all entered data. Two checkboxes:
- "I confirm these details are accurate and match my FTA registration"
- "I authorise Peko to submit invoices to FTA on my behalf via Marmin"

**CTA:** `Activate E-Invoicing` — disabled until both checked.

#### On submit — orchestrated backend calls (mock these in sequence with realistic delays)

```
POST /api/peko/einvoicing/provision
Body: { all collected fields }
→ BFF internally calls (mock the sequence):
    a) Marmin POST /partner/accounts                              (300ms)
    b) Marmin POST /partner/accounts/{org_id}/api-credentials     (200ms)
    c) Marmin POST /business-profiles                             (500ms)
    d) Marmin POST /business-profiles/{id}/branches (per branch)  (200ms each)
    e) Marmin POST /webhooks                                      (200ms)
→ Returns: { status: "ACTIVE" | "PENDING" | "FAILED", smb_einvoicing_id, business_profile_id }
```

**UI during submit:** modal/full-screen state machine with 5 ticking steps (use existing progress component):
- ✓ Creating your e-invoicing account
- ✓ Generating secure credentials
- ✓ Setting up business profile
- ✓ Configuring branches
- ✓ Connecting status updates

Each step animates checkmark on completion. Total 1.5–2s happy path.

**Failure states (use existing error/empty state components):**
- TRN rejected by FTA → "Your TRN couldn't be verified. Please check it matches EmaraTax exactly." [Retry] [Contact support]
- Marmin 5xx → "We're having trouble setting up. We've notified our team. [Try again in a few minutes]"
- Partial success → "Your account is being finalised. We'll email you within an hour."

---

### 3.4 E-Invoicing overview (`/einvoicing`)

**Purpose:** Daily landing page for active SMB. Health + recent activity at a glance.

**Top metric strip (4 cards — use existing metric/stat card component):**
- Cleared this month — count + AED total
- Pending clearance — count (clickable to filtered list)
- With warnings — count
- Rejected — count (red badge if >0)

**Recent activity table (last 10) — use existing data table component:**

| Column | Source field |
|---|---|
| Invoice # | Peko invoice number |
| Customer | `customer.name` |
| Amount | `total.amount` + currency |
| Issued | `issuedDate` |
| Status | Mapped from `meta_info.zatca_response.status` (PASS/WARNING/ERROR) |
| Action | View / Send / Download |

**Status pills (build as a reusable component if not already present):**
- 🟢 Cleared (PASS)
- 🟡 Cleared with warnings (WARNING)
- 🔴 Rejected (ERROR) — with "Fix" button
- 🔵 Submitting (PENDING)
- ⚪ Draft

If Peko's component lib has a Badge/Pill/Tag component, use that and just configure variants. Don't reinvent.

**Quick actions row:** `+ New Invoice` · `+ Credit Note` · `Bulk Upload` (use existing button group pattern).

---

### 3.5 Create sales invoice (`/einvoicing/sales-invoices/new`)

**Purpose:** The core flow. Must be fast.

**Layout:** Single page using existing form layout patterns. Three sections.

#### Section A — Customer

**Top toggle:** `B2B (registered)` | `B2C / Unregistered`

**B2B fields (all required unless noted):**

| Field | Maps to Marmin field | Validation |
|---|---|---|
| Customer search | autocomplete from past invoices (use existing autocomplete) | — |
| `customer.name_en` | `customer.partyName.en` | Required |
| `customer.name_ar` | `customer.partyName.ar` | Optional but recommended |
| `customer.trn` | `customer.trn` | 15 digits if entered |
| `customer.email` | `customer.email` | Email format |
| `customer.country` | `customer.address.country` | ISO code, default AE |
| `customer.address` | `customer.address.*` (building, street, city, emirate) | Required for AE customers |

**B2C mode:** hide TRN field, mark `customer.type = "individual"`.

**Cross-border flag:** if `country != AE`, surface warning (use existing alert component) "This is an export invoice — different VAT rules apply. We'll mark it as zero-rated unless you change it."

#### Section B — Line items

Repeatable rows (use existing repeatable form row pattern). Add row button at bottom.

| Field | Maps to | Validation |
|---|---|---|
| `description` | `lineItems[].description` | Required, max 500 |
| `quantity` | `lineItems[].quantity` | Required, positive number, 3 decimals |
| `unit` | `lineItems[].unitCode` | Select from Code Lists (PCE, KGM, LTR, etc.) |
| `unit_price` | `lineItems[].unitPrice` | Required, 2 decimals |
| `tax_rate` | `lineItems[].taxRate` | Select: 5% / 0% / Exempt / Out-of-scope |
| `tax_category_reason` | `lineItems[].taxExemptionReason` | Required if rate ≠ 5% |
| `discount` | `lineItems[].discount` | Optional, % or absolute |

**Auto-calc per row:** `line_total = (qty × unit_price) − discount`, `tax = line_total × tax_rate`.

**Catalogue autocomplete:** typing in description should suggest from SMB's saved items (mock for prototype).

#### Section C — Totals & metadata

Auto-calculated, read-only:
- Subtotal, Total tax, Grand total

Editable metadata:

| Field | Maps to | Default |
|---|---|---|
| `invoice_number` | `documentNumber` | auto from sequence |
| `issue_date` | `issuedDate` | today |
| `supply_date` | `actualDeliveryDate` | today |
| `due_date` | `paymentDueDate` | today + 30 |
| `payment_terms` | `paymentTerms` | "Net 30" |
| `notes` | `note` | optional, max 1000 |
| `currency` | `currency` | AED |
| `branch` | `businessProfile.branchId` | default branch |
| `reference_po` | `buyerReference` | optional |

#### Sticky footer

`Save as Draft` (secondary) | `Issue Invoice` (primary). Use existing sticky footer pattern if available.

#### On `Issue Invoice` — full clearance flow

**API call (mocked):**
```
POST /api/peko/einvoicing/sales-invoices
Headers:
  Authorization: Bearer {peko_session_token}
  X-Business-Profile-Id: {smb.business_profile_id}
Body: {
  documentTypeCode: "380",
  documentNumber: "INV-2026-00042",
  issuedDate: "2026-04-29",
  customer: { ... },
  lineItems: [ ... ],
  totals: { ... }
}
```

**Mock response shape (matches Marmin):**
```json
{
  "documentId": "doc_abc123",
  "ftaUuid": "uuid-xxx-xxx",
  "qrCode": "base64string",
  "status": "PENDING_CLEARANCE",
  "meta_info": {
    "zatca_response": {
      "status": "PASS" | "WARNING" | "ERROR",
      "messages": []
    }
  },
  "downloads": {
    "pdf": "https://...",
    "ublXml": "https://..."
  }
}
```

#### Clearance UI state machine (in-page modal — use existing modal component)

Animated 4-step progress:
1. ✓ Validating (200ms)
2. ✓ Generating UBL XML (400ms)
3. ✓ Submitting to FTA (1200ms — variable)
4. State: PASS / WARNING / ERROR / PENDING

**PASS state:** large green check, FTA reference number, QR code preview, three buttons:
- `Send to customer` → opens email modal (§3.6)
- `Download PDF`
- `Download UBL XML`

**WARNING state:** yellow check, "Cleared with notes" + collapsible list of warnings (mapped to plain English from dictionary). Same 3 action buttons + "Acknowledge".

**ERROR state:** red X, "Couldn't issue this invoice". Show:
- Plain-English reason (e.g., "The customer's TRN couldn't be verified by FTA")
- Specific field highlight (link back to the field in form)
- Two buttons: `Edit invoice` · `Contact support`
- Invoice held as `REJECTED` status, not sent.

**PENDING state (async):** "Submitted to FTA. We'll notify you when it's cleared (usually under a minute)." User can navigate away — toast notification on completion via polling fallback every 10s. Use Peko's existing toast component.

---

### 3.6 Send invoice modal

**Purpose:** Post-clearance delivery to customer. Use existing modal + form components.

**Fields:**
- `to` — pre-filled from `customer.email`, editable, supports multiple
- `cc` — optional
- `subject` — pre-filled "Invoice INV-XXXX from {SMB name}"
- `message` — pre-filled template, editable
- Attachments shown as chips (use existing chip/tag component): `Invoice.pdf` · `Invoice.xml` (XML toggle off by default)

**CTA:** `Send` · `Cancel`

---

### 3.7 Sales credit note (`/einvoicing/credit-notes/new`)

**Purpose:** Reverse a previously cleared invoice.

**Required pre-step:** must start from existing cleared invoice. Two entry points:
- From invoice detail page → `Issue Credit Note` button
- From this URL → invoice picker first (use existing picker/search modal pattern)

**Form (pre-filled from original invoice, editable):**

| Field | Maps to | Notes |
|---|---|---|
| `original_invoice_ref` | `referencedDocument.documentId` | Read-only |
| `original_invoice_uuid` | `referencedDocument.uuid` | Read-only |
| `reason_code` | `creditNoteReason` | Select from FTA reason codes |
| `reason_text` | `creditNoteReasonText` | Required, max 500 |
| Line items | as per §3.5 | Pre-filled with reverse amounts; editable for partial credits |

**Document type code:** `381`. **Same clearance state machine as invoice.**

---

### 3.8 Purchase invoice (self-billed) (`/einvoicing/purchase-invoices/new`)

**Purpose:** SMB issues a self-billed invoice on behalf of a supplier.

**Key UX difference:** the SMB is the *buyer*, the other party is the *supplier*.

**Sections mirror sales invoice but field labels flip:**
- Section A becomes **Supplier** (with `supplier.trn`, `supplier.name`, `supplier.address`)
- Add a prominent banner (existing alert component): "This is a self-billed invoice — you're issuing it on behalf of your supplier. They must have agreed to this in writing."
- Add a checkbox: "I confirm I have a self-billing agreement with this supplier."

**Document type code:** `389`. Same flow as sales invoice otherwise.

---

### 3.9 Purchase credit note (`/einvoicing/purchase-credit-notes/new`)

Same as §3.7 but for purchase invoices. Document type `261`.

---

### 3.10 Bulk upload (`/einvoicing/bulk-upload`)

**Purpose:** Upload 50–500 invoices via CSV.

**Use existing wizard pattern.** Page steps:

#### Step 1 — Choose template
Three cards (existing card component): Sales Invoice · Sales Credit Note · Purchase Invoice. Each has `Download CSV template` link.

#### Step 2 — Upload
Drag-drop file zone (use existing file upload component) or click to browse. Accepts `.csv`, max 10MB or 5000 rows.

#### Step 3 — Map columns
Auto-detected mapping table; user confirms or remaps. Required columns flagged red if missing.

#### Step 4 — Preview & validate
Render first 20 rows in existing data table. Inline validation errors (e.g., "Row 7: TRN must be 15 digits"). Counter at top: "467 valid · 12 errors · 21 warnings".

Two buttons: `Fix errors first` (download errors as CSV) · `Submit valid rows`.

#### Step 5 — Processing
Progress bar (existing progress component) with live counters:
- Submitted: X / total
- Cleared: Y
- Warnings: Z
- Failed: W

**API contract:**
```
POST /api/peko/einvoicing/bulk
Body: { template_type, rows: [...] }
→ Returns batch_id

GET /api/peko/einvoicing/bulk/{batch_id}/status (poll every 2s)
→ Returns per-row status array
```

Each row submits independently to Marmin (parallel with rate-limit awareness — handled by BFF). Failed rows do not block others.

#### Step 6 — Results summary
Same counters, plus:
- Download successful invoices (ZIP of PDFs)
- Download error report (CSV with reason per failed row)
- Retry failed (only those with retryable errors)

---

### 3.11 Document list pages (Sales / Credit Notes / Purchase / Purchase CN)

All four list pages share the same component (build once, parameterize).

**Use existing data table component** with filters bar.

**Filters bar:**
- Date range (existing date range picker)
- Status (multi-select from existing component): Draft / Pending / Cleared / Warning / Rejected
- Customer (or supplier)
- Branch
- Amount range
- Search by document number

**Table columns:** `# | Customer | Issue Date | Amount | Status | FTA Ref | Actions`

**Actions per row:** View · Download PDF · Download XML · Send (if cleared) · Issue credit note (if cleared) · Delete (if draft only)

**Bulk actions (existing bulk-action toolbar pattern):** Export selected · Download as ZIP

---

### 3.12 Document detail page (`/einvoicing/sales-invoices/{id}`)

**Layout:** Two columns using existing detail page layout.

**Left column (60%):** PDF preview embedded (use Peko's existing PDF viewer if available; otherwise mock with iframe + static PDF).

**Right column (40%):**

#### Header
- Document number, status pill, customer name, total
- Action buttons: `Download PDF` · `Download XML` · `Send` · `Issue credit note` · `Print`

#### Timeline (use existing timeline component)
- Created — `2026-04-29 10:23`
- Submitted to FTA — `2026-04-29 10:23`
- Cleared by FTA — `2026-04-29 10:23` (with reference)
- Sent to customer — `2026-04-29 10:25`

#### Compliance details (collapsible)
- FTA UUID, Document hash, QR code (rendered), ICV, PIH, UBL XML version

#### Warnings/errors (if any)
Plain-English list with link to fix in next invoice.

#### Audit log (collapsible)
- Who created, who issued, who sent, who downloaded — with timestamps.

---

### 3.13 Archive (`/einvoicing/archive`)

**Purpose:** Long-term retrieval (5+ year compliance).

**Filters:** Year, Quarter, Document type, Customer.

**Table:** Same columns as document list + a "Compliance pack" column.

**Top-right action:** `Export audit pack` → modal:
- Date range picker
- Document types (multi-select)
- Format: ZIP (PDFs + XMLs + manifest.csv)
- Email when ready / Download directly

---

### 3.14 Settings → Business profile (`/einvoicing/settings/profile`)

Read-only by default with `Edit` button. Same fields as onboarding §3.3 Step 1–4.

**Locked fields (cannot edit, require Ops):** `trn`, `legal_name_en`, `business_activity_code`.

**Editable:** address, branches, invoice defaults, logo, bank.

**On save:** call `PATCH /api/peko/einvoicing/business-profile` → BFF calls Marmin `PATCH /business-profiles/{id}`.

---

### 3.15 Settings → API & webhooks (`/einvoicing/settings/api`) [feature-flagged]

For mid-market customers wanting to push invoices via Peko's own public API. Visible only on higher plans.

**Sections:**
- API key generation (show once, with copy button + "Save this — you won't see it again")
- Webhook URL configuration
- Recent API call log (last 100, with status codes)
- Documentation link

---

### 3.16 Settings → Branches (`/einvoicing/settings/branches`)

CRUD list of branches using existing CRUD list pattern. Same fields as onboarding §3.3 Step 3.

**Important:** disabling a branch must check for in-flight invoices first; show warning if any pending.

---

## 4. Cross-cutting concerns

### 4.1 Error message dictionary

Build `marminErrorMap.ts` in the existing utils/constants folder structure. Map Marmin error codes to plain English (and Arabic):

```ts
export const MARMIN_ERROR_MAP: Record<string, { en: string; ar: string; field?: string; severity: 'error' | 'warning' }> = {
  'BR-AE-01': {
    en: "Customer's TRN couldn't be verified by FTA. Please confirm with your customer.",
    ar: "...",
    field: 'customer.trn',
    severity: 'error'
  },
  // fallback: generic message + telemetry log
};
```

### 4.2 Reusable components to add (only if not already in component lib)

- `<StatusPill status={...} />` — variants: DRAFT | PENDING | PASS | WARNING | ERROR | CANCELLED
- `<TrnInput />` — formats input as user types, 15 digit validation, optional async FTA verification

**Rule:** before building any of the above, check the component library. If a similar component exists, extend it via props/variants instead of creating new. Use existing currency input, date picker, file upload, etc. — do NOT create duplicates.

### 4.3 Bilingual support

Use Peko's existing i18n setup and translation key structure. RTL must work on every screen — test at every step.

### 4.4 Loading, empty, error states

Use Peko's existing skeleton, empty state, and error state components for every screen. Do NOT build one-off versions.

### 4.5 Notifications

Use Peko's existing toast/notification system for: invoice cleared (async), invoice rejected (async), bulk job complete, profile updated. If Peko has an in-app inbox, route persistent items there.

### 4.6 Webhook-driven UI updates

Mock the realtime channel using Peko's existing pattern (WebSocket, SSE, or polling — whatever the app already uses). Don't introduce a new realtime mechanism.

---

## 5. Mock data

Build a `/mocks` folder at the same level as existing mocks (or extend existing mock structure):
- `business-profile.json`
- `branches.json`
- `customers.json` (15 sample customers, mix of B2B/B2C, AE/foreign)
- `invoices-cleared.json` (30 samples over 6 months)
- `invoices-pending.json` (3 samples)
- `invoices-rejected.json` (5 samples with various error codes)
- `invoices-warnings.json` (4 samples)
- `credit-notes.json` (8 samples)
- `purchase-invoices.json` (10 samples)
- `bulk-batch-success.json`
- `marmin-error-codes.json` (full dictionary)

Wire mocks through Peko's existing API client mocking layer (MSW, axios interceptor, etc. — whatever the app already uses).

---

## 6. Out of scope

Explicitly do NOT:
- Modify Peko's existing dashboard beyond replacing the placeholder tile
- Introduce new dependencies, libraries, or styling systems
- Build real authentication (assume Peko's existing auth context is available)
- Build real Marmin API integration (all mocked through BFF)
- Build real PDF generation (use static sample PDFs)
- Build customer-side viewing (recipient sees PDF in email only)

---

## 7. Definition of done

- [ ] Dashboard placeholder tile replaced with E-Invoicing tile, with dynamic state
- [ ] All 16 screens navigable and visually complete using Peko's component library only
- [ ] Form validations fire correctly (test with deliberately bad input)
- [ ] All four clearance states (PASS/WARNING/ERROR/PENDING) demoable from a dev-mode toggle
- [ ] Bulk upload flow works end-to-end with mocked progress
- [ ] EN/AR toggle works on every screen with proper RTL
- [ ] Mobile responsive at 375px, 768px, 1280px
- [ ] No new dependencies added to package.json
- [ ] Screen recordings of three flows: (1) tile click → onboarding, (2) issue invoice happy path, (3) bulk upload with partial failures
- [ ] README in the new feature folder documenting mock structure and how to swap in real BFF endpoints

---

## 8. Build order

1. Replace dashboard tile + wire route logic based on `einvoicing_status`
2. Activation wall + eligibility gate
3. Onboarding wizard (highest UX risk — get review early)
4. Sales invoice creation + clearance flow (the core demo)
5. Document detail page
6. Document list pages (parameterized for all 4 doc types)
7. Credit notes (reuses invoice flow)
8. Purchase invoices + purchase credit notes (reuse)
9. Bulk upload
10. Archive + audit pack
11. Settings sections (profile, branches, API)
12. Polish: empty states, error dictionary completion, RTL pass, skeleton loaders

---

## 9. Cursor / Claude Code starter prompt

Paste this verbatim into Cursor when starting:

> Read `peko_einvoicing_prototype_prompt.md` in the repo root.
>
> Before writing any code:
> 1. Inspect the existing repo structure. Identify the framework, component library location, routing pattern, state management, API client, mocking setup, i18n setup, and folder conventions.
> 2. Locate the dashboard's Quick Actions component and identify the placeholder tile to replace.
> 3. Locate the internal component library and list available components (Button, Input, Modal, Table, etc.). Use ONLY these components — do NOT install or import shadcn/ui, MUI, Ant Design, or anything similar.
>
> Then build feature §1 (the dashboard tile + routing logic) first. Show me the changes for review before moving to §3.1.
>
> For every subsequent screen, follow the spec exactly: same fields, same validations, same API contracts, same states. Use only Peko's existing components and patterns. If something is unclear or seems to require a new dependency, stop and ask.

---

*End of build spec.*
