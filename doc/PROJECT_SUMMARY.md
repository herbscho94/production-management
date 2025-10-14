# Production Management Platform - Quick Summary

**VBS Visionary Broadcast Services** | October 14, 2025 | v1.0.0

---

## ⚡ 30-Second Overview

**What:** Cloud-based SaaS platform for production equipment and resource management  
**Who:** TV stations, film crews, YouTubers, equipment rental companies  
**How:** Multi-tenant architecture with complete data isolation per customer  
**Status:** Login system complete, backend & dashboard in development

---

## 🏢 Current Customers (Tenants)

| Tenant | Location | Plan | Users | Storage | Monthly Cost | Login |
|--------|----------|------|-------|---------|--------------|-------|
| **Event Screen Rentals** | Berlin | Basic | 5/10 | 50 GB | 500 THB (€13) | `admin@tenant_esr` |
| **ClipMyHorse.TV** | Hamburg | Standard | 12/20 | 100 GB | 1,000 THB (€26) | `admin@tenant_cmh` |

---

## 📁 File Structure

```
Produktionsplanung/
├── index.html                   ← Login page (START HERE)
├── SYSTEM_DOCUMENTATION.md      ← Main docs (READ THIS)
├── README.md                    ← Quick start
├── CHANGELOG.md                 ← Version history
│
├── css/login.css                ← Styles (1083 lines)
├── js/login-multitenant.js      ← Active login script
│
└── data/
    ├── tenants.json             ← Tenant registry
    └── tenants/
        ├── tenant_esr/          ← Event Screen Rentals data
        └── tenant_cmh/          ← ClipMyHorse.TV data
```

---

## 🔐 Test Login

```
Event Screen Rentals:
👤 admin@tenant_esr
🔑 ESR2025!Admin

ClipMyHorse.TV:
👤 admin@tenant_cmh
🔑 CMH2025!Admin
```

---

## 🎯 Next Steps

1. **Backend API** (Node.js + PostgreSQL)
2. **Dashboard** (Equipment overview)
3. **Equipment CRUD** (Add, edit, delete)
4. **Data Export** (Download button)
5. **Billing** (Stripe integration)

---

## 📖 Documentation

| File | Purpose | Status |
|------|---------|--------|
| **SYSTEM_DOCUMENTATION.md** | Complete system guide | ✅ Current |
| **README.md** | Quick start & overview | ✅ Current |
| **CHANGELOG.md** | Version history | ✅ Current |
| doc/DOCUMENTATION.md | Equipment docs | ⚠️ Legacy |
| doc/USERS_DOCUMENTATION.md | User docs | ⚠️ Legacy |
| doc/LOGIN_README.md | Login docs | ⚠️ Legacy |

---

## 💰 Business Model

**All-Inclusive Plans:**
- Starter: 100 THB (€3 / $3)
- Basic: 500 THB (€13 / $15)
- Standard: 1,000 THB (€26 / $28)
- Professional: 1,500 THB (€39 / $43)
- Elite: 2,500 THB (€66 / $72)

**Includes:**
- Users + Storage bundled
- All features for every plan

**Current MRR:** 1,500 THB/month (€39/month or €468/year)

---

## 🚀 Run Locally

```bash
cd /Users/herbertscholz/Desktop/Produktionsplanung
python3 -m http.server 8000
# Open: http://localhost:8000
```

---

## ✅ What's Complete

- ✅ Login page with VBS branding
- ✅ Multi-tenant architecture
- ✅ 2 real tenants configured
- ✅ Responsive design (mobile to 4K)
- ✅ Session management
- ✅ Complete documentation

## ⏳ What's Next

- ⏳ Backend API
- ⏳ Dashboard UI
- ⏳ Equipment management
- ⏳ Booking system
- ⏳ Data export feature

---

**For Details:** See [SYSTEM_DOCUMENTATION.md](./SYSTEM_DOCUMENTATION.md)

**VBS:** https://www.vbs-broadcast.com/

