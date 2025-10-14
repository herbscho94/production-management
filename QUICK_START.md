# Quick Start Guide - Production Management Platform

**VBS Visionary Broadcast Services**

---

## ⚡ 5-Minuten Server Setup

### 1. Repository klonen

```bash
ssh root@your-server-ip
cd /var/www
git clone https://github.com/herbscho94/production-management.git
```

### 2. Automatisches Setup

```bash
cd production-management/backend
chmod +x setup-server.sh
sudo ./setup-server.sh
```

### 3. Fertig! 🎉

Öffne im Browser:
```
http://your-server-ip
```

---

## 🔐 Login Testen

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

## 📊 Service Management

### Status prüfen
```bash
sudo systemctl status production-management
sudo systemctl status nginx
```

### Logs ansehen
```bash
sudo journalctl -u production-management -f
```

### Neustart
```bash
sudo systemctl restart production-management nginx
```

---

## 🔄 Updates

```bash
cd /var/www/production-management
git pull
sudo systemctl restart production-management
```

---

## 📚 Weitere Hilfe

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Alle Deployment-Optionen
- **[doc/SERVER_INSTALLATION.md](./doc/SERVER_INSTALLATION.md)** - Detaillierte Anleitung
- **[doc/SYSTEM_DOCUMENTATION.md](./doc/SYSTEM_DOCUMENTATION.md)** - System-Dokumentation

---

## 🆘 Problem?

### Backend läuft nicht?
```bash
sudo journalctl -u production-management -n 50
```

### NGINX Fehler?
```bash
sudo tail -50 /var/log/nginx/production-error.log
```

### Port belegt?
```bash
sudo lsof -ti:8000
sudo kill -9 $(lsof -ti:8000)
sudo systemctl restart production-management
```

---

**Support:** support@vbs-broadcast.com  
**Website:** https://www.vbs-broadcast.com/

