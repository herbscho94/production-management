"""
User Models
Pydantic models for user data validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserLogin(BaseModel):
    """Login request model"""
    username: str = Field(..., description="Username in format: username@tenant_id")
    password: str = Field(..., min_length=1)


class PersonalInfo(BaseModel):
    """Personal information model"""
    first_name: str
    last_name: str
    position: Optional[str] = None
    department: Optional[str] = None
    employee_number: Optional[str] = None
    company: Optional[str] = None


class ContactInfo(BaseModel):
    """Contact information model"""
    email: EmailStr
    phone: str
    mobile: Optional[str] = None


class UserCreate(BaseModel):
    """Create new user model"""
    username: str = Field(..., description="Username (without @tenant_id)")
    password: str = Field(..., min_length=6)
    user_type: str = Field(default="employee", pattern="^(employee|customer)$")
    personal_info: PersonalInfo
    contact_info: ContactInfo
    role: str = Field(default="editor")
    permissions: List[str] = []
    notes: Optional[str] = ""


class User(BaseModel):
    """Full user model"""
    user_id: int
    tenant_id: str
    user_type: str
    personal_info: Dict[str, Any]
    contact_info: Dict[str, Any]
    access_credentials: Dict[str, Any]
    notes: Optional[str] = ""
    
    class Config:
        from_attributes = True

