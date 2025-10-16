# Production Management Platform

**VBS Visionary Broadcast Services**  
*Innovative Media Production Solutions*

[![Status](https://img.shields.io/badge/status-development-yellow)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![Multi-Tenant](https://img.shields.io/badge/multi--tenant-enabled-green)]()

---

## 🚀 Quick Start

### Login to the Platform

Open `index.html` in your browser or start a local server:

```bash
python3 -m http.server 8000
# Then open: http://localhost:8000
```

### Test Credentials

**Event Screen Rentals:**
```
Username: admin@tenant_esr
Password: ESR2025!Admin
```

**ClipMyHorse.TV:**
```
Username: admin@tenant_cmh
Password: CMH2025!Admin
```

---

## 📖 Documentation

### Primary Documentation

**📘 [SYSTEM_DOCUMENTATION.md](./doc/SYSTEM_DOCUMENTATION.md)** ← **START HERE**

Complete system documentation including:
- Multi-tenant architecture
- Current tenants (ESR, CMH)
- Login system details
- API architecture
- Development decisions
- Roadmap

**🖥️ [SERVER_INSTALLATION.md](./doc/SERVER_INSTALLATION.md)** ← **SERVER DEPLOYMENT**

Complete Ubuntu server installation guide:
- Step-by-step installation
- Backend setup (Python/FastAPI)
- NGINX configuration
- SSL/HTTPS setup
- Troubleshooting
- Maintenance & updates

### Additional Documentation

- `doc/PROJECT_SUMMARY.md` - One-page project overview
- `doc/CHANGELOG.md` - Version history and changes

> 📚 All documentation is in the `doc/` folder for easy access.

---

## 🎯 What is This Platform?

One management platform for the **entire media industry** — from TV stations and film crews to YouTubers and equipment rentals.

**Manage Everything:**
- 📹 Equipment & gear
- 👥 Teams & personnel
- 📅 Schedules & bookings
- 💰 Budgets & costs
- 🎬 Projects & productions

**Cloud-Based Benefits:**
- Access from anywhere
- No installation needed
- Always up-to-date
- Full data export anytime
- Complete transparency

---

## 🏢 Current Tenants

### 1. Events Green Rentals ✨ NEW
- **Location:** Berlin, Germany
- **Industry:** LED Wall Rental for Events
- **Plan:** Basic (5/10 users, 50 GB)
- **Cost:** 500 THB/month (€13 / $15)
- **Tenant ID:** `tenant_esr`
- **Dashboard:** ✅ **Fully Operational** (LED Wall Management System)
  - 📅 Kalender & Buchungen
  - 🖥️ 2 LED-Wände (Premium 6x4m, Standard 4x3m)
  - 👥 CRM mit Kunden & Kommunikation
  - 📄 Angebote (Auto-Preisberechnung)
  - 💰 Rechnungen (Zahlungsstatus)

### 2. ClipMyHorse.TV
- **Location:** Hamburg, Germany
- **Industry:** Equestrian Sports Media & Broadcasting
- **Plan:** Standard (12/20 users, 100 GB)
- **Cost:** 1,000 THB/month (€26 / $28)
- **Tenant ID:** `tenant_cmh`
- **Dashboard:** ✅ Fully Operational (Production Equipment Management)

---

## 📁 Project Structure

```
Produktionsplanung/
├── index.html                  # Login page (ENTRY POINT)
├── SYSTEM_DOCUMENTATION.md     # Main documentation (READ THIS)
├── README.md                   # This file
│
├── css/
│   └── login.css              # Login page styles
│
├── js/
│   ├── login.js               # Legacy single-tenant (not used)
│   └── login-multitenant.js   # Active multi-tenant login ✓
│
├── data/
│   ├── tenants.json           # Central tenant registry
│   └── tenants/
│       ├── tenant_esr/        # Event Screen Rentals data
│       │   ├── users.json
│       │   └── equipment.json
│       └── tenant_cmh/        # ClipMyHorse.TV data
│           ├── users.json
│           └── equipment.json
│
└── doc/                       # Legacy documentation
    ├── DOCUMENTATION.md
    ├── USERS_DOCUMENTATION.md
    └── LOGIN_README.md
```

---

## 🔐 Security

### Multi-Tenant Isolation

- Each tenant has **completely isolated data**
- No cross-tenant access possible
- Username format: `username@tenant_id`
- Session stores tenant_id for validation

### Login Security

- Max 5 failed attempts
- 5-minute lockout
- Password validation
- Session expiration (24h or 30 days)

### Future Security

- [ ] bcrypt password hashing
- [ ] 2-factor authentication
- [ ] IP-based rate limiting
- [ ] Audit logging
- [ ] GDPR compliance tools

---

## 🎨 Features

### Login Page ✅ COMPLETE

- Professional VBS branding
- 2-column layout (Login + Marketing)
- Responsive design (desktop to mobile)
- Multi-tenant support
- Session management
- Call-to-action buttons

### Events Green Rentals Dashboard ✅ COMPLETE (v1.0.6)

**LED Wall Management System:**
- ✅ **Kalender & Vermietung**
  - Monatskalender mit Buchungsvisualisierung
  - Doppelbuchungs-Warnung
  - Detaillierte Buchungsliste

- ✅ **LED-Wände Management**
  - 2 LED-Wände (Premium 6x4m, Standard 4x3m)
  - Equipment-Grid mit technischen Specs
  - Status-Tracking & Tagespreise

- ✅ **CRM System**
  - Kundendatenbank (3 Testkunden)
  - Kommunikationsverlauf (E-Mail, Telefon, Meeting)
  - Status-Management (Aktiv, Potenziell, Inaktiv)

- ✅ **Angebote**
  - Automatische Angebotsnummern
  - LED-Wand-Auswahl & Mietzeitraum
  - Auto-Preisberechnung mit MwSt (19%)
  - Status-Filter

- ✅ **Rechnungen**
  - Automatische Rechnungsnummern
  - Zahlungsstatus-Tracking
  - Überfälligkeits-Warnungen
  - PDF-Export (vorbereitet)

**Technologie:**
- Modulare JS-Architektur (7 Dateien)
- Modulare CSS-Struktur (5 Dateien)
- Grünes Theme (#10b981)
- API-Integration (FastAPI Backend)

### ClipMyHorse.TV Dashboard ✅ COMPLETE

**Production Equipment Management:**
- Equipment overview
- Quick booking
- Recent activity
- Statistics & charts

### Upcoming Features ⏳ PLANNED

- Upload images for equipment
- Email notifications
- Advanced reporting & analytics
- Mobile app
- Multi-language support

---

## 🌐 Deployment

### 🚀 Quick Deploy (Production)

**Automatisches Setup auf Ubuntu Server (5 Minuten):**

```bash
cd /var/www
git clone https://github.com/herbscho94/production-management.git
cd production-management/backend
chmod +x setup-server.sh
sudo ./setup-server.sh
```

➡️ **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Alle Deployment-Optionen  
➡️ **[doc/SERVER_INSTALLATION.md](./doc/SERVER_INSTALLATION.md)** - Detaillierte Anleitung

### 💻 Local Development

```bash
# Backend (Terminal 1)
cd backend
./start.sh

# Frontend (Terminal 2)
cd ..
python3 -m http.server 8001
```

**Dann öffnen:** `http://localhost:8001`

### 📊 Production Stack

**Current (Deployed):**
- **Frontend:** Static HTML/CSS/JS (via NGINX)
- **Backend:** Python FastAPI + Uvicorn
- **Database:** JSON Files (tenant-isolated)
- **Proxy:** NGINX
- **Server:** Ubuntu 20.04+ LTS

**Costs:** ~€5-10/month (small VPS)

---

## 🎯 Business Model

### Pricing Model

**All-Inclusive Plans:**
- Users + Storage bundled
- All features included
- Simple, transparent pricing

**Plans:**
- Starter: 100 THB (€3 / $3) - 1 user, 1 GB
- Basic: 500 THB (€13 / $15) - 10 users, 50 GB
- Standard: 1,000 THB (€26 / $28) - 20 users, 100 GB
- Professional: 1,500 THB (€39 / $43) - 50 users, 500 GB
- Elite: 2,500 THB (€66 / $72) - 100 users, 1 TB

### Current Customers

1. **Event Screen Rentals**
   - Plan: Basic (5/10 users, 50 GB)
   - 500 THB/month (€13 / $15)

2. **ClipMyHorse.TV**
   - Plan: Standard (12/20 users, 100 GB)
   - 1,000 THB/month (€26 / $28)

**Current MRR:** 1,500 THB/month (€39/month or €468/year)

### Revenue Potential

**With 10 customers (5 Basic, 5 Standard):**
- (5 × 500 THB) + (5 × 1,000 THB) = 7,500 THB/month
- **~€195/month or ~€2,340/year**

**With 50 customers (20 Basic, 20 Standard, 10 Professional):**
- (20 × 500) + (20 × 1,000) + (10 × 1,500) = 45,000 THB/month
- **~€1,184/month or ~€14,200/year**

**With 100 customers (mixed plans):**
- Average 1,200 THB/customer = 120,000 THB/month
- **~€3,158/month or ~€37,900/year**

---

## 👥 Team & Roles

### VBS Development Team

**Responsibilities:**
- Platform development
- Tenant onboarding
- Customer support
- System maintenance
- Feature development

### Customer Admins

**Can do:**
- Manage their users
- Configure equipment
- Create bookings
- View reports
- Export data

**Cannot do:**
- Access other tenants
- Change subscription
- Access system settings

---

## 📧 Support

**For Customers:**
- Email: support@vbs-broadcast.com
- Website: https://www.vbs-broadcast.com/

**For Development:**
- Review SYSTEM_DOCUMENTATION.md
- Check code comments
- Test with both tenants

---

## 🔄 Version History

### v1.0.6 - October 14, 2025 ✨ LATEST

**Events Green Rentals Dashboard:**
- ✅ Vollständiges LED-Wand-Vermietungssystem
- ✅ CRM mit Kunden, Kommunikation, Angeboten & Rechnungen
- ✅ Kalender mit Buchungsvisualisierung
- ✅ 2 LED-Wände (Samsung, LG) mit Tagespreisen
- ✅ Modulare JavaScript & CSS Architektur
- ✅ Backend API-Integration (FastAPI)

### v1.0.5 - October 14, 2025

**Server Deployment:**
- ✅ Complete Ubuntu server installation guide
- ✅ Python FastAPI backend with Systemd
- ✅ NGINX reverse proxy configuration
- ✅ SSL/HTTPS setup guide

### v1.0.0 - October 14, 2025

**Initial Release:**
- ✅ Multi-tenant architecture implemented
- ✅ Login system with VBS branding
- ✅ 2 real tenants configured
- ✅ Responsive design complete
- ✅ Documentation complete
- ✅ Backend API (Python FastAPI)
- ✅ ClipMyHorse.TV Dashboard operational

**Key Decisions:**
- SaaS model (not local installation)
- Multi-tenant from day one
- English as primary language
- Cloud-based with data export

---

## 🚦 Getting Started

### For Developers

1. **Read** [SYSTEM_DOCUMENTATION.md](./SYSTEM_DOCUMENTATION.md)
2. **Test** login with both tenant accounts
3. **Review** code in `js/login-multitenant.js`
4. **Plan** next feature from roadmap

### For New Tenants

1. Receive credentials from VBS
2. Login at the platform URL
3. Set up profile
4. Add team members
5. Configure equipment

---

## 📝 Contributing

### Adding Features

1. Update SYSTEM_DOCUMENTATION.md
2. Implement feature
3. Test with multiple tenants
4. Update this README if needed

### Code Style

- Use clear variable names
- Comment complex logic
- Follow existing patterns
- Always validate tenant_id

---

## 📜 License

© 2025 VBS Visionary Broadcast Services. All rights reserved.

**Proprietary Software** - Licensed to customers via subscription.

---

## 🎯 Next Immediate Steps

1. **Develop Backend API** (Node.js + PostgreSQL)
2. **Create Dashboard** (Equipment overview)
3. **Build Equipment Management** (CRUD interface)
4. **Implement Data Export** (Download functionality)
5. **Add Billing System** (Stripe integration)

---

**For complete details, see:** [SYSTEM_DOCUMENTATION.md](./doc/SYSTEM_DOCUMENTATION.md)

**VBS Visionary Broadcast Services**  
*Advancing TV production through cutting-edge automation and software*

Website: https://www.vbs-broadcast.com/  
Location: Bangkok, Thailand

