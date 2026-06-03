# E-Invoicing (UAE)

Frontend prototype for the UAE FTA e-invoicing flow. Backed by a mock BFF
adapter today; production wiring should swap the mock implementations for
real `ApiClient` calls without touching pages or components.

## Folder layout

```
EInvoicing/
├── api/index.ts            Mock BFF adapter — REPLACE with ApiClient calls
├── components/             Shared UI: shell, status pill, modals, tile
├── forms/InvoiceForm.tsx   Sales / credit / purchase invoice form (mode-driven)
├── hooks/                  useEInvoicingStatus → SMB status + live metrics
├── mocks/seed.ts           Realistic mock fixtures matching the Marmin schema
├── pages/                  16 pages — one per spec section §3.1–§3.16
├── slices/eInvoicingSlice  Redux slice (status, eligibility, onboarding draft)
├── types/index.ts          Domain types (BusinessProfile, Document, etc.)
└── utils/                  marminErrorMap, statusMap, currency helpers
```

## Routing

All routes live under `/einvoicing` and are registered in
`src/routes/sections/einvoicing.tsx` (referenced from `dashboard.tsx`).
The `paths.einvoicing.*` constants are the single source of truth.

The dashboard tile (`components/EInvoicingTile.tsx`) reads SMB status from
the slice and routes to:

- `INACTIVE` → `/einvoicing/activate`
- `PENDING`  → `/einvoicing/onboarding`
- `ACTIVE`   → `/einvoicing` (overview)

## Mock data → real BFF

Every API call goes through `api/index.ts` (`eInvoicingApi`). To wire real
endpoints, replace each function body with an `ApiClient` call. The function
signatures and return shapes are stable and should not change at the call site.

The BFF is expected to proxy Marmin (`docs.ae.marmin.ai/docs/2026-01-01`).
Suggested endpoints (today mocked):

| Frontend call                         | BFF endpoint (suggested)                       | Marmin underneath |
|---------------------------------------|------------------------------------------------|-------------------|
| `eInvoicingApi.provision()`           | `POST /api/peko/einvoicing/provision`          | `POST /partner/accounts` → `/api-credentials` → `/business-profiles` → `/branches` → `/webhooks` |
| `eInvoicingApi.submitInvoice()`       | `POST /api/peko/einvoicing/sales-invoices`     | `POST /documents` (380/381/389/261) |
| `eInvoicingApi.sendInvoice()`         | `POST /api/peko/einvoicing/sales-invoices/:id/send` | (Peko email service) |
| `eInvoicingApi.submitBulk()`          | `POST /api/peko/einvoicing/bulk`               | per-row `POST /documents` (BFF fan-out) |
| `eInvoicingApi.pollBulk()`            | `GET /api/peko/einvoicing/bulk/:id/status`     | aggregated row status |
| `eInvoicingApi.exportArchive()`       | `POST /api/peko/einvoicing/archive/export`     | (Peko archive service) |

## Demo controls

The create-invoice form has a "simulate clearance result" radio group that
forces the next clearance round to PASS / WARNING / ERROR / PENDING — useful
for screen recordings of all four states without hand-crafted payloads.

## Definition-of-done checklist (spec §7)

- [x] Dashboard tile replaces the `Create Invoice` placeholder with dynamic state
- [x] All 16 screens navigable using only Peko's existing components (antd + Tailwind)
- [x] Form validations fire (TRN regex, IBAN, required fields, etc.)
- [x] All four clearance states demoable from the form's dev-mode toggle
- [x] Bulk upload flow works end-to-end (CSV parse → mapping → preview → polling)
- [x] Mobile responsive layout (Ant Design `Row`/`Col` with xs/md/lg/xl breakpoints)
- [x] No new dependencies in `package.json`
- [x] README documenting mock structure and BFF swap-in points
