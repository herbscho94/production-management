# Production Management Platform - Backend API

**VBS Visionary Broadcast Services**  
**Python FastAPI Backend**

---

## 🚀 Quick Start

### 1. Installation

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env and set your JWT secret
nano .env
```

### 3. Run Server

**Easy way:**
```bash
chmod +x start.sh
./start.sh
```

**Manual way:**
```bash
source venv/bin/activate
python3 main.py
```

**Server will start on:**
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

---

## 📚 API Documentation

### Interactive Documentation

Once the server is running, visit:
- **Swagger UI:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc

Both provide interactive API testing!

---

## 🔐 Authentication

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "admin@tenant_esr",
  "password": "ESR2025!Admin"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "user_id": 1,
    "tenant_id": "tenant_esr",
    "tenant_name": "Event Screen Rentals",
    "username": "admin@tenant_esr",
    "first_name": "Admin",
    "last_name": "ESR",
    "role": "admin",
    "permissions": [...]
  }
}
```

### Using the Token

Add to all subsequent requests:

```
Authorization: Bearer eyJhbGc...
```

---

## 📡 API Endpoints

### Health & Info

```
GET  /                    # API information
GET  /api/health          # Health check
```

### Authentication

```
POST /api/auth/login      # Login with username@tenant_id
POST /api/auth/logout     # Logout (client-side)
GET  /api/auth/me         # Get current user info
```

### Tenants (Admin)

```
GET  /api/admin/tenants           # List all tenants (VBS admin)
GET  /api/tenants/{tenant_id}     # Get tenant info
```

### Users (Tenant-specific)

```
GET    /api/tenants/{tenant_id}/users           # List users
POST   /api/tenants/{tenant_id}/users           # Create user
GET    /api/tenants/{tenant_id}/users/{id}      # Get user
PUT    /api/tenants/{tenant_id}/users/{id}      # Update user
```

### Equipment (Tenant-specific)

```
GET    /api/tenants/{tenant_id}/equipment       # List equipment
POST   /api/tenants/{tenant_id}/equipment       # Create equipment
GET    /api/tenants/{tenant_id}/equipment/{id}  # Get equipment
PUT    /api/tenants/{tenant_id}/equipment/{id}  # Update equipment
```

### Data Export

```
GET  /api/tenants/{tenant_id}/export/full       # Export all data
GET  /api/tenants/{tenant_id}/export/users      # Export users only
GET  /api/tenants/{tenant_id}/export/equipment  # Export equipment only
```

---

## 🏗️ Project Structure

```
backend/
├── main.py                    # FastAPI application (main entry)
├── config.py                  # Configuration management
├── requirements.txt           # Python dependencies
├── start.sh                   # Quick start script
├── env.example                # Environment template
│
├── models/                    # Pydantic data models
│   ├── __init__.py
│   ├── user.py               # User models
│   ├── tenant.py             # Tenant models
│   └── equipment.py          # Equipment models
│
└── utils/                     # Utility functions
    ├── __init__.py
    ├── data_manager.py       # JSON file operations
    ├── auth.py               # JWT & password hashing
    └── validators.py         # Permission validators
```

---

## 🔒 Security Features

### Multi-Tenant Isolation

Every endpoint validates:
1. JWT token is valid
2. User belongs to requested tenant
3. User has required permissions

### Password Security

- Bcrypt hashing (12 rounds)
- Plain text support for development
- Automatic detection (hashed vs plain)

### Rate Limiting

- 100 requests per 15 minutes per IP
- Prevents brute force attacks

### CORS

- Configurable origins
- Credentials support
- Secure headers

---

## 🧪 Testing

### Test Logins

**Event Screen Rentals:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@tenant_esr","password":"ESR2025!Admin"}'
```

**ClipMyHorse.TV:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@tenant_cmh","password":"CMH2025!Admin"}'
```

### Test with Token

```bash
# Save token
TOKEN="eyJhbGc..."

# Get current user
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# List users
curl -X GET http://localhost:8000/api/tenants/tenant_esr/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📦 Dependencies

### Core

- **FastAPI** - Modern async web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Security

- **python-jose** - JWT implementation
- **passlib** - Password hashing (bcrypt)

### Utilities

- **aiofiles** - Async file operations
- **python-dateutil** - Date utilities

---

## 🚀 Deployment

### Development

```bash
./start.sh
# or
uvicorn main:app --reload --port 8000
```

### Production

**Railway.app:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**Render.com:**
1. Connect GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Docker:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Find process on port 8000
lsof -ti:8000

# Kill process
kill -9 $(lsof -ti:8000)
```

### Module not found

```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### CORS errors

Update `.env`:
```
CORS_ORIGINS=http://localhost:8000,http://your-frontend-url
```

---

## 📝 Development Notes

### Adding New Endpoints

1. Add route in `main.py`
2. Create model in `models/` if needed
3. Add data operations in `utils/data_manager.py`
4. Test with Swagger UI

### Adding Permissions

1. Update user in tenant's `users.json`
2. Add permission to `permissions` array
3. Check permission in endpoint with `validate_permission()`

---

## 🎯 Next Steps

- [ ] Add booking endpoints
- [ ] Add project management
- [ ] Implement file upload (images)
- [ ] Add real-time notifications
- [ ] Implement caching (Redis)
- [ ] Add database migration (PostgreSQL)

---

**VBS Visionary Broadcast Services**  
**Website:** https://www.vbs-broadcast.com/

