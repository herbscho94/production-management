# Production Management Platform - Complete System Documentation

**VBS Visionary Broadcast Services**  
**Version:** 1.0.0  
**Created:** October 14, 2025  
**Status:** Development - Multi-Tenant SaaS Platform

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Multi-Tenant Structure](#multi-tenant-structure)
4. [Current Tenants](#current-tenants)
5. [Login System](#login-system)
6. [File Structure](#file-structure)
7. [Data Models](#data-models)
8. [Security & Access Control](#security--access-control)
9. [API Architecture (Planned)](#api-architecture-planned)
10. [Development Decisions](#development-decisions)
11. [Next Steps](#next-steps)

---

## 🎯 System Overview

### What is the Production Management Platform?

A **cloud-based SaaS solution** for managing production equipment, teams, schedules, and budgets across the entire media industry - from TV stations and film crews to YouTubers and equipment rental companies.

### Key Characteristics

- ☁️ **Cloud-Based Service** - Accessible from anywhere
- 🏢 **Multi-Tenant Architecture** - Each customer has isolated data
- 📥 **Data Export** - Full transparency with downloadable data
- 🔒 **Secure & Scalable** - Enterprise-grade security
- 📱 **Fully Responsive** - Desktop, tablet, and mobile support

### Target Users

1. **TV Stations** - Manage broadcast equipment and crews
2. **Film Production Companies** - Track cameras, lighting, audio gear
3. **YouTubers/Content Creators** - Organize production resources
4. **Equipment Rental Companies** - Manage inventory and customer rentals

---

## 🏗️ Architecture

### Business Model: SaaS (Software as a Service)

**Decision made on:** October 14, 2025

**Why SaaS instead of local installation:**
- ✅ Recurring revenue (monthly/yearly subscriptions)
- ✅ Centralized updates (all customers get updates simultaneously)
- ✅ No support nightmare with local installations
- ✅ Scalable (1 server for thousands of customers)
- ✅ Easy to control access and licensing
- ✅ No customer-side maintenance required

**Customer Benefits:**
- Access from anywhere with internet
- No installation or maintenance needed
- Always up-to-date
- Full data export capability
- Transparent data storage

### Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- No frameworks (lightweight, fast)
- Responsive design (320px - 4K)

**Backend (Planned):**
- Node.js + Express.js
- PostgreSQL or MongoDB
- JWT-based authentication
- RESTful API

**Hosting (Planned):**
- Frontend: Vercel, Netlify, or Cloudflare Pages
- Backend: Railway, DigitalOcean, AWS, or Heroku
- Database: Managed service (e.g., Supabase, Railway)

---

## 🏢 Multi-Tenant Structure

### Concept

Each customer (tenant) has:
- ✅ Own isolated data folder
- ✅ Own user database
- ✅ Own equipment database
- ✅ Own projects, bookings, etc.
- ✅ No data mixing between tenants

### Directory Structure

```
data/
├── tenants.json                    # Central tenant registry
└── tenants/
    ├── tenant_esr/                 # Event Screen Rentals
    │   ├── users.json              # Users for ESR
    │   ├── equipment.json          # Equipment for ESR
    │   ├── projects.json           # Projects (future)
    │   └── bookings.json           # Bookings (future)
    └── tenant_cmh/                 # ClipMyHorse.TV
        ├── users.json              # Users for CMH
        ├── equipment.json          # Equipment for CMH
        ├── projects.json           # Projects (future)
        └── bookings.json           # Bookings (future)
```

### Tenant Registry (`tenants.json`)

**Purpose:** Central database of all customers/tenants

**Structure:**
```json
{
  "tenants": [
    {
      "tenant_id": "tenant_esr",
      "tenant_name": "Event Screen Rentals",
      "company_info": {
        "legal_name": "Event Screen Rentals",
        "country": "Germany",
        "city": "Berlin",
        "industry": "Event Technology & Screen Rental"
      },
      "subscription": {
        "plan": "pro",
        "status": "active",
        "users_limit": 50,
        "storage_gb": 200,
        "activated_at": "2025-10-14T00:00:00Z",
        "expires_at": "2026-10-14T00:00:00Z"
      },
      "data_path": "tenants/tenant_esr",
      "is_active": true
    }
  ]
}
```

**Key Fields:**
- `tenant_id`: Unique identifier (e.g., "tenant_esr")
- `data_path`: Where tenant data is stored
- `is_active`: Can tenant access the system?
- `subscription.status`: "active", "suspended", "cancelled"
- `subscription.users_limit`: Maximum users allowed
- `subscription.storage_gb`: Storage quota

---

## 🏢 Current Tenants

### Tenant 1: Event Screen Rentals

**Tenant ID:** `tenant_esr`  
**Location:** Berlin, Germany  
**Industry:** Event Technology & Screen Rental

**Subscription:**
- **Plan:** Basic
- **Active Users:** 5 / 10 (limit)
- **Storage:** 50 GB (included)
- **Monthly Cost:** 500 THB (€13 / $15)
- **Status:** Active
- **Next Billing:** November 14, 2025

**Admin Account:**
- **Username:** `admin@tenant_esr`
- **Password:** `ESR2025!Admin`
- **Role:** Administrator
- **Email:** admin@eventscreenrentals.com

**Business Focus:**
- Event technology rental
- Screen rentals for events
- External customer focus

**Configuration:**
- Rental: Enabled
- Internal Cost Calculation: Disabled
- Currency: EUR
- Tax Rate: 19%

---

### Tenant 2: ClipMyHorse.TV

**Tenant ID:** `tenant_cmh`  
**Location:** Hamburg, Germany  
**Industry:** Equestrian Sports Media & Broadcasting

**Subscription:**
- **Plan:** Standard
- **Active Users:** 12 / 20 (limit)
- **Storage:** 100 GB (included)
- **Monthly Cost:** 1,000 THB (€26 / $28)
- **Status:** Active
- **Next Billing:** November 14, 2025

**Admin Account:**
- **Username:** `admin@tenant_cmh`
- **Password:** `CMH2025!Admin`
- **Role:** Administrator
- **Email:** admin@clipmyhorse.tv

**Business Focus:**
- Equestrian sports broadcasting
- Live event streaming
- Video production and editing
- Internal equipment management

**Configuration:**
- Rental: Disabled (internal use only)
- Internal Cost Calculation: Enabled
- Currency: EUR
- Tax Rate: 19%

**Special Roles:**
- Producer (with streaming management)
- Camera Operator
- Editor (video editing)
- Admin (full access)

---

## 🔐 Login System

### Multi-Tenant Login Flow

**Username Format:**
```
username@tenant_id
```

**Examples:**
- `admin@tenant_esr` - Event Screen Rentals Admin
- `admin@tenant_cmh` - ClipMyHorse.TV Admin

### Login Process

```
1. User enters: "admin@tenant_esr" + password
   ↓
2. System parses username
   - username = "admin"
   - tenant_id = "tenant_esr"
   ↓
3. System loads tenants.json
   ↓
4. System validates tenant_esr exists and is active
   ↓
5. System loads data/tenants/tenant_esr/users.json
   ↓
6. System finds user with username "admin@tenant_esr"
   ↓
7. System validates password
   ↓
8. Session created with tenant_id stored
   ↓
9. Dashboard loads only data from tenant_esr folder
```

### Security Features

**Login Protection:**
- Maximum 5 failed attempts
- 5-minute lockout after failed attempts
- Account-specific lockout (per username)

**Session Management:**
- Standard: 24 hours validity
- "Remember Me": 30 days validity
- Session stored in localStorage
- Session includes tenant_id for isolation

**Password Validation:**
- Real password comparison (not demo mode)
- Passwords stored in tenant's users.json
- Future: bcrypt/Argon2 hashing

### Login Page Features

**Design:**
- 2-column layout (Login left, Marketing right)
- Overlapping design (Promo box slightly behind login)
- VBS logo from official website
- Gradient background with floating circles
- Professional VBS branding

**Marketing Section:**
- Header image (production scene)
- VBS Platform badge
- 3 key features with icons:
  1. Cloud-Based Service - Access anywhere
  2. Export Anytime - Download complete data
  3. Full Transparency - See what's stored
- Call-to-Action buttons:
  - "Become a Customer" → VBS website
  - "Try Free Demo" → Demo accounts

**Footer:**
- Fixed white bar at bottom
- Full width, minimal height
- Left: © 2025 VBS Visionary Broadcast Services
- Right: Visit VBS | Privacy | Terms | Support
- Responsive (stacks on mobile)

---

## 📁 File Structure

```
Produktionsplanung/
├── index.html                      # Login page (entry point)
├── dashboard.html                  # Dashboard (to be developed)
│
├── css/
│   └── login.css                   # Login page styles (1083 lines)
│
├── js/
│   ├── login.js                    # Original single-tenant login (legacy)
│   └── login-multitenant.js        # Active multi-tenant login
│
├── data/
│   ├── tenants.json                # Central tenant registry
│   └── tenants/
│       ├── tenant_esr/             # Event Screen Rentals
│       │   ├── users.json          # 1 Admin user
│       │   └── equipment.json      # Equipment database
│       └── tenant_cmh/             # ClipMyHorse.TV
│           ├── users.json          # 1 Admin user
│           └── equipment.json      # Equipment database
│
└── doc/
    ├── DOCUMENTATION.md            # Equipment system docs (legacy)
    ├── USERS_DOCUMENTATION.md      # User system docs (legacy)
    ├── LOGIN_README.md             # Login docs (legacy)
    └── MULTI_TENANT_GUIDE.md       # Multi-tenant guide (legacy)
```

**Note:** Legacy documentation files reference old single-tenant structure. This document (SYSTEM_DOCUMENTATION.md) is the current reference.

---

## 📊 Data Models

### 1. Tenant Model (`tenants.json`)

```json
{
  "tenant_id": "tenant_esr",           // Unique identifier
  "tenant_name": "Event Screen Rentals", // Display name
  "company_info": {
    "legal_name": "...",               // Official company name
    "country": "Germany",
    "city": "Berlin",
    "industry": "..."                  // Business sector
  },
  "subscription": {
    "plan": "pro",                     // basic, pro, enterprise
    "status": "active",                // active, suspended, cancelled
    "users_limit": 50,                 // Max users allowed
    "storage_gb": 200,                 // Storage quota
    "activated_at": "2025-10-14T...",  // Subscription start
    "expires_at": "2026-10-14T..."     // Subscription end
  },
  "data_path": "tenants/tenant_esr",   // Where data is stored
  "is_active": true,                   // Overall active status
  "created_at": "2025-10-14T..."       // When tenant was created
}
```

### 2. User Model (Tenant-specific)

**File:** `data/tenants/{tenant_id}/users.json`

```json
{
  "tenant_id": "tenant_esr",           // Links to tenant
  "config": {
    "roles": [...]                     // Tenant-specific roles
  },
  "users": [
    {
      "user_id": 1,                    // Unique within tenant
      "tenant_id": "tenant_esr",       // Belongs to this tenant
      "user_type": "employee",         // or "customer"
      "personal_info": {
        "first_name": "...",
        "last_name": "...",
        "position": "...",
        "department": "...",           // Employees only
        "employee_number": "...",      // Employees only
        "company": "..."               // Customers only
      },
      "contact_info": {
        "email": "...",
        "phone": "...",
        "mobile": "..."                // Optional
      },
      "access_credentials": {
        "username": "admin@tenant_esr", // Full format with tenant
        "password": "...",             // Plain text (temp), use hashing later
        "role": "admin",
        "permissions": [...],
        "is_active": true,
        "last_login": "...",
        "created_at": "..."
      },
      "address": {...},                // Customers only
      "billing_info": {...},           // Customers only
      "notes": "..."
    }
  ]
}
```

### 3. Equipment Model (Tenant-specific)

**File:** `data/tenants/{tenant_id}/equipment.json`

```json
{
  "tenant_id": "tenant_esr",
  "tenant_name": "Event Screen Rentals",
  "config": {
    "allow_rental": true,              // Can rent to external customers?
    "calculate_internal_costs": false, // Charge internal departments?
    "currency": "EUR",
    "tax_rate": 19.0
  },
  "equipment": [
    {
      "id": 1,                         // Unique within tenant
      "tenant_id": "tenant_esr",       // Belongs to this tenant
      "name": "Sony A7 IV Camera",
      "type": "DSLR",
      "status": "available",           // available, in_use, maintenance
      "location": "Studio 1",
      "usage_info": [
        {
          "usage_type": "internal",    // or "rental"
          "is_active": true,
          "user_id": 1,                // References user within tenant
          "start_date": "2025-10-13",
          "end_date": "2025-10-14",
          "price_per_day": null,       // null for internal
          "description": "..."
        }
      ],
      "technical_data": {
        "resolution": "4K",
        "weight_kg": 0.8,
        "battery_life_min": 120,
        "accessories": [...]
      }
    }
  ]
}
```

---

## 🔐 Security & Access Control

### Tenant Isolation

**Critical Security Rule:**
> Users can ONLY access data from their own tenant. Never allow cross-tenant queries.

**Implementation:**
1. Session stores `tenant_id`
2. All API calls validate `tenant_id` matches session
3. Database queries always filter by `tenant_id`
4. File system enforces separation (separate folders)

### User Roles & Permissions

**Administrator:**
- Full access to all features
- User management
- Equipment management
- Financial overview
- System settings

**Operator:**
- Equipment booking and maintenance
- Project access
- No user management
- No financial access

**Editor:**
- Equipment booking (view only)
- Project access
- Basic internal resources

**Customer:**
- Rental booking
- Invoice view
- Limited to customer features

**Producer (ClipMyHorse.TV specific):**
- Equipment booking
- Streaming management
- Video production
- Project access

### Password Security

**Current Status:** Plain text passwords in JSON (DEVELOPMENT ONLY)

**For Production:**
1. Use bcrypt or Argon2 for hashing
2. Never store plain text passwords
3. Implement password reset flow
4. Add password strength requirements
5. Enforce password expiration (optional)

---

## 🎨 Login Page Design

### Layout (Desktop > 1200px)

```
┌────────────────────────────────────────────────────┐
│  Gradient Background with Floating Circles         │
│                                                     │
│  ┌──────────────┐  ┌─────────────────────┐         │
│  │ VBS Logo     │  │ [Production Image]  │         │
│  │ Platform     │  │ VBS Platform Badge  │         │
│  │              │  └─────────────────────┘         │
│  │ Username     │  │ Marketing Copy      │         │
│  │ Password     │  │ • Cloud-Based       │         │
│  │ [Remember]   │  │ • Export Data       │         │
│  │ [Sign In]    │  │ • Transparency      │         │
│  └──────────────┘  │ [Become Customer]   │         │
│         ↑          │ [Try Free Demo]     │         │
│      z-index: 2    └─────────────────────┘         │
│                            ↑                        │
│                         z-index: 1                  │
│  Login overlaps promo (60px left, 40px down)       │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│  White Footer Bar (Full Width)                     │
│  © 2025 VBS | Visit VBS | Privacy | Terms | Support│
└────────────────────────────────────────────────────┘
```

### Responsive Behavior

**Desktop (>1200px):**
- 2 columns side by side
- Login overlaps promo box
- Full marketing content visible

**Tablet (768-1200px):**
- Stacked vertically
- No overlap
- Login on top, promo below

**Mobile (<768px):**
- Single column
- Smaller fonts
- Compact footer
- Touch-optimized buttons

### Design Elements

**Colors:**
- Primary: `#2563eb` (Blue)
- Background: Gradient `#667eea` to `#764ba2`
- Surface: White `#ffffff`
- Text: Dark slate `#1e293b`

**Animations:**
- Login box: Slide from top
- Promo box: Slide from right
- Background circles: Floating animation
- Hover effects: Lift up slightly

**VBS Logo:**
- Source: `https://assets.zyrosite.com/.../logo-m7V5P47jzjSxjanZ.png`
- Fallback: Gradient box with "VBS" text
- Animation: Gentle float (up/down)
- Size: 120x80px (desktop), 100x60px (mobile)

---

## 📝 Development Decisions Log

### October 14, 2025

**1. Language: English**
- All UI text in English
- German initially proposed, changed to English
- Reason: International platform, broader market

**2. Platform Name: "Production Management Platform"**
- Originally: "Produktionsplanung"
- Changed to: "Production Management Platform"
- More descriptive and professional

**3. Business Model: SaaS (not local installation)**
- Initially considered: Local Raspberry Pi installation
- Changed to: Cloud-based SaaS
- Reason: 
  - Easier to manage and update
  - Recurring revenue model
  - No customer-side maintenance
  - Better control over licensing

**4. Multi-Tenant Architecture**
- Decision: Each customer gets isolated data
- Implementation: Separate folders per tenant
- Login format: `username@tenant_id`
- Reason: Scalability, data isolation, security

**5. Data Export Feature**
- Customers can download complete data anytime
- Transparency: See exactly what's stored
- Prevents vendor lock-in
- Builds trust

**6. Demo Accounts Removed**
- Initially: Demo account info shown on login page
- Changed: Removed all demo displays
- Reason: Professional appearance, use marketing CTAs instead
- Demo users still exist in test tenants for development

**7. VBS Branding**
- Full VBS branding throughout
- Footer links to vbs-broadcast.com
- Professional media production positioning
- "Innovative Media Production Solutions" tagline

**8. Marketing Focus**
- "One management platform for the entire media industry"
- Target: TV stations, film crews, YouTubers, rental companies
- Features: Plan productions, manage gear, track teams, schedules, budgets

---

## 🚀 API Architecture (Planned)

### Base URL
```
https://api.vbs-production-management.com/v1
```

### Authentication

**POST /auth/login**
```json
Request:
{
  "username": "admin@tenant_esr",
  "password": "ESR2025!Admin"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "tenant_id": "tenant_esr",
    "tenant_name": "Event Screen Rentals",
    "role": "admin",
    "permissions": [...]
  },
  "expires_at": "2025-10-15T12:00:00Z"
}
```

### Tenant Management (VBS Admin Only)

**GET /admin/tenants**
- List all tenants
- Only VBS administrators

**POST /admin/tenants**
- Create new tenant
- Auto-generates folder structure
- Sets up initial admin user

**PUT /admin/tenants/:tenant_id**
- Update tenant subscription
- Change limits, expiration, status

### User Management (Tenant-specific)

**GET /tenants/:tenant_id/users**
- List all users in tenant
- Requires: User belongs to this tenant

**POST /tenants/:tenant_id/users**
- Create new user in tenant
- Auto-formats username with @tenant_id
- Validates against users_limit

**PUT /tenants/:tenant_id/users/:user_id**
- Update user details
- Change role, permissions, status

**DELETE /tenants/:tenant_id/users/:user_id**
- Deactivate user (set is_active: false)
- Never actually delete (preserve history)

### Equipment Management (Tenant-specific)

**GET /tenants/:tenant_id/equipment**
- List all equipment
- Filter by status, type, location

**POST /tenants/:tenant_id/equipment**
- Add new equipment
- Upload images (optional)

**PUT /tenants/:tenant_id/equipment/:eq_id**
- Update equipment details
- Change status, location

### Data Export

**GET /tenants/:tenant_id/export/full**
- Downloads complete tenant data
- Format: ZIP file with all JSON files
- Includes: users, equipment, projects, bookings

**GET /tenants/:tenant_id/export/users**
- Export only users as JSON

**GET /tenants/:tenant_id/export/equipment**
- Export only equipment as JSON

### Request Headers

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
X-Tenant-ID: tenant_esr
X-API-Version: 1.0.0
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": {...},
  "metadata": {
    "timestamp": "2025-10-14T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid credentials",
    "details": "Username or password incorrect"
  },
  "metadata": {
    "timestamp": "2025-10-14T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## 🔧 Configuration Files

### Login Configuration (`js/login-multitenant.js`)

```javascript
const CONFIG = {
    tenantsDataPath: './data/tenants.json',
    sessionStorageKey: 'vbs_production_management_session',
    dashboardUrl: './dashboard.html',
    maxLoginAttempts: 5,
    lockoutDuration: 300000  // 5 minutes
};
```

### Tenant Configuration

Each tenant can have different settings in their files:

**Event Screen Rentals:**
- Rental: Enabled (external customers)
- Internal costs: Disabled (free for employees)
- Focus: B2B equipment rental

**ClipMyHorse.TV:**
- Rental: Disabled (internal only)
- Internal costs: Enabled (department tracking)
- Focus: Live streaming production

---

## 📱 Responsive Design Breakpoints

### Desktop (>1200px)
- Full 2-column layout
- Overlap effect active
- Content max-width: 1200px
- Footer horizontal layout

### Large Tablet (769-1200px)
- Stacked layout (login above promo)
- No overlap
- Max-width: 600px centered
- Footer horizontal

### Mobile (481-768px)
- Single column
- Footer height: 70px
- Compact padding
- Footer stacks vertically

### Small Mobile (<480px)
- Extra compact
- Footer height: 60px
- Smaller fonts
- Minimal padding

---

## 🎯 Next Steps / Roadmap

### Phase 1: Backend Development ⏳

**Priority: High**

1. **API Server Setup**
   - Node.js + Express.js
   - PostgreSQL database
   - JWT authentication
   - Tenant middleware

2. **Core API Endpoints**
   - Auth (login, logout, refresh)
   - Users CRUD
   - Equipment CRUD
   - Tenant management (admin)

3. **Database Schema**
   - Tenants table
   - Users table (with tenant_id foreign key)
   - Equipment table (with tenant_id foreign key)
   - Sessions table
   - Audit logs table

4. **Migration**
   - JSON to Database migration script
   - Preserve all existing data
   - Update frontend to use API

### Phase 2: Dashboard Development ⏳

**Priority: High**

1. **Dashboard Layout**
   - Sidebar navigation
   - Tenant name in header
   - User profile dropdown
   - Logout functionality

2. **Equipment Module**
   - List view with filters
   - Detail view
   - Add/Edit forms
   - Image upload
   - Status management

3. **User Module** (Admin only)
   - User list
   - Add/Edit users
   - Role assignment
   - Deactivate users

4. **Booking Module**
   - Calendar view
   - Create booking
   - Conflict detection
   - Approval workflow

### Phase 3: Advanced Features ⏳

**Priority: Medium**

1. **Projects Management**
   - Project creation
   - Equipment assignment
   - Team assignment
   - Budget tracking

2. **Reporting & Analytics**
   - Equipment utilization
   - User activity
   - Revenue reports (for rentals)
   - Export to Excel/PDF

3. **Notifications**
   - Email notifications
   - Booking reminders
   - Maintenance alerts
   - Subscription expiration warnings

### Phase 4: Production Features ⏳

**Priority: Medium**

1. **Data Export Interface**
   - One-click full export
   - Scheduled exports
   - Export history
   - Custom date ranges

2. **Billing & Invoicing**
   - Invoice generation
   - Payment tracking
   - Stripe integration
   - Automatic billing

3. **Mobile App**
   - React Native or Flutter
   - Quick bookings
   - Equipment QR scanning
   - Push notifications

### Phase 5: Enterprise Features ⏳

**Priority: Low**

1. **Advanced Permissions**
   - Custom roles per tenant
   - Granular permissions
   - Time-based access

2. **Integrations**
   - Calendar sync (Google, Outlook)
   - Accounting software
   - Slack/Teams notifications

3. **Multi-Language**
   - English (current)
   - German
   - Spanish
   - French

---

## 🛠️ Development Guidelines

### Adding New Tenant

**Manual Process (Current):**

1. Create tenant folder:
   ```bash
   mkdir -p data/tenants/tenant_new
   ```

2. Create users.json:
   ```bash
   cp data/tenants/tenant_esr/users.json data/tenants/tenant_new/users.json
   ```

3. Edit users.json:
   - Change tenant_id to "tenant_new"
   - Update admin credentials
   - Clear existing users except admin

4. Create equipment.json:
   ```bash
   cp data/tenants/tenant_esr/equipment.json data/tenants/tenant_new/equipment.json
   ```

5. Edit equipment.json:
   - Change tenant_id to "tenant_new"
   - Clear equipment array

6. Register in tenants.json:
   - Add new tenant object
   - Set subscription details
   - Set is_active: true

**Automated Process (Future):**
- API endpoint: POST /admin/tenants
- Auto-generates folder structure
- Creates initial admin user
- Sends welcome email

### Tenant Naming Convention

- **Format:** `tenant_{abbreviation}`
- **Examples:**
  - `tenant_esr` - Event Screen Rentals
  - `tenant_cmh` - ClipMyHorse.TV
  - `tenant_vbs` - VBS internal (if needed)

### User ID Allocation

**Per Tenant:**
- Start from 1 for each tenant
- Increment sequentially
- OK to have user_id=1 in multiple tenants
- Global uniqueness through (tenant_id + user_id)

### Username Format

**Full Format (for login):**
```
username@tenant_id
```

**Storage Format (in users.json):**
```json
{
  "username": "admin@tenant_esr"
}
```

**Display Format (in UI):**
```
Admin ESR (Event Screen Rentals)
```

---

## 📊 Subscription Plans & Pricing

### Fixed Plans with Included Storage

**Simple, all-inclusive pricing** - Users and storage bundled together.

All features included in every plan. No restrictions.

| Plan | Users | Storage | THB/month | EUR/month | USD/month |
|------|-------|---------|-----------|-----------|-----------|
| **Starter** | 1 | 1 GB | 100 THB | €3 | $3 |
| **Basic** | 10 | 50 GB | 500 THB | €13 | $15 |
| **Standard** | 20 | 100 GB | 1,000 THB | €26 | $28 |
| **Professional** | 50 | 500 GB | 1,500 THB | €39 | $43 |
| **Elite** | 100 | 1 TB | 2,500 THB | €66 | $72 |

### What's Included (All Plans)

- ✅ Production planning & scheduling
- ✅ Equipment management & tracking
- ✅ Budget & cost tracking
- ✅ Team & personnel management
- ✅ User roles & permissions
- ✅ Booking system
- ✅ Rental management
- ✅ API access
- ✅ Data export (full transparency)
- ✅ Email support
- ✅ Regular updates
- ✅ Secure cloud storage (included)

### Plan Details

**Starter (100 THB/month):**
- Perfect for freelancers or individual creators
- 1 user account
- 1 GB storage
- All core features

**Basic (500 THB/month):**
- Small teams & production companies
- Up to 10 users
- 50 GB storage
- Ideal for starting out

**Standard (1,000 THB/month):**
- Growing production teams
- Up to 20 users
- 100 GB storage
- Most popular choice

**Professional (1,500 THB/month):**
- Larger production companies
- Up to 50 users
- 500 GB storage
- Advanced needs

**Elite (2,500 THB/month):**
- Enterprise-level organizations
- Up to 100 users
- 1 TB storage
- Full-scale operations

### Currency & Billing

**Primary Currency:** Thai Baht (THB)  
**Invoicing:** Available in THB, EUR, or USD  
**Exchange Rates:** Updated daily at billing time  
**Reference Rates:**
- 1 EUR ≈ 38 THB
- 1 USD ≈ 35 THB

**Billing Cycle:** Monthly (auto-renewal)  
**Payment Methods:** Credit card, PayPal, Bank transfer

### Pricing Highlights

✅ **All-Inclusive** - Users + Storage in one price  
✅ **Simple & Clear** - No hidden costs  
✅ **Scalable** - Upgrade/downgrade anytime  
✅ **All Features** - No feature restrictions  
✅ **Fair Pricing** - Transparent markup

---

## 🔄 Migration Notes

### From Single-Tenant to Multi-Tenant

**What Changed:**

1. **Deleted Files:**
   - `data/Users.json` → Moved to tenant folders
   - `data/Equipment.json` → Moved to tenant folders

2. **New Files:**
   - `data/tenants.json` (central registry)
   - `data/tenants/{tenant_id}/users.json`
   - `data/tenants/{tenant_id}/equipment.json`
   - `js/login-multitenant.js`

3. **Modified Files:**
   - `index.html` - Now uses login-multitenant.js
   - Username placeholder - Shows `username@tenant_id`

4. **Username Format:**
   - Old: `j.miller`
   - New: `j.miller@tenant_esr`

### Backward Compatibility

The old `login.js` file is kept as backup but not used. To revert to single-tenant:

1. Restore old Users.json and Equipment.json
2. Change index.html to use login.js
3. Remove @tenant_id from usernames

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **No Real Backend**
   - Currently using JSON files
   - Need proper database for production
   - No real-time updates between users

2. **Password Security**
   - Plain text passwords (DEVELOPMENT ONLY)
   - Must implement hashing before production

3. **No File Uploads**
   - No equipment images yet
   - No document attachments
   - Need cloud storage integration

4. **No Email System**
   - No password reset
   - No notifications
   - Need SMTP integration

5. **No Backup System**
   - Manual backups only
   - Need automated backup strategy

### Planned Fixes

- [ ] Implement PostgreSQL backend
- [ ] Add bcrypt password hashing
- [ ] Integrate AWS S3 for file uploads
- [ ] Add SendGrid for emails
- [ ] Automated daily backups

---

## 📞 Support & Maintenance

### System Maintenance

**Tenant Status Changes:**
- Subscription expires → Set `subscription.status: "suspended"`
- Customer cancels → Set `is_active: false`
- Customer renews → Update `expires_at` date

**User Management:**
- Employee leaves → Set `is_active: false`
- Never delete users (preserve booking history)
- Inactive users don't count toward license limit

**Data Cleanup:**
- Archive old bookings (>2 years)
- Compress old logs
- Maintain performance

### Monitoring (Future)

**Key Metrics:**
- Active tenants count
- Total users per tenant
- Storage usage per tenant
- API calls per tenant/day
- Error rates
- Response times

### Backup Strategy (Future)

**Daily:**
- All tenant data folders
- Database dump
- Configuration files

**Weekly:**
- Full system backup
- Long-term storage

**Monthly:**
- Archive to cold storage
- Compliance reports

---

## 📚 Additional Documentation

### Related Files

- `doc/DOCUMENTATION.md` - Equipment system (legacy, single-tenant)
- `doc/USERS_DOCUMENTATION.md` - User system (legacy, single-tenant)
- `doc/LOGIN_README.md` - Login page (legacy, single-tenant)
- `doc/MULTI_TENANT_GUIDE.md` - Multi-tenant basics (demo data)

**Note:** This file (SYSTEM_DOCUMENTATION.md) supersedes all others as the primary reference for the current multi-tenant system.

### Creating New Documentation

When adding features, document:
- Purpose and use case
- API endpoints (if applicable)
- Data model changes
- Security considerations
- Migration path (if breaking changes)

---

## 🎓 Training & Onboarding

### For VBS Team

**Understanding Multi-Tenant:**
1. Read this document completely
2. Review tenant structure in data/tenants/
3. Test login with both tenants
4. Understand session isolation

**Development:**
1. Always test with multiple tenants
2. Never hard-code tenant_id
3. Always validate tenant access
4. Use provided API patterns

### For Customers

**Getting Started:**
1. Receive credentials: `username@tenant_id` + password
2. Login at production-management.vbs-broadcast.com
3. Complete profile setup
4. Add team members (if admin)
5. Import existing equipment

**Admin Tasks:**
1. User management
2. Equipment setup
3. Configure booking rules
4. Set up departments/locations

---

## 📄 License & Copyright

**© 2025 VBS Visionary Broadcast Services**

**Website:** https://www.vbs-broadcast.com/  
**Location:** Bangkok, Thailand  
**Email:** support@vbs-broadcast.com

**Proprietary Software:**
- All rights reserved
- Unauthorized copying, distribution, or use is strictly prohibited
- Licensed to customers via subscription

---

## ✅ System Status

**Current State:**
- ✅ Login system fully functional
- ✅ Multi-tenant architecture implemented
- ✅ 2 real tenants configured (ESR, CMH)
- ✅ VBS branding complete
- ✅ Responsive design complete
- ✅ **Backend API fully implemented (Python FastAPI)**
- ⏳ Dashboard (not started)
- ⏳ Equipment management UI (not started)

**Last Updated:** October 14, 2025  
**By:** VBS Development Team  
**Document Version:** 1.0.0

---

## 🔍 Quick Reference

### Test Logins

```
Event Screen Rentals:
Username: admin@tenant_esr
Password: ESR2025!Admin

ClipMyHorse.TV:
Username: admin@tenant_cmh
Password: CMH2025!Admin
```

### Important URLs

```
Login Page: /index.html
Dashboard: /dashboard.html (to be created)
VBS Website: https://www.vbs-broadcast.com/
```

### Key Files

```
Tenant Registry: data/tenants.json
ESR Users: data/tenants/tenant_esr/users.json
CMH Users: data/tenants/tenant_cmh/users.json
Login Logic: js/login-multitenant.js
Styles: css/login.css
```

---

**END OF DOCUMENTATION**

