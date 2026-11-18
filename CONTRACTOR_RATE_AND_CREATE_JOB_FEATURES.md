# Contractor Rate & Create Job — New Features

## Summary

Client (Ben) requested 5 adjustments on the Admin dashboard. The frontend fields and UI for items 1, 2, 3 and 5 are done. **None of them are saved to the backend yet** — backend support is needed for each one (see [Backend Required](#backend-required)). Item 4 is a backend bug.

| # | Requirement | Frontend | Backend |
|---|-------------|----------|---------|
| 1 | "Rate on Job" option in contractor Pay Structure | Done | Needed |
| 2 | Rate field on Admin "Create Job" page | Done | Needed |
| 3 | Rate tab when allocating a job to a contractor | Done | Needed |
| 4 | Reminders are sent for already-paid invoices | No change needed | **Bug fix needed** |
| 5 | Multiple collection points on "Create Job" | Done | Needed |

---

## Files Changed / Added

### New files

| File | Purpose |
|------|---------|
| `src/pages/dashboards/admin/bookings/components/ContractorRateModal.jsx` | Rate modal shown when assigning a contractor (Pay Structure / Rate for this Job tabs) |

### Updated files

| File | Change |
|------|--------|
| `src/pages/dashboards/admin/components/driverTypeUtils.js` | Added `RATE_ON_JOB` and added it to `PAY_TYPES` |
| `src/pages/dashboards/admin/components/ContractorDriverFields.jsx` | Rate label/help text changes when "Rate on Job" is selected |
| `src/pages/dashboards/admin/userManagement/components/AddEditModal.jsx` | Pay type map: `Rate on Job` ↔ `PER_JOB` |
| `src/pages/dashboards/contractor/contractorProfile/components/BankPayForm.jsx` | Contractor profile shows `PER_JOB` as "Rate on Job" |
| `src/pages/dashboards/admin/createJob/AdminCreateJob.jsx` | Added Collection From (multiple points) and Contractor Rate section |
| `src/pages/dashboards/admin/createJob/adminJobsStorage.js` | Saves `collectionPoints` and `jobRate` (localStorage only) |
| `src/pages/dashboards/admin/myBookings/AdminMyBookings.jsx` | Job details show collection points and job rate |
| `src/pages/dashboards/admin/bookings/AllocateDriverPage.jsx` | Employee/Contractor badge; contractor assign opens the Rate modal |

---

## 1. "Rate on Job" Pay Type

**Where:** Users → Add / Edit User → Role: Driver → Driver Type: Contractor → Pay Structure

### UI Behaviour

Pay Type options are now:

- ○ Daily
- ○ Weekly
- ○ Fortnightly
- ○ Four Weekly
- ○ **Rate on Job** (new) 

When **Rate on Job** is selected:

- Rate label changes to **"Default Rate per Job (£) \*"**
- Help text: *"Paid per job — this default can be changed on each job when creating or allocating"*

### API value

| UI label | API value |
|----------|-----------|
| Daily | `DAILY` |
| Weekly | `WEEKLY` |
| Fortnightly | `FORTNIGHTLY` |
| Four Weekly | `FOUR_WEEKLY` |
| Rate on Job | `PER_JOB` (new) |

Sent in the existing create/update user payload:

```json
{
  "driverType": "CONTRACTOR",
  "payType": "PER_JOB",
  "rate": 45
}
```

> Until the backend accepts `PER_JOB`, creating or updating a contractor with "Rate on Job" will fail. Other pay types are unaffected.

---

## 2. Contractor Rate on Create Job

**Where:** Admin → Create Job (`/admin/create-job`)

### UI Behaviour

New **Contractor Rate** section (after Contact Information):

- ☐ *This job is for a contractor paid per job (Rate on Job)*
- When ticked → **Rate for this Job (£) \*** field appears (required, must be > 0)
- When unticked → rate is cleared and not sent

The rate is shown in the Confirm modal and in My Bookings → View.

### Proposed payload fields

```json
{
  "isPerJobContractor": true,
  "jobRate": 45
}
```

`jobRate` is `null` when the checkbox is not ticked.

---

## 3. Rate Tab During Job Allocation

**Where:** Bookings → Allocate Driver (`/admin/bookings/allocate`)

### UI Behaviour

1. Each driver in the list shows a badge: **Contractor** or **Employee**
2. Clicking **Assign Driver** on:
   - **Employee** → assigns immediately (same as before)
   - **Contractor** → opens the **Contractor Rate** modal
3. Modal has two tabs:
   - **Pay Structure** — shows the contractor's existing pay type and rate (e.g. *Weekly · £180.00*). Job is paid under that structure.
   - **Rate for this Job** — admin enters a specific £ rate for this job only (overrides the pay structure).
4. If the contractor's pay type is `PER_JOB`, the modal opens on **Rate for this Job** with their default rate pre-filled.
5. **Confirm & Assign** → assigns the driver.

### Current limitation

The allocate request still sends only:

```json
{ "driverId": 12 }
```

The selected rate is **only logged to the console** (`Contractor rate selection (UI only)`), not sent to the API.

### Proposed allocate payload

`POST /api/admin/deliveries/{id}/allocate`

```json
{
  "driverId": 12,
  "rateMode": "JOB_RATE",
  "payType": "WEEKLY",
  "jobRate": 50
}
```

| Field | Values | Notes |
|-------|--------|-------|
| `rateMode` | `PAY_STRUCTURE` \| `JOB_RATE` | Only for contractors |
| `payType` | Contractor's pay type | Informational |
| `jobRate` | number \| `null` | Required when `rateMode = JOB_RATE` |

### Data needed from the drivers list

The badge and modal read these fields from `GET /api/admin/users?role=DRIVER`:

| Field read by frontend | Fallback |
|------------------------|----------|
| `driverType` | `driverProfile.driverType` → default `EMPLOYEE` |
| `payStructure.payType` | `driverProfile.payType` |
| `payStructure.rate` | `driverProfile.rate` |

> If `driverType` is not returned, every driver shows as **Employee** and the Rate modal never opens.

---

## 4. Reminders Sent for Paid Invoices (Bug)

**Where:** Invoices → **Send Reminders**

The frontend calls `POST /api/admin/invoices/send-reminders` with **no body** — the backend decides which customers receive a reminder. The fix is backend-only:

- Only send reminders for invoices that are **not paid** (status ≠ `PAID` and `paidAt` is `null`)
- Apply the same filter to any scheduled/automatic reminder job

---

## 5. Multiple Collection Points on Create Job

**Where:** Admin → Create Job (`/admin/create-job`)

### UI Behaviour

- New **Collection From** card beside **Delivery Address**
- **Add Point** button adds another collection address
- Each extra point has a remove (trash) button; at least one point always remains
- **Collection Point 1 is required**
- Empty points are dropped before saving
- Shown in the Confirm modal and in My Bookings → View as a list

### Proposed payload field

```json
{
  "collectionPoints": [
    "Unit 4, Park Road, Leeds LS1 2AB",
    "12 High Street, Bradford BD1 1AA"
  ]
}
```

---

## Backend Required

1. **Pay type enum** — add `PER_JOB` to contractor pay type; accept it on create/update user.
2. **Contractor invoice calculation** — for `PER_JOB` contractors (and any job with a `jobRate`), invoice total = sum of job rates instead of the period rate.
3. **Admin create-job API** — does not exist yet. Admin Create Job currently saves to browser `localStorage` only (`admin_created_jobs`) and My Bookings reads from there. Needs to accept `collectionPoints` and `jobRate`.
4. **Allocate API** — accept `rateMode` and `jobRate`; store the rate on the delivery.
5. **Drivers list** — return `driverType`, `payType` and `rate` in `GET /api/admin/users?role=DRIVER`.
6. **Send reminders** — exclude paid invoices.

Once the APIs are ready, the frontend needs to:

- Replace `saveAdminCreatedJob` / `getAdminCreatedJobs` with the real create-job and list APIs
- Add `rateMode` and `jobRate` to the allocate request in `AllocateDriverPage.jsx`

---

## Open Questions for Client

- **Create Job:** the form has no driver/contractor selection, so the rate is controlled by a checkbox. Should Create Job also let the admin pick the contractor?
- **Rate on Job contractors:** is the default rate on their profile always used, or must every job have its own rate?
- **Weekly/Daily contractor with a specific job rate:** does that job's rate replace their period pay for that day/week, or is it added on top?
