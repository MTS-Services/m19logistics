# Contractor Driver — Frontend Plan (rakib4)

> Live site এ touch করা যাবে না। কাজ শুধু **`rakib4`** branch এ।  
> এখনকার লক্ষ্য: **শুধু frontend** — Contractor এর জন্য dummy login + dashboard। Backend পরে।

---

## 1. Client কী চেয়েছে (সংক্ষেপ)

Driver আর সবাই একরকম হবে না। দুই ধরনের Driver থাকবে:

| Driver Type | মানে |
|-------------|------|
| **Employee** | এখন যেমন আছে, **কোনো পরিবর্তন নেই** |
| **Contractor** | অতিরিক্ত তথ্য + আলাদা dashboard + নিজে invoice বানাতে পারবে |

### Contractor এর অতিরিক্ত তথ্য

**Personal Details**

- Trading Name *
- Contact Name
- Address *
- Trading Address *
- Phone *
- Email *
- Driver’s Licence Number *
- VAT Registered? (Yes / No) → Yes হলে VAT Number

**Vehicle Details** (মেয়াদ শেষ হলে লাল warning)

- Van Registration *
- Vehicle Make / Model
- MOT Expiry *
- Insurance Expiry
- Goods In Transit Insurance
- Public Liability Insurance

**মেয়াদ highlight (লাল):** ৩০ দিন / ১৪ দিন / ৭ দিন বাকি, অথবা **Expired**  
→ Expired থাকলে contractor কে কাজ allocate করা যাবে না।

**Bank Details**

- Bank Name, Account Name, Sort Code, Account Number, Reference

**Pay Structure**

- Pay Type: Daily / Weekly / Fortnightly / Four Weekly
- Admin rate সেট করতে পারবে

### Contractor Invoice

প্রতি payment cycle এ Contractor নিজে M19 Logistics কে invoice generate করবে। Invoice এ থাকবে:

- Trading Name, Address, Bank details, VAT (থাকলে)

Admin সেই invoice দেখতে পারবে।

### Contractor Dashboard (Employee এর মতো payroll নয়)

- Current Period  
- Completed Jobs  
- Current Earnings  
- Invoice Status → **Paid** / **Outstanding**

---

## 2. এখন সিস্টেমে কী আছে

- Role শুধু `driver` — Employee / Contractor ভাগ **নেই**
- Driver dashboard: Dashboard, Assigned, Completed, Availability, Profile
- Payroll / Invoice page driver এর জন্য **নেই**
- Admin driver create: নাম, email, phone, password, vehicle registration
- Invoice শুধু **customer** এর জন্য

তাই Contractor পুরোপুরি **নতুন feature**।

---

## 3. কাজের ধাপ (Phase)

### Phase 0 — Plan (এই ফাইল) ✅

Client requirement বুঝে plan লেখা।

---

### Phase 1 — Frontend Dummy (এখন এটাই করবো) 🎯

**লক্ষ্য:** Backend ছাড়াই Contractor login + dashboard দেখানো। Admin/Employee ভাঙবে না।

#### 1.1 Dummy Contractor Login

দুইভাবে handle করা যাবে (প্রস্তাব: **Option A**):

**Option A — একই Login page + dummy user (সহজ)**

- Login এ একটা demo contractor account ধরে নেওয়া  
  উদাহরণ: `contractor@demo.com` / `demo123`
- Login এ API call না করে (বা fail হলে) local dummy user set করা:
  ```js
  {
    role: 'driver',
    driverType: 'contractor', // নতুন ফিল্ড
    fullName: 'Demo Trading Ltd',
    email: 'contractor@demo.com',
    ...
  }
  ```
- Redirect: `/driver/dashboard` (পরে type অনুযায়ী UI বদলাবে)

**Option B — আলাদা demo route**

- `/demo/contractor` → সরাসরি contractor dashboard  
- Production এ hide / remove করা সহজ  
- কিন্তু আসল login flow test হয় না

**সুপারিশ:** Option A — একই `/login` দিয়ে dummy contractor ঢোকানো।

#### 1.2 Driver Type অনুযায়ী Dashboard

`user.driverType` দেখে UI ভাগ:

| Type | Dashboard দেখাবে |
|------|------------------|
| `employee` (বা type নাই = পুরনো driver) | **আগের মতোই** — কোনো change নেই |
| `contractor` | নতুন cards: Current Period, Completed Jobs, Current Earnings, Invoice Status |

#### 1.3 Contractor Dummy Pages (frontend only)

| Page | Route (প্রস্তাব) | Dummy data |
|------|------------------|------------|
| Dashboard Home | `/driver/dashboard` | Period, jobs count, earnings, invoice status |
| My Invoices | `/driver/invoices` | Outstanding / Paid list (hardcoded) |
| Generate Invoice | `/driver/invoices/generate` | Form + PDF/preview (local mock) |
| Profile (extended) | `/driver/profile` | Personal + Vehicle + Bank + Pay (read-only বা edit UI dummy) |
| Assigned / Completed | আগের route | আগের মতো রাখা (dummy list চাইলে) |

Sidebar (contractor হলে):

- Dashboard  
- Assigned Deliveries  
- Completed Deliveries  
- My Invoices ← নতুন  
- Profile  

Employee sidebar আগের মতোই থাকবে (Invoices থাকবে না)।

#### 1.4 Expiry highlight (UI only)

Vehicle dates এর উপর color logic (dummy dates দিয়ে):

| অবস্থা | রং / label |
|--------|------------|
| > ৩০ দিন | স্বাভাবিক |
| ≤ ৩০ দিন | Warning (লালচে) |
| ≤ ১৪ দিন | Stronger warning |
| ≤ ৭ দিন | Critical |
| Expired | Expired badge — allocate block এর UI দেখানো |

এই phase এ শুধু **দেখানো**; আসল allocate block backend এ পরে।

#### 1.5 Admin side (Phase 1 এ অল্প / পরে)

Phase 1 এ Admin form পুরো বানানো **optional**।  
আগে contractor dashboard ঠিক করে দেখানো ভালো।  
Admin Add Driver এ `Driver Type` dropdown পরের phase এ।

---

### Phase 2 — Admin Frontend (পরে)

- Add/Edit Driver এ: **Employee | Contractor**
- Employee → আগের ফর্ম
- Contractor → Personal + Vehicle + Bank + Pay Structure sections
- Expiry column / badge Drivers list এ
- Expired হলে allocate UI তে disable / warning

---

### Phase 3 — Backend + Real API (পরে)

- `driverType`: `EMPLOYEE` | `CONTRACTOR`
- Contractor profile tables/fields
- Document expiry validation (allocate block)
- Contractor invoice generate API
- Admin invoice list / mark Paid
- Dummy login সরিয়ে real auth

---

## 4. Phase 1 এ কীভাবে handle করবো (বাস্তব plan)

```
Login (dummy contractor)
        ↓
AuthContext → user.driverType = 'contractor'
        ↓
ProtectedRoute → role = driver (আগের মতো)
        ↓
DriverDashboardLayout
        ↓
  driverType === 'contractor' ?
        Yes → Contractor nav + ContractorDashboardHome
        No  → আগের Employee UI (অপরিবর্তিত)
```

### ফাইল যেগুলোতে হাত দেওয়া হতে পারে (Phase 1)

| ফাইল | কাজ |
|------|-----|
| `LoginView.jsx` | Dummy contractor credential detect |
| `AuthContext.jsx` | `driverType` ধরে রাখা |
| `DriverDashboardLayout.jsx` | Type অনুযায়ী sidebar |
| `DriverDashboardHome.jsx` | Contractor হলে আলাদা stats |
| নতুন: `ContractorDashboardHome.jsx` | Current Period / Jobs / Earnings / Invoice Status |
| নতুন: `ContractorInvoices.jsx` | Invoice list (dummy) |
| নতুন: `GenerateContractorInvoice.jsx` | Invoice generate UI (dummy) |
| `router.jsx` | `/driver/invoices` routes |
| Dummy data file (যেমন `contractorDummyData.js`) | Hardcoded JSON |

### যা Phase 1 এ করবো না

- Backend API change  
- Live / main branch merge  
- Employee flow ভাঙা  
- আসল PDF email / payment  
- Allocate block এর real validation  

---

## 5. Dummy Login — ব্যবহার কিভাবে (Phase 1 শেষে)

| Account | Password | Type |
|---------|----------|------|
| `contractor@demo.com` | `demo123` | Contractor driver |
| আগের আসল driver account | আগের মতো | Employee (API) |

Contractor login করলে দেখা যাবে:

1. Contractor dashboard cards  
2. My Invoices (dummy Paid / Outstanding)  
3. Generate Invoice button (preview)  
4. Profile এ extra sections (dummy)  

---

## 6. Safety rules (Live এর জন্য)

1. শুধু **`rakib4`** branch এ কাজ  
2. Employee path এ কোনো breaking change না  
3. Dummy login শুধু `import.meta.env.DEV` বা flag দিয়ে রাখা — production build এ বন্ধ রাখার option  
4. Merge এর আগে backend + real auth ready হতে হবে  
5. Unfinished merge / config delete এমন ভুল এড়ানো (যেমন `vite.config.js`)

---

## 7. পরবর্তী কাজ (এই README এর পর)

1. ✅ এই plan approve  
2. ⏭ Phase 1 implement: dummy login + contractor dashboard + invoices UI  
3. Client কে demo দেখানো  
4. Feedback নিয়ে Phase 2 (Admin form)  
5. Backend ready হলে Phase 3  

---

## 8. সংক্ষেপ এক লাইনে

**Employee আগের মতোই থাকবে; Contractor আলাদা type — আগে frontend এ dummy login/dashboard দিয়ে দেখাবো (`rakib4`), পরে admin form ও backend।**
