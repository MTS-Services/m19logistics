# Admin — Driver Type (Employee / Contractor) Changes

## Summary

Admin can now add/edit a Driver as **Employee** or **Contractor**.

- **Employee** → same as before (no extra fields)
- **Contractor** → additional personal, vehicle, bank, and pay structure sections appear

---

## Files Changed / Added

### New files

| File | Purpose |
|------|---------|
| `src/pages/dashboards/admin/components/ContractorDriverFields.jsx` | Shared UI for contractor form sections |
| `src/pages/dashboards/admin/components/driverTypeUtils.js` | Helpers: expiry highlight, validation, payload builder |

### Updated files

| File | Change |
|------|--------|
| `src/pages/dashboards/admin/userManagement/components/AddEditModal.jsx` | When role = **Driver**, shows Driver Type + contractor fields |
| `src/pages/dashboards/admin/driverManagement/components/AddEditModal.jsx` | Always shows Driver Type; contractor fields when Contractor selected |

---

## UI Behaviour

### Users Management → Add / Edit User

1. Select role **Driver**
2. **Driver Type** radios appear:
   - ○ Employee
   - ○ Contractor
3. If **Contractor** is selected, extra sections show below

### Drivers Management → Add / Edit Driver

1. **Driver Type** radios at the top
2. Employee → existing fields only (name, email, phone, password, vehicle registration)
3. Contractor → extra sections (vehicle registration field replaced by full contractor vehicle section)

---

## Contractor Sections (when Contractor selected)

### Personal Details

- Trading Name *
- Contact Name
- Address *
- Trading Address *
- Phone * / Email * (from main form fields)
- Driver’s Licence Number *
- VAT Registered? (Yes / No) → if Yes, VAT Number *

### Vehicle Details

- Van Registration *
- Vehicle Make
- Vehicle Model
- MOT Expiry *
- Insurance Expiry
- Goods In Transit Insurance
- Public Liability Insurance

**Expiry highlight (red):** within 30 days / 14 days / 7 days / Expired

### Bank Details

- Bank Name
- Account Name
- Sort Code
- Account Number
- Reference

### Pay Structure

- Pay Type *: Daily / Weekly / Fortnightly / Four Weekly
- Rate (£) * — set by Admin

---

## API Payload Notes

On create/update, frontend now sends:

```js
{
  role: 'DRIVER',
  driverType: 'EMPLOYEE' | 'CONTRACTOR',
  // if CONTRACTOR, also:
  tradingName,
  contactName,
  address,
  tradingAddress,
  driversLicenceNumber,
  vatRegistered,
  vatNumber,
  vehicle: { vanRegistration, make, model, motExpiry, insuranceExpiry, goodsInTransitExpiry, publicLiabilityExpiry },
  bank: { bankName, accountName, sortCode, accountNumber, reference },
  payStructure: { payType, rate }
}
```

### Backend status

Backend may **not** fully support these fields yet.  
Frontend UI + payload are ready; backend needs to:

1. Store `driverType`
2. Save contractor profile / vehicle / bank / pay fields
3. Use document expiry to block allocation when expired (future)

Until backend is ready, create/update may ignore extra fields or return an error depending on API validation.

---

## Unchanged

- Customer / Admin / Area Manager flows
- Employee driver create/edit (same fields as before)
- Contractor dashboard (separate frontend dummy under `/contractor`)

---

## How to Test (Admin)

1. Login as Admin
2. Go to **Drivers** (or **Users** → role Driver)
3. Click **Add Driver / Add User**
4. Select **Employee** → form looks like before → save
5. Select **Contractor** → extra sections appear
6. Fill required fields, set expiry dates near today → confirm red highlight
7. Set Pay Type + Rate → Create
