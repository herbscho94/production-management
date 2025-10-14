"""
Tenant Models
Pydantic models for tenant data validation
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime


class Subscription(BaseModel):
    """Subscription information"""
    plan: str
    plan_name: str
    status: str = "active"
    active_users: int = 0
    users_limit: int
    storage_gb: int
    monthly_cost_thb: int
    billing_currency: str = "THB"
    activated_at: str
    next_billing_date: str


class CompanyInfo(BaseModel):
    """Company information"""
    legal_name: str
    country: str
    city: str
    industry: str


class TenantCreate(BaseModel):
    """Create new tenant model"""
    tenant_id: str = Field(..., pattern="^tenant_[a-z0-9_]+$")
    tenant_name: str
    company_info: CompanyInfo
    plan: str = "basic"


class Tenant(BaseModel):
    """Full tenant model"""
    tenant_id: str
    tenant_name: str
    company_info: CompanyInfo
    subscription: Subscription
    data_path: str
    is_active: bool = True
    created_at: str
    
    class Config:
        from_attributes = True

