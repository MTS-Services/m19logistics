# M19 Logistics - Complete Project Requirements

## 📋 Project Overview

M19 Logistics is a full-stack courier management system for a Wrexham-based delivery company serving customers across the UK, with specialized focus on Topps Tiles stores.

**Domain**: www.m19logistics.com
**Founded**: 2019
**Primary Contact**: Ben Admin - 07971415430

---

## 👥 User Roles & Permissions

### Role Structure

| Role             | Permissions                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Admin**        | Full system access: pricing, users, drivers, invoices, all deliveries, add/remove admins |
| **Driver**       | View assigned deliveries, upload photo/signature, fill "Received By", no edit rights     |
| **Customer**     | Submit delivery requests, view history, view/download invoices                           |
| **Area Manager** | Read-only access to assigned store data + analytics, no edit/delete permissions          |

---

## 🧑‍💼 Pre-loaded Users

### Customers (Topps Tiles Stores)

| Customer        | Depot Address                                       | Login ID | Email                     | Password    | Pricing Tier |
| --------------- | --------------------------------------------------- | -------- | ------------------------- | ----------- | ------------ |
| Topps Chester   | 4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY   | T022     | topps022@toppstiles.co.uk | Password022 | Tier B       |
| Topps Nantwich  | Unit 1, Nantwich Trade Park, CW5 6HL                | T226     | topps226@toppstiles.co.uk | Password226 | Tier B       |
| Topps Newcastle | Unit 4, Lyme Court, ST5 3TF                         | T167     | topps167@toppstiles.co.uk | Password167 | Tier A       |
| Topps Northwich | Wadebrook Retail Park, CW9 5NN                      | T143     | topps143@toppstiles.co.uk | Password143 | Tier B       |
| Topps Rhyl      | 152 Vale Road, Rhyl, LL18 2PD                       | T211     | topps211@toppstiles.co.uk | Password211 | Tier B       |
| Topps Wrexham   | Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL | T217     | topps217@toppstiles.co.uk | Password217 | Tier B       |

_All require password reset on first login_

### Drivers

| Name | Email             | Phone       | Username | Password | Profile Photo |
| ---- | ----------------- | ----------- | -------- | -------- | ------------- |
| BK   | wwwbk@yahoo.co.uk | 07971415430 | BK01     | M1901    | ✅ Provided   |

_Password reset required on first login_

### Area Managers

| Name      | Email                    | Phone       | Username | Password | Access Scope           |
| --------- | ------------------------ | ----------- | -------- | -------- | ---------------------- |
| Rob Myers | rob.myers@toppstiles.com | 07725957625 | Rob01    | Topps01  | All Topps Tiles stores |

_Password reset required on first login_

---

## 💰 Pricing Structure

### Pricing Tiers

| Tier   | Base Price (per 800kg) | VAT (20%) | Total (≤45 miles) |
| ------ | ---------------------- | --------- | ----------------- |
| Tier A | £41.67                 | £8.33     | £50.00            |
| Tier B | £37.50                 | £7.50     | £45.00            |

### Weight-Based Pricing

- **Incremental**: £37.50 (Tier B) or £41.67 (Tier A) per 800kg block + VAT
- **No cap on weight or pricing**

### Distance-Based Surcharge

- **Base range**: Up to 45 miles (included in base price)
- **Additional charge**: ½ base price per 45-mile increment per 800kg block
- **Example**: 90 miles = 1 extra zone = +£18.75 (Tier B) or +£20.84 (Tier A) per 800kg

### Distance Check & Map Preview

- **Within 45 miles**: Show Google Maps preview with distance, proceed normally
- **Beyond 45 miles**: Show message: _"Please call 07971415430 or email deliveries@m19logistics.com for long-distance deliveries"_
- **Distance calculation**: From customer's depot address to delivery destination

### Custom Pricing Override

- Admins can set custom pricing per customer
- Override weight-based or distance-based rules
- Choose flat rate or per-delivery pricing

---

## 📦 Delivery Request Workflow

### Status Board (4 Stages)

| Status           | Description                                            | Who Moves It?    |
| ---------------- | ------------------------------------------------------ | ---------------- |
| **Received** 🔴  | New request submitted by store (red badge if unviewed) | Auto (on submit) |
| **Allocated** 📤 | Admin confirms & assigns to driver                     | Admin            |
| **Delivered** ✔️ | Completed, signed, photo captured                      | Driver           |
| **Cancelled** ❌ | Cancelled by store or admin                            | Store or Admin   |

### Delivery Request Form (Customer Portal)

**Required Fields:**

- Date (calendar picker)
- Time Slot: AM or PM (admin-editable availability)
  - _Exception_: Same-day requests hide time slots, show message: _"Same-day delivery cannot be guaranteed. Please call 07971415430 to confirm availability"_
- Weight (in kg)
- Delivery Address (with Google Maps distance calculation)
- Customer Name
- Phone Number
- SPO Number
- Name of person requesting
- **Any specific instructions** (text area)

**Additional Delivery Feature:**

- If customer has existing delivery on same date/depot/SPO:
  - Prompt: _"Do you want to add an additional delivery to that booking?"_
  - Creates separate delivery record (charged separately)
  - Marked as "Additional Delivery" on invoice

### Customer Portal Controls

- ✅ **Cancel delivery** (until driver accepts)
- ✏️ **Edit details**: time slot, address, SPO, notes
- ⚠️ **Confirmation prompt** before cancel/edit to prevent mistakes
- Edits notify admin (red badge or email)

### Audit Trail

Every status change, edit, or cancellation logged with:

- Who made the change (user name/role)
- What was changed (before & after)
- When (timestamp)
- Optional reason field (required for cancellations)

---

## 🚚 Driver Features

### Driver Dashboard

- View assigned deliveries with:
  - Customer name, depot
  - Delivery address
  - Date & time slot
  - SPO number
  - Specific instructions
- **Click-to-call buttons** (mobile):
  - 📞 Call delivery destination
  - 📞 Call store contact

### Delivery Completion

Driver uploads:

1. **Photo** (HTML5 file input or camera capture)
2. **Signature** (HTML5 canvas)
3. **Received By** (text input - name)
4. **Driver Notes/Feedback** (optional text area)
   - Example: _"Customer asked to leave goods by rear door"_

### Driver Accept/Decline

- Driver must accept delivery after allocation
- Optional decline with reason

---

## 📧 Email System

### Email Addresses

- **ben@m19logistics.com** - Default admin contact
- **enquiries@m19logistics.com** - Public contact form submissions
- **admin@m19logistics.com** - Invoice confirmations, delivery alerts
- **deliveries@m19logistics.com** - New delivery request notifications, system emails

### Email Notifications

#### 1. Delivery Completion Email (to Customer)

**To**: Customer store email (e.g., topps211@toppstiles.co.uk)  
**From**: deliveries@m19logistics.com  
**Subject**: M19 Logistics – Completed Delivery Confirmation (SPO: XXXXX)

**Body**:

```
Hello [Store Name],

Your delivery for SPO [XXXXX] has been completed.

Received By: [Name]
Date: [DD/MM/YYYY]
Driver: [Driver Name]
Driver Notes: [Notes if provided]

Attached is the signed proof of delivery and photo.

Thank you,
M19 Logistics
```

**Attachments**:

- Signature image (PNG/JPG)
- Delivery photo (JPG/PNG)

#### 2. Weekly Driver Feedback Summary (to Admin)

**To**: admin@m19logistics.com, ben@m19logistics.com  
**Frequency**: Every Sunday at midnight  
**Subject**: M19 Logistics – Weekly Driver Feedback Summary (Week: DD/MM – DD/MM)

**Body**: Table of all driver notes submitted that week

---

## 🧾 Invoice System

### Invoice Numbering

- **Format**: T#### (e.g., T0326)
- **Auto-increment**: Based on last global invoice (not per customer)
- **Current latest**: T0325 (next will be T0326)

### Invoice Generation

- **Frequency**: Weekly per customer
- **Triggered**: End of week (Sunday midnight) or manual by admin
- **Consolidation**: All deliveries for one customer in one week → single invoice

### Invoice Line Items

Each delivery includes:

- SPO number
- Date
- Delivery address
- Base price (ex-VAT)
- Distance surcharge (if applicable)
- VAT (20%)
- Total

**Additional charges** (admin can add):

- Toll charges
- Extra van run
- Waiting time
- Weekend surcharge

**Invoice Example**:

```
Delivery 1 — SPO013349 — 30/06/2025 — Chester — £37.50
Additional Delivery — SPO013349 — 30/06/2025 — Chester — £37.50
Toll Charge — M6 Toll — £10.00
Extra Run — Wrexham to Northwich — £37.50
                                          Subtotal: £132.50
                                          VAT (20%): £26.50
                                          TOTAL: £159.00
```

### Invoice Header (from provided template)

```
M19 Logistics Limited
84 Acton Hall Walks
Wrexham
LL12 7YJ
Tel.: 07971415430 / 01978439739
Email: m19logistics@gmail.com
VAT Number: 447 5918 54
```

### Admin Invoice Controls

- View all generated invoices
- Edit invoice contents:
  - Add/remove delivery entries
  - Edit SPO, date, customer reference
  - Add notes
- Override price or VAT (one-off adjustments)
- Manually update invoice number
- Regenerate PDF after edits
- Email invoice to customer

---

## 📊 Analytics Dashboard

### Admin Analytics (Full Access)

#### Time-Based Reports

- This Week / Last Week
- This Month / Last Month
- Custom date ranges

#### Finance Metrics

- Total revenue (gross + VAT)
- Total revenue per store
- Average revenue per delivery
- Total VAT collected
- Outstanding/unpaid invoices
- Comparison with previous periods (% change)

#### Delivery Metrics

- Total deliveries (week/month/year)
- Deliveries per store
- Daily and hourly breakdowns
- Cancelled or delayed deliveries
- Comparison vs last week/month

#### Driver Analytics

- Deliveries completed per driver (day/week/month)
- Average completion time
- Late deliveries (optional)
- Attached proofs count
- Feedback submitted count
- Filter by date range
- Compare across drivers

#### Visual Reports

- 📊 Bar charts: Deliveries by store/week
- 📈 Line graphs: Revenue trends over time
- 🥧 Pie charts: Store share of total deliveries

**Export options**: CSV, PDF, Printable summaries

### Area Manager Analytics (Limited)

Rob Myers and future area managers see:

- Read-only access to assigned stores (e.g., all Topps Tiles)
- Delivery records for assigned stores
- Weekly/monthly performance dashboards
- Invoice history for assigned group
- No edit/delete permissions

---

## 🏠 Website Public Pages

### Home Page

**Banner**: Full-width image of fleet of vans with overlay text:

> "Nationwide Courier Services with Local Reliability"

**CTA Buttons**:

- 🔵 Request a Delivery → login/submit delivery
- 🟢 Contact Us → contact form

**Intro Text**:

> At M19 Logistics, we are dedicated to providing reliable, efficient, and nationwide courier delivery solutions from our base in Wrexham. Whether you're a local business or a national enterprise, our tailored logistics services ensure your parcels arrive on time, every time.

**Our Services**:

- Same-day and next-day delivery options
- Scheduled pickups and deliveries
- Fragile and valuable item handling
- Warehousing and distribution solutions
- Real-time tracking and updates
- Customized logistics solutions to meet your specific needs

**Why Choose Us**:

- **Local Expertise, Nationwide Reach**: Rooted in Wrexham, we combine local knowledge with extensive delivery networks to serve clients across the UK
- **Reliable & Timely**: Our commitment to punctuality and secure handling ensures your shipments reach their destination safely and on schedule
- **Customer-Centric Approach**: We prioritize your business needs, offering flexible services and dedicated support
- **Competitive Pricing**: Quality delivery doesn't have to come at a high cost — enjoy affordable rates with no compromise on service quality
- **Environmental Responsibility**: We adopt eco-friendly practices to reduce our carbon footprint and promote sustainable logistics

**Footer Callout**:

> Partner with M19 Logistics for dependable courier services that connect Wrexham to the nation — delivering your success, one parcel at a time.

### About Us Page

**Title**: About Us

**Content**:

> Welcome to M19 Logistics, your trusted partner in seamless delivery solutions. Founded in 2019, M19 Logistics was born from a vision to redefine courier services with speed, reliability, and customer satisfaction at the core of everything we do.
>
> At M19 Logistics, we understand that every package tells a story, and we're committed to delivering those stories with care and precision. From local businesses to individual customers, we provide tailored logistics solutions to meet your unique needs.
>
> Our team of dedicated professionals leverages cutting-edge technology and a customer-first approach to ensure your parcels arrive on time, every time. Since our inception, we've grown by staying true to our values: integrity, efficiency, and innovation.
>
> Whether it's same-day delivery, nationwide shipping, or specialized logistics, M19 Logistics is here to make every delivery effortless.
>
> Thank you for choosing M19 Logistics—where your deliveries matter as much to us as they do to you.

**Company Logo**: Extract from invoice template  
**Contact**: Tel: 07971415430 / 01978439739 | Email: m19logistics@gmail.com  
**Exclude**: Company address (per requirements)

### Contact Page

- Contact information
- Map showing location
- Contact form

### Enquiries Page

- General contact form for prospective clients
- Sends to enquiries@m19logistics.com

---

## 🔐 Security & User Management

### Admin User Management Features

Admins can:

- ✅ Add new users (admin, driver, customer, area manager)
- ✅ Set role on creation
- ✅ Upload profile photos
- ✅ Edit user details (email, phone, username)
- ✅ Reset passwords
- ✅ Promote/demote roles
- ✅ Add/remove other admins
- ✅ Assign drivers to deliveries
- ✅ Enable/disable user accounts

### Profile Photo Support

- All users (admin, driver, area manager) can have profile photos
- Display in: user list, delivery screens, dashboards
- Default avatar if no photo uploaded
- Stored in `/media/profile_pics/`
- Auto-resized for performance

### Password Requirements

- Minimum 8 characters (configurable)
- Must be reset on first login for all pre-loaded users
- Admin can force password reset

### Role-Based Access Control (RBAC)

- Route protection by role
- Decorator-based permission checks
- Drivers can only see assigned deliveries
- Area managers limited to assigned store data

---

## 📲 Mobile Features

### Responsive Design

- Mobile-first approach
- Sidebar: 75% width on mobile, standard width on desktop
- Touch-friendly buttons and forms

### Mobile Delivery Confirmation

- HTML5 `<input type="file">` for photo capture
- HTML5 canvas for signature
- Works in mobile browser (no separate app initially)

### Click-to-Call Integration

- Phone numbers become tap-to-call on mobile
- Direct dial customer/store from driver dashboard

---

## 🛠️ Technical Stack

### Recommended Stack

- **Backend**: Flask (Python)
- **Frontend**: React (already in use)
- **Database**: PostgreSQL or SQLite
- **File Storage**: Local filesystem initially
- **Maps API**: Google Maps Distance Matrix API
- **Email**: SMTP integration (deliveries@m19logistics.com)
- **PDF Generation**: ReportLab or WeasyPrint
- **Authentication**: Flask-Login or JWT

### Deployment Options

- Local hosting (XAMPP, Docker, or Flask development server)
- Domain: www.m19logistics.com
- Email domains: @m19logistics.com

---

## 📝 Future Enhancements (Phase 4+)

### Planned Features

- Dedicated mobile app for drivers (iOS/Android)
- Real-time GPS tracking
- Automated customer SMS notifications
- Fuel surcharge table (admin-configurable)
- Cut-off time for same-day bookings (e.g., after 12 PM)
- CSV bulk upload for customers/depots
- API integration for third-party booking systems
- Customer feedback/rating system
- Multi-language support

---

## 📄 Payment Terms & Banking

**Payment Terms**: 30 Days (End of Month)

**Bank Details** (for invoices):

```
Bank Name: NatWest Bank
Account Holder: M19 Logistics Limited
Sort Code: 01-10-01
Account Number: 72696370
```

---

## 📞 Contact Information

**Primary Contact**: Ben Admin  
**Phone**: 07971415430 / 01978439739  
**Email**: ben@m19logistics.com  
**General Enquiries**: enquiries@m19logistics.com  
**Delivery Enquiries**: deliveries@m19logistics.com  
**Admin Notifications**: admin@m19logistics.com

---

## ✅ Project Status

This document serves as the complete requirements specification for M19 Logistics. All features listed here should be implemented according to these specifications. For questions or clarifications, refer to this document first.

**Last Updated**: January 15, 2026  
**Version**: 1.0
