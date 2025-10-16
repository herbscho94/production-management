# 📤 Dateien zum Hochladen auf den Server

**Server:** 87.106.176.134  
**Ziel-Pfad:** /var/www/production-management/

---

## 🚨 WICHTIG: Diese Dateien müssen hochgeladen werden!

### 1. Backend (Python API)
```bash
scp /Users/herbertscholz/Desktop/Produktionsplanung/backend/main.py \
    root@87.106.176.134:/var/www/production-management/backend/
```

### 2. Daten-Dateien
```bash
# Equipment (nur LED-Anhänger)
scp /Users/herbertscholz/Desktop/Produktionsplanung/data/tenants/tenant_esr/equipment.json \
    root@87.106.176.134:/var/www/production-management/data/tenants/tenant_esr/

# CRM (nur Kunden & Kommunikation)
scp /Users/herbertscholz/Desktop/Produktionsplanung/data/tenants/tenant_esr/crm.json \
    root@87.106.176.134:/var/www/production-management/data/tenants/tenant_esr/

# Productions (NEU! - alle Veranstaltungen)
scp /Users/herbertscholz/Desktop/Produktionsplanung/data/tenants/tenant_esr/production.json \
    root@87.106.176.134:/var/www/production-management/data/tenants/tenant_esr/
```

### 3. Frontend HTML
```bash
scp /Users/herbertscholz/Desktop/Produktionsplanung/dashboards/tenant_esr/pages/index.html \
    root@87.106.176.134:/var/www/production-management/dashboards/tenant_esr/pages/
```

### 4. Frontend JavaScript (ALLE aktualisiert!)
```bash
# Dashboard Core
scp /Users/herbertscholz/Desktop/Produktionsplanung/dashboards/tenant_esr/js/dashboard.js \
    root@87.106.176.134:/var/www/production-management/dashboards/tenant_esr/js/

# Navigation
scp /Users/herbertscholz/Desktop/Produktionsplanung/dashboards/tenant_esr/js/navigation.js \
    root@87.106.176.134:/var/www/production-management/dashboards/tenant_esr/js/

# Calendar
scp /Users/herbertscholz/Desktop/Produktionsplanung/dashboards/tenant_esr/js/calendar.js \
    root@87.106.176.134:/var/www/production-management/dashboards/tenant_esr/js/

# Quotes
scp /Users/herbertscholz/Desktop/Produktionsplanung/dashboards/tenant_esr/js/quotes.js \
    root@87.106.176.134:/var/www/production-management/dashboards/tenant_esr/js/
```

---

## ⚡ SCHNELL-UPLOAD (Alle Dateien auf einmal)

```bash
# BACKEND
scp /Users/herbertscholz/Desktop/Produktionsplanung/backend/main.py \
    root@87.106.176.134:/var/www/production-management/backend/

# DATA
scp /Users/herbertscholz/Desktop/Produktionsplanung/data/tenants/tenant_esr/*.json \
    root@87.106.176.134:/var/www/production-management/data/tenants/tenant_esr/

# FRONTEND HTML
scp /Users/herbertscholz/Desktop/Produktionsplanung/dashboards/tenant_esr/pages/index.html \
    root@87.106.176.134:/var/www/production-management/dashboards/tenant_esr/pages/

# FRONTEND JS
scp /Users/herbertscholz/Desktop/Produktionsplanung/dashboards/tenant_esr/js/*.js \
    root@87.106.176.134:/var/www/production-management/dashboards/tenant_esr/js/

# SERVER NEU STARTEN
ssh root@87.106.176.134 "sudo systemctl restart production-management"
```

---

## 🔧 Nach dem Upload

### Server neu starten:
```bash
ssh root@87.106.176.134 "sudo systemctl restart production-management"
```

### Browser-Cache leeren:
- **Chrome/Edge:** Strg + Shift + R (Windows) oder Cmd + Shift + R (Mac)
- **Firefox:** Strg + F5
- Oder: Inkognito-Modus öffnen

---

## ✅ Checkliste

Nach dem Upload überprüfen:

- [ ] Alle 3 JSON-Dateien hochgeladen (equipment, crm, production)
- [ ] Backend main.py hochgeladen
- [ ] HTML-Datei hochgeladen
- [ ] Alle 4 JavaScript-Dateien hochgeladen
- [ ] Server neu gestartet
- [ ] Browser-Cache geleert
- [ ] Dashboard öffnen und testen

---

## 🎯 Was wurde geändert?

### Datenstruktur:
- ✅ **equipment.json** - Nur noch LED-Anhänger 16qm
- ✅ **crm.json** - Nur Kunden & Kommunikation (keine Buchungen mehr)
- ✅ **production.json** - NEU! Alle 13 Veranstaltungen mit vollständigen Infos

### Backend:
- ✅ Neues API-Endpoint: `/api/tenants/{tenant_id}/productions`
- ✅ CRM-Endpoint liefert keine Buchungen mehr

### Frontend:
- ✅ Dashboard lädt jetzt von production.json
- ✅ Statistiken berechnen aus Productions
- ✅ Equipment-Namen werden über IDs verknüpft
- ✅ Menü aktualisiert (Equipment, Buchhaltung, Arbeitszeiten)

---

**Server:** 87.106.176.134  
**Datum:** 16. Oktober 2025

