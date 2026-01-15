# 🚚 M19 Logistics - Courier Management System

A comprehensive, full-stack courier management system built with React, Redux Toolkit, Tailwind CSS, and modern web technologies. This system provides role-based dashboards for Admins, Customers, Drivers, and Area Managers.

![M19 Logistics](./public/m19-logo.png)

## 🌟 Features

### Public Website

- ✅ Professional homepage with services showcase
- ✅ About Us page with company story
- ✅ Contact page with multiple contact methods
- ✅ General enquiries form
- ✅ 24/7 operations information

### Role-Based Dashboards

#### 👨‍💼 Admin Dashboard

- Complete booking management (Received → Allocated → Delivered → Cancelled)
- User management (Customers, Drivers, Admins, Area Managers)
- Pricing tier configuration
- Invoice generation and management
- Analytics and reporting
- Extra charges management

#### 📦 Customer Portal (Topps Tiles Stores)

- Submit delivery requests
- View delivery history with status tracking
- Access invoices
- View proof of delivery (signature + photo)
- Edit/cancel deliveries
- Add additional deliveries to existing bookings

#### 🚛 Driver Dashboard

- View assigned deliveries
- Capture signatures (HTML5 canvas)
- Upload delivery photos
- Add driver notes/feedback
- Mark deliveries complete
- Performance tracking

#### 📊 Area Manager Dashboard (Read-Only)

- View all store analytics
- Performance metrics across Topps stores
- Revenue and delivery trends
- Week-over-week comparisons

## 🔐 Demo Login Credentials

Test the system with these pre-loaded accounts:

| Role             | Username | Password      | Description                      |
| ---------------- | -------- | ------------- | -------------------------------- |
| **Admin**        | `admin`  | `admin123`    | Full system access               |
| **Customer**     | `T022`   | `Password022` | Topps Chester                    |
| **Customer**     | `T226`   | `Password226` | Topps Nantwich                   |
| **Customer**     | `T167`   | `Password167` | Topps Newcastle (Tier A pricing) |
| **Customer**     | `T143`   | `Password143` | Topps Northwich                  |
| **Customer**     | `T211`   | `Password211` | Topps Rhyl                       |
| **Customer**     | `T217`   | `Password217` | Topps Wrexham                    |
| **Driver**       | `BK01`   | `M1901`       | Driver BK                        |
| **Area Manager** | `Rob01`  | `Topps01`     | Rob Myers - Read-only analytics  |

_All customer passwords require reset on first login (feature to be implemented)_

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash

# Navigate to project directory

cd c:\\Users\\HP\\Downloads\\React-boilerplate-main\\m19logistics

# Install dependencies (if not already installed)

npm install

# Start development server

npm run dev
\`\`\`

The application will be available at `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
m19logistics/
├── src/
│ ├── context/
│ │ └── AuthContext.jsx # Authentication & authorization
│ ├── components/
│ │ └── ProtectedRoute.jsx # Role-based route protection
│ ├── data/
│ │ └── demoUsers.js # Demo accounts & pricing config
│ ├── pages/
│ │ ├── auth/
│ │ │ └── LoginView.jsx # Login page
│ │ ├── public/ # Public website pages
│ │ │ ├── public_Home/
│ │ │ ├── public_about/
│ │ │ ├── public_contact/
│ │ │ └── public_enquiries/
│ │ ├── dashboards/ # Role-specific dashboards
│ │ │ ├── admin/
│ │ │ ├── customer/
│ │ │ ├── driver/
│ │ │ └── area-manager/
│ │ └── error/ # Error pages
│ ├── router/
│ │ ├── router.jsx # Main routing config
│ │ └── layout/ # Layout components
│ ├── services/ # API services (for backend)
│ ├── utils/ # Helper functions
│ └── App.jsx # Root component
├── public/ # Static assets
├── PROJECT_STATUS.md # Detailed implementation status
└── README.md # This file
\`\`\`

## 🎨 Tech Stack

### Frontend

- **React 19** - Latest React with hooks
- **Redux Toolkit** - State management
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **React Toastify** - Toast notifications
- **Axios** - HTTP client

### To Be Implemented (Backend)

- **Node.js / Express** - REST API
- **MongoDB** - Database
- **Google Maps API** - Distance calculations
- **Email Service** - Notifications (SendGrid/AWS SES)
- **AWS S3** - File storage for signatures/photos

## 💰 Pricing System

### Tier-Based Pricing

- **Tier A**: £41.67 + VAT (£50.00 total) per 800kg block
  - Used by: Topps Newcastle
- **Tier B**: £37.50 + VAT (£45.00 total) per 800kg block
  - Used by: All other Topps stores

### Distance-Based Surcharges

- Base rate includes up to 45 miles
- For every additional 45 miles: Add 50% of base price per weight block
- Calculated using Google Maps Distance Matrix API

### Extra Charges

- Toll charges
- Extra runs
- Waiting time
- Weekend surcharges
- Custom charges (admin-configurable)

## 📧 Email Notifications

Automated emails for:

- Booking confirmation
- Delivery allocated to driver
- Delivery completed (with proof attached)
- Weekly invoices (PDF)
- Weekly driver feedback summary (to admin)

## 📋 Key Business Rules

1. **Same-Day Deliveries**: Cannot select AM/PM slot; requires phone confirmation
2. **Additional Deliveries**: Can be added to existing bookings (charged separately)
3. **Invoice Numbering**: Auto-increment (T0326, T0327, etc.)
4. **Weekly Invoicing**: All deliveries grouped by customer per week
5. **Delivery Status**: Received → Allocated → Delivered (or Cancelled)
6. **45-Mile Rule**: Deliveries beyond 45 miles prompt customer to call
7. **Proof of Delivery**: Signature + Photo + Received By name required

## 🔐 Security Features

- Role-based access control (RBAC)
- Protected routes with authentication
- Persistent sessions (localStorage)
- Password change on first login (to be implemented)
- Audit trails for all actions (to be implemented)

## 🎯 Current Implementation Status

### ✅ Phase 1 Complete

- Authentication & authorization system
- All public pages (Home, About, Contact, Enquiries)
- Navigation with role-aware menu
- M19-branded footer
- Dashboard frameworks for all roles
- Demo users pre-loaded

### 🚧 Phase 2 In Progress

- Customer delivery request form
- Admin booking management
- Driver delivery completion
- Pricing engine
- Invoice generation

### 📅 Phase 3 Planned

- Analytics dashboards
- Advanced reporting
- Email notifications
- Real-time updates

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed implementation status.

## 🧪 Testing the Application

1. **Public Pages**: Navigate through Home, About, Contact, Enquiries
2. **Login System**: Use any demo credential from the table above
3. **Admin Role**: Login as `admin` / `admin123`
   - View dashboard structure
   - Navigate through menu items
4. **Customer Role**: Login as `T022` / `Password022`
   - View customer portal
   - See depot-specific information
5. **Driver Role**: Login as `BK01` / `M1901`
   - View driver dashboard
   - See profile photo support
6. **Area Manager**: Login as `Rob01` / `Topps01`
   - View read-only analytics dashboard

## 📞 Contact Information

**M19 Logistics Limited**

- 📞 Phone: 07971 415430 / 01978 439739
- 📧 Email: enquiries@m19logistics.com
- 📧 Deliveries: deliveries@m19logistics.com
- 📧 Admin: admin@m19logistics.com
- 🏢 Location: Wrexham, United Kingdom
- 🏦 VAT Number: 447 5918 54

## 🔄 Development Workflow

### Available Scripts

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
npm run format # Format code with Prettier
\`\`\`

### Environment Variables

Create a `.env` file in the root:

\`\`\`env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_API_BASE_URL=http://localhost:3000/api
VITE_UPLOAD_URL=your_upload_endpoint
\`\`\`

## 🤝 Contributing

This is a client project for M19 Logistics. For development questions or feature requests, please contact the development team.

## 📄 License

Proprietary - © 2026 M19 Logistics Limited. All rights reserved.

## 🙏 Acknowledgments

- **Client**: M19 Logistics
- **Reference Website**: [SpeedyFreight.com](https://speedyfreight.com/)
- **Design**: Custom designed for M19 Logistics
- **Development**: MERN Stack Implementation

---

**Project Status**: Phase 1 Complete - Infrastructure & Public Pages  
**Last Updated**: January 14, 2026  
**Version**: 1.0.0-beta
