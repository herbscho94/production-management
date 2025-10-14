# Server Installation Guide - Production Management Platform

**VBS Visionary Broadcast Services**  
_Complete Ubuntu Server Deployment Guide_

---

## 📋 Voraussetzungen

- **Server**: Ubuntu 20.04 LTS oder neuer (getestet mit Ubuntu 24.04.3 LTS)
- **Zugriff**: Root oder Sudo-Rechte
- **RAM**: Mindestens 1 GB
- **Git Repository**: https://github.com/herbscho94/production-management.git

---

## 🚀 Schritt-für-Schritt Installation

### 1️⃣ System vorbereiten

```bash
# SSH zum Server
ssh root@deine-server-ip

# System aktualisieren
apt update && apt upgrade -y

# Notwendige Pakete installieren
apt install -y python3 python3-pip python3-venv nginx git ufw curl

# Versionen prüfen
python3 --version  # Python 3.12+
git --version      # Git 2.43+
nginx -v           # Nginx 1.24+
```

---

### 2️⃣ Projekt vom Git Repository klonen

```bash
# Ins Web-Verzeichnis wechseln
cd /var/www

# Repository klonen
git clone https://github.com/herbscho94/production-management.git

# In Projekt-Ordner wechseln
cd production-management

# Struktur prüfen
ls -la
# Sollte zeigen: backend/ dashboards/ data/ doc/ frontend_css/ frontend_js/ index.html README.md
```

---

### 3️⃣ Python Backend einrichten

#### Virtual Environment erstellen:

```bash
cd /var/www/production-management/backend

# Virtual Environment erstellen
python3 -m venv venv

# Aktivieren
source venv/bin/activate

# Dependencies installieren
pip install -r requirements.txt

# Zusätzliches Paket (falls nicht in requirements.txt)
pip install email-validator
```

#### Environment-Datei erstellen:

```bash
# Secret Key generieren
python3 -c "import secrets; print(secrets.token_hex(32))"
# Kopiere die Ausgabe!

# .env Datei erstellen
cat > .env << 'EOF'
JWT_SECRET_KEY=HIER-DEN-GENERIERTEN-KEY-EINFÜGEN
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://DEINE-SERVER-IP","http://DEINE-DOMAIN.com","https://DEINE-DOMAIN.com"]
DATA_DIR=../data
TENANTS_FILE=../data/tenants.json
EOF

# .env prüfen
cat .env
```

**Beispiel .env (mit echtem Secret Key):**
```bash
JWT_SECRET_KEY=56e1889cc67feb8c64a633f1327143658d36d36e1bc44c920f748c9152b74bb0
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://87.106.176.134","http://localhost:8001","http://127.0.0.1:8001"]
DATA_DIR=../data
TENANTS_FILE=../data/tenants.json
```

#### Backend testen:

```bash
# Sollte noch im backend/ Ordner sein mit aktiviertem venv
uvicorn main:app --host 0.0.0.0 --port 8000

# Erwartete Ausgabe:
# INFO:     Started server process [...]
# 🚀 VBS Production Management API starting...
# 📁 Data directory: ../data
# 🔒 JWT enabled: True
# ✅ Data directory found
# INFO:     Uvicorn running on http://0.0.0.0:8000

# Mit Strg+C stoppen
```

---

### 4️⃣ Systemd Service einrichten

#### venv deaktivieren und Service erstellen:

```bash
# venv deaktivieren
deactivate

# Service-Datei erstellen
nano /etc/systemd/system/production-management.service
```

**Inhalt für Service-Datei:**

```ini
[Unit]
Description=Production Management Platform - FastAPI Backend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/production-management/backend
Environment="PATH=/var/www/production-management/backend/venv/bin"
ExecStart=/var/www/production-management/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**Speichern**: `Strg+O`, `Enter`, `Strg+X`

#### Berechtigungen setzen und Service starten:

```bash
# Berechtigungen setzen
chown -R www-data:www-data /var/www/production-management

# Service registrieren
systemctl daemon-reload

# Service aktivieren (automatischer Start beim Boot)
systemctl enable production-management

# Service starten
systemctl start production-management

# Status prüfen
systemctl status production-management
# Sollte zeigen: Active: active (running)
```

---

### 5️⃣ NGINX als Reverse Proxy einrichten

#### NGINX Konfiguration erstellen:

```bash
nano /etc/nginx/sites-available/production-management
```

**Inhalt für NGINX Config:**

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;  # Später durch Domain ersetzen
    
    root /var/www/production-management;
    index index.html;
    
    # ========================================
    # SICHERHEIT: Sensible Ordner blockieren
    # ========================================
    
    # Backend, Data, Doc blockieren
    location ~ ^/(backend|data|doc)/ {
        deny all;
        return 404;
    }
    
    # .git, .env blockieren
    location ~ /\.(git|env) {
        deny all;
        return 404;
    }
    
    # ========================================
    # FRONTEND - Öffentlich
    # ========================================
    
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache für statische Assets
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # ========================================
    # BACKEND API - Proxy
    # ========================================
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API Dokumentation
    location /api/docs {
        proxy_pass http://127.0.0.1:8000/api/docs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # ========================================
    # SECURITY HEADERS
    # ========================================
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Logs
    access_log /var/log/nginx/production-access.log;
    error_log /var/log/nginx/production-error.log;
}
```

**Speichern**: `Strg+O`, `Enter`, `Strg+X`

#### NGINX aktivieren:

```bash
# Site aktivieren
ln -s /etc/nginx/sites-available/production-management /etc/nginx/sites-enabled/

# Default-Site entfernen (optional)
rm /etc/nginx/sites-enabled/default

# Config testen
nginx -t
# Sollte zeigen: syntax is ok & test is successful

# NGINX neustarten
systemctl restart nginx

# Status prüfen
systemctl status nginx
# Sollte zeigen: Active: active (running)
```

---

### 6️⃣ Firewall konfigurieren

```bash
# SSH und HTTP/HTTPS erlauben
ufw allow OpenSSH
ufw allow 'Nginx Full'

# Firewall aktivieren
ufw --force enable

# Status prüfen
ufw status
# Sollte zeigen: Status: active
```

---

### 7️⃣ Testing & Verification

#### Backend Status prüfen:

```bash
# Service Status
systemctl status production-management

# Port 8000 prüfen
ss -tlnp | grep 8000

# Live-Logs ansehen
journalctl -u production-management -f
```

#### NGINX Status prüfen:

```bash
# Service Status
systemctl status nginx

# Port 80 prüfen
ss -tlnp | grep :80

# Error Logs
tail -f /var/log/nginx/production-error.log
```

#### Im Browser testen:

**Login-Seite:**
```
http://DEINE-SERVER-IP
```

Erwartete Elemente:
- ✅ VBS Logo
- ✅ Login-Formular
- ✅ Währungs-Rotation (฿100 → €2.60 → $2.90 → £2.20 → ¥21.00)
- ✅ "Start Free Trial" & "Learn More" Buttons

**API Dokumentation:**
```
http://DEINE-SERVER-IP/api/docs
```

**Login Credentials:**

Event Screen Rentals:
```
Username: admin@tenant_esr
Password: ESR2025!Admin
```

ClipMyHorse.TV:
```
Username: admin@tenant_cmh
Password: CMH2025!Admin
```

---

## 🔒 Optional: SSL/HTTPS mit Let's Encrypt

### Certbot installieren:

```bash
apt install -y certbot python3-certbot-nginx
```

### SSL-Zertifikat erstellen:

```bash
# Domain ersetzen mit deiner echten Domain
certbot --nginx -d deine-domain.com -d www.deine-domain.com

# Follow the prompts:
# 1. Email eingeben
# 2. Terms akzeptieren
# 3. Redirect to HTTPS: Yes (empfohlen)
```

### Auto-Renewal testen:

```bash
certbot renew --dry-run
```

### NGINX Config für Domain anpassen:

```bash
nano /etc/nginx/sites-available/production-management
```

Ändere `server_name _;` zu:
```nginx
server_name deine-domain.com www.deine-domain.com;
```

Dann:
```bash
nginx -t
systemctl reload nginx
```

---

## 🔄 Wartung & Updates

### Code aktualisieren (via Git):

```bash
# SSH zum Server
ssh root@deine-server-ip

# Code aktualisieren
cd /var/www/production-management
git pull

# Backend neustarten (falls Backend geändert)
systemctl restart production-management

# NGINX Cache leeren (optional)
systemctl reload nginx
```

### Services neustarten:

```bash
# Backend neustarten
systemctl restart production-management

# NGINX neustarten
systemctl restart nginx

# Beide gleichzeitig
systemctl restart production-management nginx
```

### Logs ansehen:

```bash
# Backend Logs (live)
journalctl -u production-management -f

# Backend Logs (letzte 50 Zeilen)
journalctl -u production-management -n 50

# NGINX Access Logs
tail -f /var/log/nginx/production-access.log

# NGINX Error Logs
tail -f /var/log/nginx/production-error.log
```

### Python Dependencies aktualisieren:

```bash
cd /var/www/production-management/backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
deactivate
systemctl restart production-management
```

---

## 🐛 Troubleshooting

### Backend startet nicht:

```bash
# Status prüfen
systemctl status production-management

# Detaillierte Logs
journalctl -u production-management -n 100

# Manuell testen
cd /var/www/production-management/backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000
```

**Häufige Probleme:**
- `.env` Datei fehlt oder falsch formatiert
- `email-validator` nicht installiert
- Falsche Berechtigungen (`chown -R www-data:www-data`)

### NGINX zeigt 502 Bad Gateway:

```bash
# Backend läuft?
systemctl status production-management

# Port 8000 lauscht?
ss -tlnp | grep 8000

# NGINX Error Log
tail -50 /var/log/nginx/production-error.log
```

### CORS-Fehler im Browser:

```bash
# .env prüfen
cat /var/www/production-management/backend/.env

# CORS_ORIGINS muss Server-IP/Domain enthalten
# Format: ["http://ip1","http://domain.com"]
```

### Port bereits belegt:

```bash
# Prozess auf Port 8000 finden
lsof -ti:8000

# Prozess beenden
kill -9 $(lsof -ti:8000)

# Service neustarten
systemctl restart production-management
```

---

## ✅ Installations-Checkliste

Nach erfolgreicher Installation sollten folgende Punkte erfüllt sein:

- [ ] Git Repository geklont nach `/var/www/production-management`
- [ ] Python venv erstellt in `backend/venv/`
- [ ] Alle Dependencies installiert (inkl. `email-validator`)
- [ ] `.env` Datei erstellt mit korrektem Secret Key
- [ ] Backend-Service läuft: `systemctl status production-management`
- [ ] NGINX läuft: `systemctl status nginx`
- [ ] Firewall aktiv: `ufw status`
- [ ] Login-Seite erreichbar: `http://server-ip`
- [ ] API Docs erreichbar: `http://server-ip/api/docs`
- [ ] Login funktioniert mit Test-Credentials
- [ ] Dashboard wird nach Login angezeigt
- [ ] Sensible Ordner blockiert (backend/, data/, .git/)

---

## 📊 Server-Spezifikationen

**Getestete Umgebung:**
- OS: Ubuntu 24.04.3 LTS
- Kernel: 6.8.0-85-generic
- Python: 3.12.3
- Nginx: 1.24.0
- Git: 2.43.0

**Empfohlene Ressourcen:**
- CPU: 1 vCore (min)
- RAM: 1 GB (min), 2 GB (empfohlen)
- Storage: 10 GB (min)
- Bandbreite: 100 Mbit/s

---

## 🔐 Sicherheits-Best-Practices

### Nach Installation durchführen:

1. **SSH absichern:**
```bash
nano /etc/ssh/sshd_config
# PasswordAuthentication no (nur Key-basiert)
systemctl restart sshd
```

2. **Fail2ban installieren:**
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

3. **Automatische Updates:**
```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

4. **Regelmäßige Backups:**
```bash
# Beispiel Backup-Script
#!/bin/bash
tar -czf /backups/production-$(date +%Y%m%d).tar.gz \
  /var/www/production-management/data \
  /var/www/production-management/backend/.env
```

---

## 📞 Support

Bei Problemen:
1. Logs prüfen (siehe Troubleshooting)
2. GitHub Issues: https://github.com/herbscho94/production-management/issues
3. Email: support@vbs-broadcast.com

---

**VBS Visionary Broadcast Services**  
© 2025 - All rights reserved  
Website: https://www.vbs-broadcast.com/

