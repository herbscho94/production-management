# Changelog - Production Management Platform

All notable changes to this project will be documented in this file.

---

## [1.0.6] - 2025-10-14

### 🎉 Added - Events Green Rentals Dashboard (Tenant ESR)

#### ✨ Vollständiges LED-Wand-Vermietungssystem

**Neue Datenstruktur:**
- ✅ `data/tenants/tenant_esr/crm.json` - Komplettes CRM-System
  - Kundendatenbank (3 Testkunden)
  - Kommunikationsverlauf (E-Mail, Telefon, Meeting)
  - Angebote mit automatischer Preisberechnung
  - Rechnungen mit Zahlungsstatus
  - Buchungen mit LED-Wand-Zuordnung

- ✅ `data/tenants/tenant_esr/equipment.json` - 2 LED-Wände
  - LED-Wand Premium 6x4m (Samsung The Wall Pro) - 800€/Tag
  - LED-Wand Standard 4x3m (LG Direct View LED) - 500€/Tag

**Dashboard HTML:**
- ✅ 7 verschiedene Views (Overview, Kalender, Equipment, CRM, Angebote, Rechnungen, Team)
- ✅ Statistik-Karten (LED-Wände, Buchungen, Kunden)
- ✅ Schnellaktionen für häufige Tasks
- ✅ Komplett auf Deutsch lokalisiert
- ✅ Responsive Design

**Modulare JavaScript-Architektur (7 Dateien):**
- ✅ `dashboard.js` - Kern & Authentifizierung
- ✅ `navigation.js` - View-Switching System
- ✅ `calendar.js` - Kalender mit Buchungsvisualisierung
- ✅ `customers.js` - CRM-Verwaltung
- ✅ `quotes.js` - Angebotssystem mit Filtern
- ✅ `invoices.js` - Rechnungsmanagement
- ✅ `communication.js` - Kommunikations-Tracking

**Modulare CSS-Architektur (5 Dateien):**
- ✅ `dashboard.css` - Basis-Design (grünes Theme #10b981)
- ✅ `calendar.css` - Kalender-Komponenten
- ✅ `crm.css` - CRM-Styles
- ✅ `quotes.css` - Angebots-Design
- ✅ `invoices.css` - Rechnungs-Design

**Backend Integration:**
- ✅ API-Endpunkt: `GET /api/tenants/tenant_esr/crm`
- ✅ CRM-Daten werden dynamisch vom Backend geladen
- ✅ JWT-Authentifizierung & Tenant-Isolation

**Dashboard Features:**

1. **📅 Kalender & Vermietung**
   - Monatskalender mit Buchungsvisualisierung
   - Farbige Markierung gebuchter Tage
   - Doppelbuchungs-Warnung
   - Detaillierte Buchungsliste

2. **🖥️ LED-Wände Management**
   - Equipment-Grid mit Karten-Ansicht
   - Technische Spezifikationen
   - Status-Tracking (Verfügbar, Vermietet, Wartung)
   - Tagespreise prominent angezeigt

3. **👥 CRM (Customer Relationship Management)**
   - Kundendatenbank mit vollständigen Kontaktdaten
   - Kommunikationsverlauf (E-Mail, Telefon, Meeting)
   - Tab-basierte Navigation
   - Status-Management (Aktiv, Potenziell, Inaktiv)

4. **📄 Angebote**
   - Automatische Angebotsnummern (ANG-2025-XXX)
   - LED-Wand-Auswahl & Mietzeitraum
   - Automatische Preisberechnung mit MwSt (19%)
   - Status-Filter (Entwurf, Gesendet, Angenommen, Abgelehnt)

5. **💰 Rechnungen**
   - Automatische Rechnungsnummern (RE-2025-XXX)
   - Verknüpfung mit Angeboten
   - Zahlungsstatus-Tracking
   - Überfälligkeits-Warnungen
   - PDF-Export (vorbereitet)

**Design & Branding:**
- ✅ Grünes Farbschema (#10b981) - "Green Rentals"
- ✅ Logo: EGR (Events Green Rentals)
- ✅ Moderne UI mit Schatten & Animationen
- ✅ Status-Badges mit Farb-Kodierung

**Dokumentation:**
- ✅ `dashboards/tenant_esr/README.md` - Dashboard-Dokumentation
- ✅ `dashboards/tenant_esr/CHANGELOG.md` - Detailliertes Changelog

**Testdaten:**
- ✅ 3 Kunden (TechEvent, Festival Productions, Corporate Events Plus)
- ✅ 3 Kommunikationen
- ✅ 2 Angebote (1 gesendet, 1 angenommen)
- ✅ 1 Rechnung (ausstehend)
- ✅ 1 Buchung (November 2025)

### Changed
- Brand Name: "Event Screen Rentals" → "Events Green Rentals"
- Theme Color: Rot (#dc2626) → Grün (#10b981)
- Dashboard komplett neu strukturiert mit modularem Ansatz

### Technical Details
- Modulare Architektur für einfache Wartung
- Globale Daten-Synchronisation zwischen Modulen
- View-Switching ohne Seitenreload
- Responsive Breakpoints für alle Geräte

---

## [1.0.5] - 2025-10-14

### Added
- **SERVER_INSTALLATION.md**: Complete Ubuntu server deployment guide
  - Step-by-step installation instructions
  - Backend setup (Python/FastAPI + Systemd)
  - NGINX reverse proxy configuration
  - SSL/HTTPS setup with Let's Encrypt
  - Troubleshooting section
  - Maintenance and update procedures
  - Security best practices

### Changed
- Updated README.md with link to server installation guide
- Improved documentation structure in `doc/` folder

### Technical Details
- Documented complete production deployment process
- Includes .env configuration examples
- NGINX security headers and blocked paths
- Systemd service configuration
- Firewall (UFW) setup

---

## [1.0.0] - 2025-10-14

### 🎉 Initial Release - Multi-Tenant SaaS Platform

#### Added

**Core System:**
- ✅ Multi-tenant architecture with isolated data per customer
- ✅ Central tenant registry system (`tenants.json`)
- ✅ Secure login system with tenant identification
- ✅ Session management with 24h/30d expiration
- ✅ Complete VBS branding throughout platform

**Login Page:**
- ✅ Professional 2-column layout (Login + Marketing)
- ✅ VBS logo integration from official website
- ✅ Overlapping design (login over promo box)
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Username format: `username@tenant_id`
- ✅ Password visibility toggle
- ✅ "Remember me" functionality
- ✅ Marketing section with 3 key features
- ✅ Call-to-Action buttons (Become Customer, Try Demo)
- ✅ Fixed footer with VBS branding and links

**Security:**
- ✅ Max 5 login attempts with 5-minute lockout
- ✅ Tenant-specific data isolation
- ✅ Password validation (plain text for development)
- ✅ Session-based authentication

**Tenants:**
- ✅ Event Screen Rentals (tenant_esr)
  - 1 Admin user
  - Pro plan (50 users, 200 GB)
  - Berlin, Germany
  - Event technology focus

- ✅ ClipMyHorse.TV (tenant_cmh)
  - 1 Admin user
  - Enterprise plan (100 users, 500 GB)
  - Hamburg, Germany
  - Equestrian sports broadcasting focus

**Documentation:**
- ✅ SYSTEM_DOCUMENTATION.md (comprehensive guide)
- ✅ README.md (quick start guide)
- ✅ CHANGELOG.md (this file)
- ✅ Multi-tenant guide with API architecture

#### Changed

**Language:**
- Changed from German to English (UI, documentation, code comments)
- Reason: International platform, broader market

**Platform Name:**
- From: "Produktionsplanung" / "Camera & Equipment Management"
- To: "Production Management Platform" / "Complete Production & Resource Management"
- Reason: More general, broader positioning

**Business Model:**
- From: Local installation (Raspberry Pi)
- To: Cloud-based SaaS
- Reason: Recurring revenue, easier maintenance, better control

**Login System:**
- From: Simple username (`j.miller`)
- To: Tenant-aware username (`admin@tenant_esr`)
- Reason: Multi-tenant isolation

**Footer:**
- From: Centered on gradient background
- To: Fixed white bar at bottom (full width)
- Reason: Professional appearance, better readability

**Marketing Content:**
- From: "Offline, local JSON files"
- To: "Cloud-based with data export capability"
- Reason: Aligned with SaaS model

#### Removed

- ❌ Demo account display on login page
- ❌ `show_demo_login` configuration
- ❌ Demo user (ID 999) and demo role
- ❌ Single-tenant data files:
  - `data/Users.json` → Moved to tenant folders
  - `data/Equipment.json` → Moved to tenant folders
- ❌ Old tenant demo data (tenant_001, tenant_002)
- ❌ "Your data stays offline" messaging

#### Decisions Made

1. **SaaS Model**: Cloud-based service with online access
2. **Data Export**: Customers can download complete data anytime
3. **Multi-Tenant**: From day one for scalability
4. **No Demo Display**: Professional appearance with CTA buttons instead
5. **VBS Branding**: Full branding with logo and links
6. **English Only**: International platform positioning

---

## 📋 Breaking Changes from Initial Concept

### Data Structure

**Old Structure (Single-Tenant):**
```
data/
├── Users.json
└── Equipment.json
```

**New Structure (Multi-Tenant):**
```
data/
├── tenants.json
└── tenants/
    ├── tenant_esr/
    │   ├── users.json
    │   └── equipment.json
    └── tenant_cmh/
        ├── users.json
        └── equipment.json
```

### Login Credentials

**Old Format:**
```
Username: j.miller
Password: demo123
```

**New Format:**
```
Username: admin@tenant_esr
Password: ESR2025!Admin
```

### JavaScript

**Old:**
```html
<script src="js/login.js"></script>
```

**New:**
```html
<script src="js/login-multitenant.js"></script>
```

---

## 🎨 Design Evolution

### Login Page

**Version 1:** Single centered login box
- Simple gradient background
- Demo credentials shown below login
- German language
- Camera icon

**Version 2:** Two-column layout
- Login left, marketing right
- English language
- VBS logo
- Footer as gradient overlay

**Version 3 (Current):** Overlapping design
- Login box overlaps promo box
- Fixed white footer at bottom
- Call-to-action buttons
- Complete VBS branding
- username@tenant_id format

### Marketing Messaging

**Version 1:**
- "Fully Offline — Your data stays in simple JSON files"

**Version 2 (Current):**
- "Cloud-Based Service — Access from anywhere, anytime"
- "Export Anytime — Download your complete data"
- "Full Transparency — See exactly what data is stored"

---

## 🔧 Technical Specifications

### Login System

**File:** `js/login-multitenant.js`

**Features:**
- Multi-tenant username parsing
- Tenant validation before auth
- Dynamic tenant data loading
- Session with tenant_id
- Lockout mechanism

**Configuration:**
```javascript
CONFIG = {
    tenantsDataPath: './data/tenants.json',
    sessionStorageKey: 'vbs_production_management_session',
    dashboardUrl: './dashboard.html',
    maxLoginAttempts: 5,
    lockoutDuration: 300000
}
```

### CSS

**File:** `css/login.css` (1083 lines)

**Features:**
- CSS custom properties (variables)
- Responsive breakpoints (1200px, 768px, 480px)
- Animations (slide, float, shake)
- Modern gradient backgrounds
- Professional component library

**Breakpoints:**
- Desktop: >1200px (2-column overlap)
- Tablet: 768-1200px (stacked)
- Mobile: <768px (compact)
- Small: <480px (extra compact)

---

## 🚀 Roadmap

### Completed ✅

- [x] Multi-tenant architecture
- [x] Login system with tenant isolation
- [x] VBS branding and design
- [x] Responsive design
- [x] Session management
- [x] 2 real tenants configured
- [x] Comprehensive documentation

### In Progress ⏳

- [ ] Backend API development
- [ ] PostgreSQL database setup
- [ ] Dashboard development

### Planned 📅

**Q4 2025:**
- [ ] Equipment management interface
- [ ] User management (admin panel)
- [ ] Basic booking system
- [ ] Data export functionality

**Q1 2026:**
- [ ] Projects module
- [ ] Reporting & analytics
- [ ] Invoice generation
- [ ] Email notifications

**Q2 2026:**
- [ ] Mobile app (React Native)
- [ ] Advanced permissions
- [ ] Billing integration (Stripe)
- [ ] Multi-language support

---

## 📞 Contact & Support

**VBS Visionary Broadcast Services**

- 🌐 Website: https://www.vbs-broadcast.com/
- 📧 Email: support@vbs-broadcast.com
- 📍 Location: Bangkok, Thailand

**For Development:**
- See SYSTEM_DOCUMENTATION.md
- Review code comments
- Test with both tenants

---

## 📝 Notes for Future Development

### Important Considerations

1. **Always Test Multi-Tenant:**
   - Test every feature with multiple tenants
   - Verify data isolation
   - Check session validation

2. **Never Hard-Code Tenant ID:**
   - Always get from session
   - Always validate access
   - Use middleware/guards

3. **Preserve History:**
   - Never delete users (set is_active: false)
   - Keep old bookings
   - Maintain audit trail

4. **Data Export:**
   - Implement early (customer trust)
   - Make it easy (one-click)
   - Include all data

5. **Documentation:**
   - Update SYSTEM_DOCUMENTATION.md with every major change
   - Document API endpoints as you build them
   - Keep changelog updated

### Migration Path (If Needed)

**From Multi-Tenant back to Single-Tenant:**
1. Keep one tenant folder
2. Restore old login.js
3. Remove @tenant_id from usernames
4. Merge data if needed

**To Database:**
1. Create migration scripts
2. Map JSON to SQL schema
3. Preserve all tenant_id references
4. Test thoroughly before cutover

---

## 🎓 Learning Resources

### Understanding the System

1. Start with README.md (this file)
2. Read SYSTEM_DOCUMENTATION.md thoroughly
3. Test login with both tenants
4. Review login-multitenant.js code
5. Examine tenant data structures

### For New Developers

**Day 1:**
- Clone repository
- Read documentation
- Test login page
- Understand multi-tenant concept

**Day 2:**
- Review data models
- Understand session flow
- Plan first feature

**Week 1:**
- Build simple API endpoint
- Connect to tenant data
- Implement validation

---

## 🏆 Success Metrics

### Technical KPIs

- [ ] Login success rate >99%
- [ ] Page load time <2s
- [ ] Zero data leakage between tenants
- [ ] API response time <200ms
- [ ] 99.9% uptime

### Business KPIs

- [x] 2 paying customers onboarded
- [ ] 10 customers by Q1 2026
- [ ] €1000 MRR by Q1 2026
- [ ] 50 customers by Q4 2026
- [ ] €5000 MRR by Q4 2026

---

## 🔮 Future Vision

### Year 1 Goals

- 50+ customers
- €5,000 MRR
- Mobile app launched
- Full API complete
- 99.9% uptime

### Year 2 Goals

- 200+ customers
- €20,000 MRR
- White-label option
- Enterprise features
- International expansion

---

---

## [1.0.1] - 2025-10-14 (Later Same Day)

### 🔄 Changed - Pricing Model Overhaul

**From Tiered Plans to Simple Pay-Per-User:**

**Old Model:**
- Basic: €29/month (10 users)
- Pro: €79/month (50 users)
- Enterprise: €199/month (100+ users)

**New Model:**
- **100 THB per user/month** (~€2.60)
- All features included
- No restrictions
- Unlimited users

**Optional Cloud Storage:**
- Separate pricing based on usage
- 100% markup on IONOS costs
- 50 GB: 17 THB/month, 100 GB: 34 THB/month, etc.

**Updated Tenants:**
- Event Screen Rentals: 5 users + 50 GB = 517 THB/month (~€13.50)
- ClipMyHorse.TV: 12 users + 100 GB = 1,234 THB/month (~€32)
- **New MRR:** 1,751 THB/month (~€46)

### 📁 Documentation Reorganized

**Moved to `doc/` folder:**
- SYSTEM_DOCUMENTATION.md
- CHANGELOG.md (this file)
- PROJECT_SUMMARY.md

**Root directory now clean:**
- Only README.md, index.html, and folders
- Professional structure

### 📊 Data Structure Updates

**tenants.json:**
- New fields: `active_users`, `monthly_cost_thb`, `storage_cost_thb`, `total_monthly_thb`
- Removed fields: `plan`, `users_limit`, `expires_at`
- Added global pricing config

**Reason:**
- Simpler customer billing
- More flexible
- Transparent costs
- Thai Baht currency (VBS location)

---

## [1.0.2] - 2025-10-14 (Storage Pricing Update)

### 💾 Changed - Cloud Storage Pricing

**From:** IONOS-based pricing  
**To:** VPS NVMe-based pricing

**New Storage Plans:**

| VPS Plan | Storage | Customer Price |
|----------|---------|----------------|
| VPS XS | 10 GB | 140 THB/month |
| VPS S | 80 GB | 350 THB/month |
| VPS M | 120 GB | 560 THB/month |
| VPS L | 240 GB | 1,050 THB/month |
| VPS XL | 480 GB | 2,100 THB/month |
| VPS XXL | 720 GB | 3,500 THB/month |

**Updated Tenant Allocations:**
- Event Screen Rentals: 80 GB (VPS S) → 350 THB/month
- ClipMyHorse.TV: 120 GB (VPS M) → 560 THB/month

**New Monthly Revenue:**
- ESR: 500 (users) + 350 (storage) = 850 THB/month
- CMH: 1,200 (users) + 560 (storage) = 1,760 THB/month
- **Total MRR:** 2,610 THB/month (~€68.70)

**Data Updates:**
- `tenants.json` updated with `storage_vps_plan` field
- Global VPS pricing config added
- Exchange rates documented (35 THB = $1, 38 THB = €1)

---

---

## [1.0.3] - 2025-10-14 (Pricing Model Finalized)

### 💰 Changed - Fixed All-Inclusive Plans

**From:** Pay-per-user + Separate storage pricing  
**To:** Fixed all-inclusive plans

**New Plans:**

| Plan | Users | Storage | THB/month | EUR/month | USD/month |
|------|-------|---------|-----------|-----------|-----------|
| Starter | 1 | 1 GB | 100 | €3 | $3 |
| Basic | 10 | 50 GB HDD | 500 | €13 | $15 |
| Standard | 20 | 100 GB SSD | 1,000 | €26 | $28 |
| Professional | 50 | 500 GB SSD | 1,500 | €39 | $43 |
| Elite | 100 | 1 TB NVMe | 2,500 | €66 | $72 |

**Tenant Assignments:**
- Event Screen Rentals → Basic Plan (5/10 users, 50 GB HDD)
- ClipMyHorse.TV → Standard Plan (12/20 users, 100 GB SSD)

**New Monthly Revenue:**
- ESR: 500 THB/month (€13)
- CMH: 1,000 THB/month (€26)
- **Total MRR:** 1,500 THB/month (€39 or €468/year)

**Reason:**
- Simpler for customers - one price, everything included
- Easier to communicate and sell
- Predictable revenue
- Standard SaaS pricing model
- Billing in THB, converted to EUR/USD at current rates

**Data Updates:**
- `tenants.json` completely restructured with plan-based model
- Removed: `price_per_user_thb`, `storage_vps_plan`, separate costs
- Added: `plan`, `plan_name`, `users_limit`, multi-currency pricing
- Global plans config with all 5 tiers

---

**Last Updated:** October 14, 2025  
**Version:** 1.0.3  
**Next Review:** November 14, 2025

**VBS Visionary Broadcast Services**  
*Innovative Media Production Solutions*

