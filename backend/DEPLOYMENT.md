# Backend Deployment Guide

## 🚀 Quick Deploy (Automated)

### One-Command Installation

```bash
# Clone repository
cd /var/www
git clone https://github.com/herbscho94/production-management.git

# Run automated setup
cd production-management/backend
sudo chmod +x setup-server.sh
sudo ./setup-server.sh
```

**That's it!** The script will:
- ✅ Install system packages
- ✅ Create Python virtual environment
- ✅ Install dependencies
- ✅ Generate `.env` with secret key
- ✅ Create systemd service
- ✅ Configure NGINX
- ✅ Setup firewall
- ✅ Start all services

---

## 📋 Manual Installation

See complete step-by-step guide:
**[/doc/SERVER_INSTALLATION.md](../doc/SERVER_INSTALLATION.md)**

---

## 🔧 Configuration

### Environment Variables (.env)

```bash
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://your-server-ip","http://your-domain.com"]
DATA_DIR=../data
TENANTS_FILE=../data/tenants.json
```

### Generate Secret Key

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🐛 Troubleshooting

### Check Service Status

```bash
sudo systemctl status production-management
```

### View Logs

```bash
# Live logs
sudo journalctl -u production-management -f

# Last 50 lines
sudo journalctl -u production-management -n 50
```

### Restart Service

```bash
sudo systemctl restart production-management
```

### Manual Test

```bash
cd /var/www/production-management/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 📦 Dependencies

Required Python packages (see `requirements.txt`):
- fastapi==0.109.0
- uvicorn[standard]==0.27.0
- pydantic==2.5.3
- python-jose[cryptography]==3.3.0
- passlib[bcrypt]==1.7.4
- python-multipart==0.0.6
- python-dotenv==1.0.0
- aiofiles==23.2.1
- email-validator (additional)

---

## 🔄 Updates

### Pull Latest Code

```bash
cd /var/www/production-management
git pull
sudo systemctl restart production-management
```

### Update Dependencies

```bash
cd /var/www/production-management/backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
deactivate
sudo systemctl restart production-management
```

---

## 🔐 Security Notes

- Never commit `.env` to Git
- Rotate JWT secret key regularly
- Use HTTPS in production (see SSL setup in main docs)
- Keep dependencies updated
- Review firewall rules regularly

---

## 📚 More Information

- **[Complete Installation Guide](../doc/SERVER_INSTALLATION.md)**
- **[System Documentation](../doc/SYSTEM_DOCUMENTATION.md)**
- **[Changelog](../doc/CHANGELOG.md)**

---

**VBS Visionary Broadcast Services**  
© 2025 - All rights reserved

