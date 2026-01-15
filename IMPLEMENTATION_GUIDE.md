# M19 Logistics - Complete Implementation Guide

## 🎯 Project Overview

This document provides a complete roadmap for implementing all remaining features of the M19 Logistics courier management system. The project is currently in **Phase 1 Complete** with core infrastructure ready.

---

## 📊 Phase Breakdown

### ✅ Phase 1: COMPLETED

**Infrastructure & Public Pages**

What's Done:

- Full authentication system with role-based access
- All public pages (Home, About, Contact, Enquiries)
- Login system with demo credentials
- Protected routing
- Dashboard frameworks for all 4 roles
- Demo data for 9 users, pricing tiers, and configuration
- Professional M19 branding throughout

**Test It Now:**

- Visit: http://localhost:5174
- Login with: admin / admin123 (or any demo credential)
- Navigate all public pages and dashboard structures

---

### 🚧 Phase 2: CRITICAL FEATURES (Next Priority)

#### 2.1 Customer Delivery Request Form

**Location**: `src/pages/dashboards/customer/NewDeliveryForm.jsx`

**Features Required**:

1. Form fields:
   - Date picker (with same-day restrictions)
   - AM/PM time slot selector (hide for same-day)
   - Weight input (number, kg)
   - Delivery address (with autocomplete)
   - Customer name
   - Customer phone
   - SPO number
   - Specific instructions (textarea)

2. Pricing calculation:
   - Real-time price preview
   - Weight-based: £37.50/800kg (Tier B) or £41.67/800kg (Tier A)
   - Distance-based: Google Maps API integration
   - Display: Base price + VAT + Total

3. Distance check:
   - If > 45 miles: Show message to call 07971415430
   - Otherwise: Allow booking

4. Same-day delivery:
   - Hide AM/PM selector
   - Show: "Call 07971415430 to confirm same-day availability"

5. Additional delivery option:
   - Check if delivery exists for same date/depot
   - Offer: "Add to existing booking?" (charged separately)

**API Endpoints Needed**:

```javascript
POST /api/deliveries/create
GET /api/deliveries/check-existing?date=&customerId=
POST /api/maps/calculate-distance (Google Maps)
GET /api/pricing/calculate?weight=&distance=&customerId=
```

**Dependencies**:

- Google Maps API key
- Date picker library (e.g., react-datepicker)
- Form validation (react-hook-form)

---

#### 2.2 Admin Booking Status Board

**Location**: `src/pages/dashboards/admin/BookingsBoard.jsx`

**Layout**: 4-column board (like Kanban)

**Columns**:

1. **Received** (Red badge for new)
2. **Allocated** (Blue)
3. **Delivered** (Green)
4. **Cancelled** (Gray)

**Each Booking Card Shows**:

- Customer name
- SPO number
- Delivery date/time
- Delivery address
- Weight
- Price
- Driver name (if allocated)
- Actions: View Details, Allocate Driver, Cancel

**Features**:

- Click card → Open modal with full details
- Drag & drop between columns (optional)
- Filter by: Date, Customer, Driver, Status
- Search by SPO or address
- Red badge on "Received" for unviewed bookings

**API Endpoints**:

```javascript
GET /api/bookings/all?status=&date=
PUT /api/bookings/:id/status
PUT /api/bookings/:id/allocate-driver
GET /api/bookings/:id
```

---

#### 2.3 Driver Delivery Completion Workflow

**Location**: `src/pages/dashboards/driver/DeliveryCompletion.jsx`

**Components Needed**:

1. **Signature Pad** (`src/components/SignaturePad.jsx`):

```jsx
import { useRef, useState } from 'react';

const SignaturePad = ({ onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Implement canvas drawing logic
  // Save as base64 image
  // Clear function
  // Touch support for mobile

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className="rounded-lg border-2 border-gray-300"
    />
  );
};
```

2. **Photo Upload**:

```jsx
<input
  type="file"
  accept="image/*"
  capture="environment" // Opens camera on mobile
  onChange={handlePhotoUpload}
/>
```

3. **Delivery Completion Form**:
   - Received By (text input)
   - Signature pad
   - Photo upload
   - Driver notes (optional textarea)
   - Submit button

**Workflow**:

1. Driver clicks "Complete Delivery"
2. Form modal opens
3. Driver fills all fields
4. On submit:
   - Upload signature to S3
   - Upload photo to S3
   - Save delivery data
   - Mark status as "Delivered"
   - Send email to customer with proof

**API Endpoints**:

```javascript
POST /api/deliveries/:id/complete
POST /api/upload/signature
POST /api/upload/photo
POST /api/emails/delivery-complete
```

---

#### 2.4 Pricing Engine

**Location**: `src/utils/pricingCalculator.js`

```javascript
export const calculateDeliveryPrice = ({
  weight, // in kg
  distance, // in miles
  customerId, // for tier lookup
}) => {
  // 1. Get customer's pricing tier
  const customer = getCustomerById(customerId);
  const tier = pricingTiers[customer.pricingTier];

  // 2. Calculate weight blocks
  const weightBlocks = Math.ceil(weight / 800);

  // 3. Calculate distance zones (base = 45 miles)
  const distanceZones = Math.ceil(distance / 45);

  // 4. Calculate base price
  const basePrice = tier.basePrice * weightBlocks;

  // 5. Calculate distance surcharge (50% per extra zone)
  const distanceSurcharge = distanceZones > 1 ? basePrice * 0.5 * (distanceZones - 1) : 0;

  // 6. Total before VAT
  const subtotal = basePrice + distanceSurcharge;

  // 7. Calculate VAT
  const vat = subtotal * tier.vatRate;

  // 8. Total
  const total = subtotal + vat;

  return {
    weightBlocks,
    distanceZones,
    basePrice,
    distanceSurcharge,
    subtotal,
    vat,
    total,
    breakdown: `${weightBlocks} x £${tier.basePrice} (${weight}kg) + ${distanceZones - 1} distance zones`,
  };
};
```

**Google Maps Integration**:

```javascript
export const calculateDistance = async (origin, destination) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
      `origins=${encodeURIComponent(origin)}` +
      `&destinations=${encodeURIComponent(destination)}` +
      `&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
  );

  const data = await response.json();
  const distanceMeters = data.rows[0].elements[0].distance.value;
  const distanceMiles = distanceMeters * 0.000621371;

  return {
    miles: distanceMiles.toFixed(2),
    duration: data.rows[0].elements[0].duration.text,
  };
};
```

---

#### 2.5 Invoice Generation System

**Location**: `src/utils/invoiceGenerator.js`

**Library**: Use `jsPDF` or `react-pdf`

```bash
npm install jspdf jspdf-autotable
```

**Invoice Structure**:

```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (invoiceData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('INVOICE', 150, 20);

  // Company details (top right)
  doc.setFontSize(10);
  doc.text('M19 Logistics Limited', 150, 30);
  doc.text('84 Acton Hall Walks', 150, 35);
  doc.text('Wrexham, LL12 7YJ', 150, 40);
  // ... rest of company info

  // Customer details (left side)
  doc.text(`Invoice To:`, 20, 30);
  doc.text(invoiceData.customerName, 20, 35);
  doc.text(invoiceData.customerAddress, 20, 40);

  // Invoice details
  doc.text(`Invoice No: ${invoiceData.invoiceNumber}`, 150, 55);
  doc.text(`Invoice Date: ${invoiceData.date}`, 150, 60);

  // Deliveries table
  doc.autoTable({
    startY: 70,
    head: [['QTY', 'DESCRIPTION / DATE / STORE', 'UNIT COST', 'VAT', 'TOTAL']],
    body: invoiceData.deliveries.map((d) => [
      '1',
      `Cust. Ref: ${d.spoNumber} / ${d.date} / ${d.store}`,
      `£${d.basePrice.toFixed(2)}`,
      `£${d.vat.toFixed(2)}`,
      `£${d.total.toFixed(2)}`,
    ]),
  });

  // Extra charges
  if (invoiceData.extraCharges.length > 0) {
    // Add extra charges rows
  }

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`SubTotal: £${invoiceData.subtotal.toFixed(2)}`, 150, finalY);
  doc.text(`VAT (20%): £${invoiceData.vat.toFixed(2)}`, 150, finalY + 5);
  doc.text(`TOTAL: £${invoiceData.total.toFixed(2)}`, 150, finalY + 10);

  // Bank details
  doc.text('Bank Details', 20, finalY + 20);
  doc.text('Bank Name: NatWest Bank', 20, finalY + 25);
  // ... rest of bank details

  // Save
  doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);

  return doc.output('blob'); // For upload
};
```

**Weekly Invoice Auto-Generation**:

```javascript
// Run every Sunday at midnight
export const generateWeeklyInvoices = async () => {
  const customers = await getActiveCustomers();
  const weekStart = getLastMonday();
  const weekEnd = getLastSunday();

  for (const customer of customers) {
    const deliveries = await getDeliveriesForPeriod(customer.id, weekStart, weekEnd);

    if (deliveries.length > 0) {
      const invoiceNumber = getNextInvoiceNumber(); // T0326, T0327, etc.

      const invoiceData = {
        invoiceNumber,
        customerId: customer.id,
        customerName: customer.name,
        customerAddress: customer.depotAddress,
        weekStarting: weekStart,
        weekEnding: weekEnd,
        deliveries,
        // Calculate totals
      };

      const pdfBlob = generateInvoice(invoiceData);
      await uploadInvoiceToS3(pdfBlob, invoiceNumber);
      await sendInvoiceEmail(customer.email, invoiceData);
    }
  }
};
```

---

### 📊 Phase 3: ANALYTICS & REPORTING

#### 3.1 Admin Analytics Dashboard

**Location**: `src/pages/dashboards/admin/Analytics.jsx`

**Metrics to Display**:

1. **Financial Metrics**:
   - Total revenue (gross)
   - Total VAT collected
   - Revenue per customer
   - Average revenue per delivery
   - Outstanding invoices

2. **Delivery Metrics**:
   - Total deliveries (all time, this month, this week)
   - Deliveries per customer
   - Deliveries per driver
   - Average delivery time
   - Cancelled deliveries

3. **Charts**:
   - Revenue over time (line chart)
   - Deliveries by store (bar chart)
   - Delivery status distribution (pie chart)
   - Weekly trends (area chart)

**Libraries**:

```bash
npm install recharts
```

**Example Chart**:

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const RevenueChart = ({ data }) => (
  <LineChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="week" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="revenue" stroke="#14b8a6" />
  </LineChart>
);
```

---

#### 3.2 Driver Performance Tracking

**Location**: `src/pages/dashboards/admin/DriverAnalytics.jsx`

**Metrics Per Driver**:

- Total deliveries completed
- Average completion time
- On-time delivery rate
- Customer feedback scores
- Deliveries per day/week/month

**Display**:

- Table with sortable columns
- Individual driver detail view
- Performance trends chart

---

### 📧 Phase 4: EMAIL NOTIFICATIONS

**Service**: Use SendGrid or AWS SES

**Email Templates Needed**:

1. **Booking Confirmation** (to Customer):

```
Subject: Delivery Booking Confirmed - SPO [number]

Dear [Customer],

Your delivery has been booked for [date] [AM/PM].

Delivery Details:
- SPO: [number]
- Date: [date]
- Time: [AM/PM]
- Address: [address]
- Weight: [kg]
- Estimated Cost: £[total]

Track your delivery at: [portal link]

Thank you,
M19 Logistics
```

2. **Delivery Allocated** (to Driver):

```
Subject: New Delivery Assigned - SPO [number]

Hi [Driver],

You have been assigned a new delivery.

Details:
- Customer: [name]
- Address: [address]
- Contact: [phone]
- SPO: [number]
- Notes: [instructions]

View in your portal: [link]
```

3. **Delivery Complete** (to Customer):

```
Subject: Delivery Completed - SPO [number]

Dear [Customer],

Your delivery has been completed.

Received by: [name]
Completed at: [time]
Driver: [driver name]

Proof of delivery is attached.

View details: [portal link]
```

4. **Weekly Invoice** (to Customer):

```
Subject: Weekly Invoice - [invoice number]

Dear [Customer],

Please find attached your weekly invoice for the period [date] to [date].

Invoice Summary:
- Total Deliveries: [count]
- Subtotal: £[amount]
- VAT: £[vat]
- Total: £[total]

Payment Terms: 30 Days (End of Month)

View online: [portal link]
```

5. **Driver Feedback Summary** (to Admin):

```
Subject: Weekly Driver Feedback Summary

Hi Admin,

Here's a summary of driver feedback for the week of [date]:

[Driver Name]:
- Deliveries: [count]
- Feedback notes: [count]
- Notable feedback:
  - [note 1]
  - [note 2]

Full report: [portal link]
```

**Implementation**:

```javascript
// src/services/emailService.js
import axios from 'axios';

export const sendEmail = async ({ to, subject, template, data }) => {
  return axios.post('/api/emails/send', {
    to,
    subject,
    template,
    data,
    attachments: data.attachments || [],
  });
};

export const sendBookingConfirmation = async (booking) => {
  return sendEmail({
    to: booking.customer.email,
    subject: `Delivery Booking Confirmed - SPO ${booking.spoNumber}`,
    template: 'booking-confirmation',
    data: booking,
  });
};

// ... other email functions
```

---

### 🔐 Phase 5: ADVANCED FEATURES

#### 5.1 Audit Trail

**Location**: `src/utils/auditLogger.js`

```javascript
export const logAction = async (action, details) => {
  const user = getCurrentUser();

  const auditLog = {
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: await getClientIP(),
  };

  await axios.post('/api/audit-logs', auditLog);
};

// Usage
await logAction('DELIVERY_CANCELLED', {
  deliveryId: '123',
  reason: 'Customer request',
  originalStatus: 'allocated',
});
```

**Display**: Admin can view audit logs for any record

---

#### 5.2 Real-Time Notifications

**Library**: Socket.io

```bash
npm install socket.io-client
```

```javascript
// src/services/socketService.js
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_WS_URL);

export const subscribeToBookings = (callback) => {
  socket.on('new-booking', callback);
};

export const subscribeToStatusChange = (deliveryId, callback) => {
  socket.on(`delivery-${deliveryId}-status`, callback);
};

// Usage in Admin Dashboard
useEffect(() => {
  subscribeToBookings((booking) => {
    toast.info(`New booking: ${booking.spoNumber}`);
    // Update UI
  });
}, []);
```

---

#### 5.3 Profile Photo Upload

**Location**: `src/components/ProfilePhotoUpload.jsx`

```jsx
import { useState } from 'react';
import { Camera } from 'lucide-react';

const ProfilePhotoUpload = ({ currentPhoto, onUpload }) => {
  const [preview, setPreview] = useState(currentPhoto);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to S3
    const formData = new FormData();
    formData.append('photo', file);

    const response = await axios.post('/api/upload/profile-photo', formData);
    onUpload(response.data.url);
  };

  return (
    <div className="relative">
      <img
        src={preview || '/default-avatar.png'}
        alt="Profile"
        className="h-32 w-32 rounded-full object-cover"
      />
      <label className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-teal-600 p-2 text-white">
        <Camera className="h-5 w-5" />
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};
```

---

## 🛠️ Backend API Implementation

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Email**: SendGrid or AWS SES

### API Structure

```
backend/
├── server.js
├── config/
│   ├── database.js
│   ├── aws.js
│   └── email.js
├── models/
│   ├── User.js
│   ├── Delivery.js
│   ├── Invoice.js
│   └── AuditLog.js
├── routes/
│   ├── auth.js
│   ├── deliveries.js
│   ├── invoices.js
│   ├── users.js
│   ├── analytics.js
│   └── upload.js
├── controllers/
├── middleware/
│   ├── auth.js
│   └── roleCheck.js
└── utils/
    ├── pricingCalculator.js
    ├── invoiceGenerator.js
    └── emailService.js
```

### MongoDB Schemas

```javascript
// models/Delivery.js
const DeliverySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    spoNumber: { type: String, required: true },
    status: { type: String, enum: ['received', 'allocated', 'delivered', 'cancelled'] },
    date: Date,
    timeSlot: { type: String, enum: ['AM', 'PM'] },
    weight: Number,
    deliveryAddress: String,
    customerPhone: String,
    specificInstructions: String,
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pricing: {
      basePrice: Number,
      distanceSurcharge: Number,
      extraCharges: [
        {
          type: String,
          description: String,
          amount: Number,
        },
      ],
      subtotal: Number,
      vat: Number,
      total: Number,
    },
    proofOfDelivery: {
      signatureUrl: String,
      photoUrl: String,
      receivedBy: String,
      driverNotes: String,
      completedAt: Date,
    },
    auditLog: [
      {
        action: String,
        userId: mongoose.Schema.Types.ObjectId,
        timestamp: Date,
        details: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);
```

### API Endpoints Summary

```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/change-password

Deliveries:
GET    /api/deliveries
POST   /api/deliveries
GET    /api/deliveries/:id
PUT    /api/deliveries/:id
DELETE /api/deliveries/:id
PUT    /api/deliveries/:id/status
PUT    /api/deliveries/:id/allocate
POST   /api/deliveries/:id/complete
GET    /api/deliveries/customer/:customerId

Invoices:
GET    /api/invoices
POST   /api/invoices/generate-weekly
GET    /api/invoices/:id
PUT    /api/invoices/:id
GET    /api/invoices/customer/:customerId

Users:
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

Analytics:
GET    /api/analytics/revenue
GET    /api/analytics/deliveries
GET    /api/analytics/drivers
GET    /api/analytics/customers

Upload:
POST   /api/upload/signature
POST   /api/upload/photo
POST   /api/upload/profile-photo

Pricing:
POST   /api/pricing/calculate
GET    /api/pricing/distance

Email:
POST   /api/email/send
```

---

## ✅ Testing Checklist

### Phase 2 Testing

- [ ] Customer can submit delivery request
- [ ] Price calculates correctly based on weight/distance
- [ ] Same-day delivery shows correct message
- [ ] Additional delivery option works
- [ ] Admin sees new bookings in "Received"
- [ ] Admin can allocate driver
- [ ] Driver sees assigned delivery
- [ ] Driver can capture signature
- [ ] Driver can upload photo
- [ ] Delivery marked as complete
- [ ] Customer receives proof email

### Phase 3 Testing

- [ ] Admin analytics show correct data
- [ ] Charts display properly
- [ ] Area Manager has read-only access
- [ ] Driver analytics track performance
- [ ] Export to CSV/PDF works

### Phase 4 Testing

- [ ] All email templates work
- [ ] Attachments included in emails
- [ ] Weekly invoice generation runs
- [ ] Driver feedback summary sent

---

## 📝 Environment Setup

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

### Backend (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/m19logistics
JWT_SECRET=your_secret_here
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=m19-logistics
SENDGRID_API_KEY=your_key
GOOGLE_MAPS_API_KEY=your_key
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy dist/ folder
```

### Backend (AWS EC2/Heroku)

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name "m19-api"

# Setup NGINX reverse proxy
# Configure SSL with Let's Encrypt
```

### Database (MongoDB Atlas)

- Use managed MongoDB Atlas for production
- Set up automated backups
- Configure connection string in backend .env

---

## 📞 Support & Maintenance

### Regular Tasks

- Weekly invoice generation (automated)
- Database backups (daily)
- Monitor error logs
- Update dependencies monthly
- Review user feedback

### Key Contacts

- **Client**: M19 Logistics
- **Email**: admin@m19logistics.com
- **Phone**: 07971 415430

---

**Document Version**: 1.0  
**Last Updated**: January 14, 2026  
**Status**: Implementation Guide Complete
