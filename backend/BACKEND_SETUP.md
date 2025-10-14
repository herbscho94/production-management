# Backend API - Setup Guide

## ⚡ Schnellstart (5 Minuten)

```bash
cd backend
./start.sh
```

Das war's! API läuft auf http://localhost:8000

---

## 📚 API Testen

### 1. Öffne Swagger UI:
```
http://localhost:8000/api/docs
```

### 2. Login testen:

**Klicke auf "POST /api/auth/login" → "Try it out"**

```json
{
  "username": "admin@tenant_esr",
  "password": "ESR2025!Admin"
}
```

**Klicke "Execute"** → Du bekommst einen Token!

### 3. Token verwenden:

**Kopiere den `access_token`**

**Klicke oben rechts auf "Authorize"**  
Gib ein: `Bearer <dein-token>`

Jetzt kannst du alle Endpoints testen! ✅

---

## 🎯 Wichtigste Endpoints:

```
POST /api/auth/login                          # Login
GET  /api/tenants/{tenant_id}/users           # User auflisten
GET  /api/tenants/{tenant_id}/equipment       # Equipment auflisten
GET  /api/tenants/{tenant_id}/export/full     # Alle Daten exportieren
```

---

## 🔧 Konfiguration

**Datei:** `env.example` → kopiere zu `.env`

Wichtigste Einstellung:
```
JWT_SECRET_KEY=dein-super-geheimer-schlüssel-min-32-zeichen
```

---

## ✅ Was das Backend kann:

- ✅ Multi-Tenant Authentifizierung
- ✅ JWT-basierte Sessions  
- ✅ User-Verwaltung (CRUD)
- ✅ Equipment-Verwaltung (CRUD)
- ✅ Daten-Export (JSON)
- ✅ Automatische API-Dokumentation
- ✅ Tenant-Isolation (Sicherheit)
- ✅ Permission-Checks
- ✅ Passwort-Hashing (bcrypt)

---

**Mehr Details:** Siehe `README.md` im Backend-Ordner

**VBS Visionary Broadcast Services**

