# Tenant-Specific Dashboards

Each tenant has their own customized dashboard with individual branding and features.

---

## 📁 Structure

```
dashboards/
├── tenant_esr/              # Event Screen Rentals
│   ├── pages/
│   │   └── index.html      # Dashboard page
│   ├── css/
│   │   └── dashboard.css   # ESR branding (Red theme)
│   └── js/
│       └── dashboard.js    # ESR functionality
│
└── tenant_cmh/              # ClipMyHorse.TV
    ├── pages/
    │   └── index.html      # Dashboard page
    ├── css/
    │   └── dashboard.css   # CMH branding (Purple/Blue theme)
    └── js/
        └── dashboard.js    # CMH functionality
```

---

## 🎨 Tenant Branding

### Event Screen Rentals (ESR)

**Theme:** Red/Orange (Event Technology)
- Primary Color: `#dc2626` (Red)
- Logo: ESR text badge
- Focus: Equipment rental, customer management
- Navigation: Dashboard, Equipment, Bookings, Customers, Team, Reports

### ClipMyHorse.TV (CMH)

**Theme:** Purple/Blue (Media/Sports)
- Primary Color: `#7c3aed` (Purple)
- Logo: Layers icon (broadcast)
- Focus: Broadcasting, live streaming, productions
- Navigation: Dashboard, Cameras, Productions, Live Streaming, Team, Schedule

---

## 🔐 Access Control

Each dashboard:
- Validates session on load
- Checks tenant_id matches
- Redirects to login if unauthorized
- Loads data via Backend API

---

## 🚀 Adding New Tenant Dashboard

1. Create folder: `dashboards/tenant_xxx/`
2. Copy template files from existing tenant
3. Update `tenant_xxx/dashboard.js`:
   - Change `TENANT_ID`
   - Update branding
4. Update `tenant_xxx/dashboard.css`:
   - Change color variables
   - Customize theme
5. Login system auto-redirects based on tenant_id

---

## 🎯 Features

**Currently Implemented:**
- ✅ Authentication check
- ✅ Tenant validation
- ✅ User info display
- ✅ Equipment loading from API
- ✅ Statistics dashboard
- ✅ Logout functionality
- ✅ Responsive design

**Coming Soon:**
- ⏳ Equipment CRUD
- ⏳ Booking calendar
- ⏳ User management
- ⏳ Data export UI
- ⏳ Real-time updates

---

**VBS Visionary Broadcast Services**

