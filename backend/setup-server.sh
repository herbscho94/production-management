#!/bin/bash

###############################################################################
# Production Management Platform - Automated Server Setup
# VBS Visionary Broadcast Services
###############################################################################

set -e  # Exit on error

echo "🚀 VBS Production Management Platform - Server Setup"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

echo "📋 Step 1: Installing system packages..."
apt update -qq
apt install -y python3 python3-pip python3-venv nginx git ufw curl > /dev/null 2>&1
echo -e "${GREEN}✅ System packages installed${NC}"
echo ""

echo "📁 Step 2: Checking project directory..."
if [ ! -d "/var/www/production-management" ]; then
    echo "❌ Project not found at /var/www/production-management"
    echo "Please clone the repository first:"
    echo "  cd /var/www"
    echo "  git clone https://github.com/herbscho94/production-management.git"
    exit 1
fi
cd /var/www/production-management/backend
echo -e "${GREEN}✅ Project directory found${NC}"
echo ""

echo "🐍 Step 3: Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${YELLOW}⚠️  Virtual environment already exists${NC}"
fi
echo ""

echo "📦 Step 4: Installing Python dependencies..."
source venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
pip install --quiet email-validator
deactivate
echo -e "${GREEN}✅ Python dependencies installed${NC}"
echo ""

echo "🔑 Step 5: Creating .env file..."
if [ ! -f ".env" ]; then
    # Generate secret key
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    
    # Get server IP
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "SERVER_IP_HERE")
    
    # Create .env file
    cat > .env << EOF
JWT_SECRET_KEY=${SECRET_KEY}
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://${SERVER_IP}","http://localhost:8001"]
DATA_DIR=../data
TENANTS_FILE=../data/tenants.json
EOF
    
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}   Server IP detected: ${SERVER_IP}${NC}"
    echo -e "${YELLOW}   Secret Key generated: ${SECRET_KEY:0:16}...${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi
echo ""

echo "🔧 Step 6: Creating systemd service..."
cat > /etc/systemd/system/production-management.service << 'EOF'
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
EOF

chown -R www-data:www-data /var/www/production-management
systemctl daemon-reload
systemctl enable production-management > /dev/null 2>&1
systemctl start production-management
echo -e "${GREEN}✅ Systemd service created and started${NC}"
echo ""

echo "🌐 Step 7: Configuring NGINX..."
cat > /etc/nginx/sites-available/production-management << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    root /var/www/production-management;
    index index.html;
    
    # Security: Block sensitive folders
    location ~ ^/(backend|data|doc)/ {
        deny all;
        return 404;
    }
    
    location ~ /\.(git|env) {
        deny all;
        return 404;
    }
    
    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
        
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
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
    }
    
    location /api/docs {
        proxy_pass http://127.0.0.1:8000/api/docs;
        proxy_set_header Host $host;
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    access_log /var/log/nginx/production-access.log;
    error_log /var/log/nginx/production-error.log;
}
EOF

ln -sf /etc/nginx/sites-available/production-management /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t > /dev/null 2>&1
systemctl restart nginx
echo -e "${GREEN}✅ NGINX configured and started${NC}"
echo ""

echo "🔥 Step 8: Configuring firewall..."
ufw --force allow OpenSSH > /dev/null 2>&1
ufw --force allow 'Nginx Full' > /dev/null 2>&1
ufw --force enable > /dev/null 2>&1
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

echo "✅ Step 9: Verifying installation..."
sleep 2

# Check backend
if systemctl is-active --quiet production-management; then
    echo -e "${GREEN}✅ Backend service running${NC}"
else
    echo -e "${RED}❌ Backend service not running${NC}"
    systemctl status production-management
fi

# Check NGINX
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ NGINX running${NC}"
else
    echo -e "${RED}❌ NGINX not running${NC}"
fi

# Check port
if ss -tlnp | grep -q ':8000'; then
    echo -e "${GREEN}✅ Backend listening on port 8000${NC}"
else
    echo -e "${RED}❌ Backend not listening on port 8000${NC}"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
echo "=================================================="
echo ""
echo "📍 Access your platform:"
echo "   Frontend:  http://${SERVER_IP}"
echo "   API Docs:  http://${SERVER_IP}/api/docs"
echo ""
echo "🔐 Test login credentials:"
echo "   Event Screen Rentals:"
echo "     Username: admin@tenant_esr"
echo "     Password: ESR2025!Admin"
echo ""
echo "   ClipMyHorse.TV:"
echo "     Username: admin@tenant_cmh"
echo "     Password: CMH2025!Admin"
echo ""
echo "📊 Service management:"
echo "   sudo systemctl status production-management"
echo "   sudo systemctl restart production-management"
echo "   sudo journalctl -u production-management -f"
echo ""
echo "📝 For troubleshooting, see:"
echo "   /var/www/production-management/doc/SERVER_INSTALLATION.md"
echo ""

