"""
VBS Production Management Platform - Backend API
Main FastAPI Application

Author: VBS Visionary Broadcast Services
Version: 1.0.0
Date: October 2025
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import os
from datetime import datetime, timedelta
from pathlib import Path

# Import custom modules
from utils.data_manager import DataManager
from utils.auth import AuthManager
from utils.validators import validate_tenant_access
from models.tenant import Tenant, TenantCreate
from models.user import User, UserCreate, UserLogin
from models.equipment import Equipment, EquipmentCreate
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Production Management Platform API",
    description="VBS Multi-Tenant Production & Resource Management System",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
data_manager = DataManager(settings.DATA_DIR)
auth_manager = AuthManager(settings.JWT_SECRET_KEY)
security = HTTPBearer()

# =====================================================
# HEALTH & INFO ENDPOINTS
# =====================================================

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "VBS Production Management Platform API",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/api/docs",
        "multi_tenant": True
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# =====================================================
# AUTHENTICATION ENDPOINTS
# =====================================================

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """
    Login endpoint for multi-tenant authentication
    
    Username format: username@tenant_id
    Returns JWT token and user information
    """
    try:
        # Parse username@tenant_id
        if '@' not in credentials.username:
            raise HTTPException(
                status_code=400,
                detail="Invalid username format. Use: username@tenant_id"
            )
        
        username_part, tenant_id = credentials.username.split('@', 1)
        
        # Validate tenant exists and is active
        tenant = await data_manager.get_tenant(tenant_id)
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        if not tenant.get('is_active'):
            raise HTTPException(status_code=403, detail="Tenant account is inactive")
        
        # Load tenant users
        users_data = await data_manager.get_tenant_users(tenant_id)
        
        # Find user
        user = None
        for u in users_data.get('users', []):
            if u.get('access_credentials', {}).get('username') == credentials.username:
                user = u
                break
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        creds = user.get('access_credentials', {})
        
        # Check if user is active
        if not creds.get('is_active'):
            raise HTTPException(status_code=403, detail="User account is inactive")
        
        # Validate password
        if not auth_manager.verify_password(credentials.password, creds.get('password', '')):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create JWT token
        token_data = {
            "user_id": user.get('user_id'),
            "tenant_id": tenant_id,
            "username": credentials.username,
            "role": creds.get('role'),
            "permissions": creds.get('permissions', [])
        }
        
        token = auth_manager.create_access_token(token_data)
        
        # Update last login (in memory for now)
        # TODO: Persist to file
        
        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "user_id": user.get('user_id'),
                "tenant_id": tenant_id,
                "tenant_name": tenant.get('tenant_name'),
                "username": credentials.username,
                "first_name": user.get('personal_info', {}).get('first_name'),
                "last_name": user.get('personal_info', {}).get('last_name'),
                "role": creds.get('role'),
                "permissions": creds.get('permissions', [])
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.post("/api/auth/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout endpoint (client-side token removal)"""
    return {"success": True, "message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user information from token"""
    try:
        token = credentials.credentials
        payload = auth_manager.decode_token(token)
        return {"success": True, "user": payload}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# =====================================================
# TENANT ENDPOINTS (Admin only)
# =====================================================

@app.get("/api/admin/tenants")
async def list_tenants(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """List all tenants (VBS admin only)"""
    # TODO: Check if user is VBS admin
    tenants = await data_manager.get_all_tenants()
    return {"success": True, "data": tenants}

@app.get("/api/tenants/{tenant_id}")
async def get_tenant(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get tenant information"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    # Check tenant access
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied to this tenant")
    
    tenant = await data_manager.get_tenant(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    return {"success": True, "data": tenant}

# =====================================================
# USER ENDPOINTS (Tenant-specific)
# =====================================================

@app.get("/api/tenants/{tenant_id}/users")
async def list_users(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """List all users in a tenant"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    # Validate tenant access
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied to this tenant")
    
    # Check permission
    if 'user_management' not in payload.get('permissions', []):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    users_data = await data_manager.get_tenant_users(tenant_id)
    
    # Remove passwords from response
    for user in users_data.get('users', []):
        if 'access_credentials' in user and 'password' in user['access_credentials']:
            del user['access_credentials']['password']
    
    return {"success": True, "data": users_data.get('users', [])}

@app.post("/api/tenants/{tenant_id}/users")
async def create_user(
    tenant_id: str,
    user_data: UserCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new user in tenant"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    # Validate tenant access
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied to this tenant")
    
    # Check permission
    if 'user_management' not in payload.get('permissions', []):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    try:
        new_user = await data_manager.create_user(tenant_id, user_data.dict())
        return {"success": True, "data": new_user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/tenants/{tenant_id}/users/{user_id}")
async def get_user(
    tenant_id: str,
    user_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get specific user details"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    user = await data_manager.get_user(tenant_id, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove password
    if 'access_credentials' in user and 'password' in user['access_credentials']:
        del user['access_credentials']['password']
    
    return {"success": True, "data": user}

@app.put("/api/tenants/{tenant_id}/users/{user_id}")
async def update_user(
    tenant_id: str,
    user_id: int,
    user_data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update user information"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if 'user_management' not in payload.get('permissions', []):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    updated_user = await data_manager.update_user(tenant_id, user_id, user_data)
    return {"success": True, "data": updated_user}

# =====================================================
# EQUIPMENT ENDPOINTS (Tenant-specific)
# =====================================================

@app.get("/api/tenants/{tenant_id}/equipment")
async def list_equipment(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """List all equipment in a tenant"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    equipment_data = await data_manager.get_tenant_equipment(tenant_id)
    return {"success": True, "data": equipment_data.get('equipment', [])}

@app.post("/api/tenants/{tenant_id}/equipment")
async def create_equipment(
    tenant_id: str,
    equipment_data: EquipmentCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create new equipment"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if 'equipment_management' not in payload.get('permissions', []):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    new_equipment = await data_manager.create_equipment(tenant_id, equipment_data.dict())
    return {"success": True, "data": new_equipment}

@app.get("/api/tenants/{tenant_id}/equipment/{equipment_id}")
async def get_equipment(
    tenant_id: str,
    equipment_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get specific equipment details"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    equipment = await data_manager.get_equipment(tenant_id, equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    return {"success": True, "data": equipment}

# =====================================================
# DATA EXPORT ENDPOINTS
# =====================================================

@app.get("/api/tenants/{tenant_id}/export/full")
async def export_full_data(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Export complete tenant data"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get all tenant data
    users = await data_manager.get_tenant_users(tenant_id)
    equipment = await data_manager.get_tenant_equipment(tenant_id)
    tenant_info = await data_manager.get_tenant(tenant_id)
    
    export_data = {
        "exported_at": datetime.utcnow().isoformat(),
        "tenant": tenant_info,
        "users": users,
        "equipment": equipment
    }
    
    return {"success": True, "data": export_data}

@app.get("/api/tenants/{tenant_id}/export/users")
async def export_users(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Export only users data"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    users = await data_manager.get_tenant_users(tenant_id)
    
    return {"success": True, "data": users}

@app.get("/api/tenants/{tenant_id}/export/equipment")
async def export_equipment(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Export only equipment data"""
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    equipment = await data_manager.get_tenant_equipment(tenant_id)
    
    return {"success": True, "data": equipment}

# =====================================================
# CRM ENDPOINTS
# =====================================================

@app.get("/api/tenants/{tenant_id}/crm")
async def get_crm_data(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get CRM data (customers, communications, quotes, invoices)
    """
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Load CRM data
    crm_file = Path(settings.DATA_DIR) / "tenants" / tenant_id / "crm.json"
    
    if not crm_file.exists():
        # Return empty CRM structure if file doesn't exist
        return {
            "customers": [],
            "communications": [],
            "quotes": [],
            "invoices": []
        }
    
    import json
    try:
        with open(crm_file, 'r', encoding='utf-8') as f:
            crm_data = json.load(f)
        return crm_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load CRM data: {str(e)}")

# =====================================================
# PRODUCTION ENDPOINTS
# =====================================================

@app.get("/api/tenants/{tenant_id}/productions")
async def get_productions(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get all productions/bookings/events for a tenant
    """
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Load production data
    production_file = Path(settings.DATA_DIR) / "tenants" / tenant_id / "production.json"
    
    if not production_file.exists():
        # Return empty production structure if file doesn't exist
        return {
            "productions": []
        }
    
    import json
    try:
        with open(production_file, 'r', encoding='utf-8') as f:
            production_data = json.load(f)
        return production_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load production data: {str(e)}")

# =====================================================
# DASHBOARD CONFIG ENDPOINTS
# =====================================================

@app.get("/api/tenants/{tenant_id}/dashboard-config")
async def get_dashboard_config(
    tenant_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get dashboard configuration and branding for a tenant
    """
    payload = auth_manager.decode_token(credentials.credentials)
    
    if payload['tenant_id'] != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Load dashboard config
    config_file = Path(settings.DATA_DIR) / "tenants" / tenant_id / "dashboard-config.json"
    
    if not config_file.exists():
        # Return default config if file doesn't exist
        return {
            "tenant_id": tenant_id,
            "branding": {
                "company_name": "Production Management",
                "logo_url": "",
                "platform_subtitle": "Production Management Platform"
            }
        }
    
    import json
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            config_data = json.load(f)
        return config_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dashboard config: {str(e)}")

# =====================================================
# ERROR HANDLERS
# =====================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail
            }
        }
    )

# =====================================================
# STARTUP & SHUTDOWN EVENTS
# =====================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("🚀 VBS Production Management API starting...")
    print(f"📁 Data directory: {settings.DATA_DIR}")
    print(f"🔒 JWT enabled: {bool(settings.JWT_SECRET_KEY)}")
    print(f"🌐 CORS origins: {settings.CORS_ORIGINS}")
    
    # Verify data directory exists
    if not Path(settings.DATA_DIR).exists():
        print("⚠️  Warning: Data directory not found")
    else:
        print("✅ Data directory found")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("👋 VBS Production Management API shutting down...")

# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True if settings.ENVIRONMENT == "development" else False,
        log_level=settings.LOG_LEVEL.lower()
    )

