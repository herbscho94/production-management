# Deployment Guide - Production Management Platform

**VBS Visionary Broadcast Services**

---

## 🚀 Deployment Optionen

### Option 1: Automatisches Setup (Empfohlen) ⚡

**Schnellste Methode - 5 Minuten:**

```bash
# 1. Repository klonen
cd /var/www
git clone https://github.com/herbscho94/production-management.git

# 2. Setup-Script ausführen
cd production-management/backend
chmod +x setup-server.sh
sudo ./setup-server.sh
```

✅ **Fertig!** Öffne `http://deine-server-ip` im Browser.

---

### Option 2: Manuelle Installation 📖

**Für detaillierte Kontrolle:**

Folge der kompletten Schritt-für-Schritt Anleitung:

➡️ **[doc/SERVER_INSTALLATION.md](./doc/SERVER_INSTALLATION.md)**

Beinhaltet:
- Detaillierte Erklärungen zu jedem Schritt
- SSL/HTTPS Setup
- Troubleshooting
- Sicherheits-Best-Practices

---

### Option 3: Docker (In Entwicklung) 🐳

Docker-Support ist für die Zukunft geplant.

---

## 📋 Voraussetzungen

### Server-Anforderungen:

- **OS**: Ubuntu 20.04 LTS oder neuer
- **CPU**: 1 vCore (min)
- **RAM**: 1 GB (min), 2 GB empfohlen
- **Storage**: 10 GB (min)
- **Zugriff**: Root oder Sudo

### Software (wird automatisch installiert):

- Python 3.12+
- NGINX
- Git
- UFW Firewall

---

## 🌐 Nach dem Deployment

### 1. Zugriff auf die Plattform:

```
http://deine-server-ip          # Frontend
http://deine-server-ip/api/docs # API Dokumentation
```

### 2. Test-Login:

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

### 3. Service Management:

```bash
# Status prüfen
sudo systemctl status production-management
sudo systemctl status nginx

# Logs ansehen
sudo journalctl -u production-management -f

# Services neustarten
sudo systemctl restart production-management
sudo systemctl restart nginx
```

---

## 🔄 Updates

### Code aktualisieren:

```bash
cd /var/www/production-management
git pull
sudo systemctl restart production-management
```

### Dependencies aktualisieren:

```bash
cd /var/www/production-management/backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
deactivate
sudo systemctl restart production-management
```

---

## 🔒 SSL/HTTPS Setup

### Mit Let's Encrypt (kostenlos):

```bash
# Certbot installieren
sudo apt install -y certbot python3-certbot-nginx

# SSL-Zertifikat erstellen
sudo certbot --nginx -d deine-domain.com -d www.deine-domain.com

# Auto-Renewal testen
sudo certbot renew --dry-run
```

**Danach:**
- Frontend: `https://deine-domain.com`
- API Docs: `https://deine-domain.com/api/docs`

---

## 📁 Projekt-Struktur auf Server

```
/var/www/production-management/
│
├── backend/                    # Python FastAPI Backend
│   ├── venv/                  # Virtual Environment
│   ├── .env                   # Konfiguration (SECRET!)
│   ├── main.py                # API Entry Point
│   ├── requirements.txt       # Dependencies
│   └── setup-server.sh        # Auto-Setup Script
│
├── frontend_css/              # Stylesheets
├── frontend_js/               # JavaScript
├── dashboards/                # Tenant Dashboards
├── data/                      # Tenant Data (isoliert)
├── doc/                       # Dokumentation
└── index.html                 # Login Page
```

---

## 🐛 Troubleshooting

### Backend startet nicht:

```bash
# Logs prüfen
sudo journalctl -u production-management -n 50

# Manuell testen
cd /var/www/production-management/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### NGINX zeigt 502 Bad Gateway:

```bash
# Backend läuft?
sudo systemctl status production-management

# Port 8000 aktiv?
sudo ss -tlnp | grep 8000

# NGINX Error Log
sudo tail -50 /var/log/nginx/production-error.log
```

### CORS-Fehler:

```bash
# .env prüfen
cat /var/www/production-management/backend/.env

# CORS_ORIGINS muss Server-IP/Domain enthalten
# Format: ["http://ip","http://domain.com"]
```

**Mehr Hilfe:**
➡️ [doc/SERVER_INSTALLATION.md - Troubleshooting](./doc/SERVER_INSTALLATION.md#troubleshooting)

---

## 🔐 Sicherheit

### Nach Installation prüfen:

```bash
# Firewall Status
sudo ufw status

# Sensible Dateien blockiert?
curl -I http://deine-server-ip/backend/.env    # → 404
curl -I http://deine-server-ip/data/tenants.json # → 404
```

### Best Practices:

1. ✅ HTTPS aktivieren (Let's Encrypt)
2. ✅ SSH nur mit Keys (keine Passwörter)
3. ✅ Fail2ban installieren
4. ✅ Regelmäßige Updates
5. ✅ Backups einrichten

---

## 📊 Services & Ports

| Service | Port | Intern/Extern | Beschreibung |
|---------|------|---------------|--------------|
| FastAPI Backend | 8000 | Intern | Python API (nur via NGINX) |
| NGINX | 80 | Extern | Frontend & API Proxy |
| NGINX | 443 | Extern | HTTPS (mit SSL) |

---

## 📚 Weitere Dokumentation

- **[SERVER_INSTALLATION.md](./doc/SERVER_INSTALLATION.md)** - Komplette Installations-Anleitung
- **[SYSTEM_DOCUMENTATION.md](./doc/SYSTEM_DOCUMENTATION.md)** - System-Architektur
- **[CHANGELOG.md](./doc/CHANGELOG.md)** - Versions-Historie
- **[backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md)** - Backend-spezifisch

---

## 🆘 Support

**Bei Problemen:**

1. Logs prüfen (siehe Troubleshooting)
2. Dokumentation durchsuchen
3. GitHub Issues: https://github.com/herbscho94/production-management/issues
4. Email: support@vbs-broadcast.com

---

## ✅ Deployment Checkliste

Nach erfolgreicher Installation:

- [ ] Backend läuft: `sudo systemctl status production-management`
- [ ] NGINX läuft: `sudo systemctl status nginx`
- [ ] Firewall aktiv: `sudo ufw status`
- [ ] Login-Seite erreichbar
- [ ] API Docs erreichbar
- [ ] Test-Login funktioniert
- [ ] Dashboard wird angezeigt
- [ ] Sensible Ordner blockiert
- [ ] SSL/HTTPS aktiviert (optional, empfohlen)
- [ ] Backup-Strategie definiert

---

**VBS Visionary Broadcast Services**  
© 2025 - All rights reserved  
Website: https://www.vbs-broadcast.com/

