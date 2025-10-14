"""
Equipment Models
Pydantic models for equipment data validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date


class Accessory(BaseModel):
    """Equipment accessory model"""
    id: str
    name: str
    description: Optional[str] = ""


class TechnicalData(BaseModel):
    """Technical specifications model"""
    resolution: Optional[str] = None
    weight_kg: Optional[float] = None
    battery_life_min: Optional[int] = None
    accessories: Optional[List[Accessory]] = []
    description: Optional[str] = ""


class UsageInfo(BaseModel):
    """Equipment usage information model"""
    usage_type: str = Field(..., pattern="^(internal|rental)$")
    is_active: bool
    user_id: int
    start_date: str
    end_date: str
    price_per_day: Optional[float] = None
    description: Optional[str] = ""


class EquipmentCreate(BaseModel):
    """Create new equipment model"""
    name: str
    type: str
    status: str = Field(default="available", pattern="^(available|in_use|maintenance)$")
    location: str
    description: Optional[str] = ""
    usage_info: Optional[List[UsageInfo]] = []
    technical_data: Optional[TechnicalData] = None


class Equipment(BaseModel):
    """Full equipment model"""
    id: int
    tenant_id: str
    name: str
    type: str
    status: str
    location: str
    description: Optional[str] = ""
    usage_info: List[UsageInfo] = []
    technical_data: Optional[TechnicalData] = None
    
    class Config:
        from_attributes = True

