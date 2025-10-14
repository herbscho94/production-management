"""
Data Manager
Handles all JSON file operations for multi-tenant data
"""

import json
import aiofiles
from pathlib import Path
from typing import Optional, Dict, List, Any
from datetime import datetime


class DataManager:
    """Manages reading and writing JSON data files"""
    
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.tenants_file = self.data_dir / "tenants.json"
    
    async def _read_json(self, file_path: Path) -> Dict:
        """Read JSON file asynchronously"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                content = await f.read()
                return json.loads(content)
        except FileNotFoundError:
            return {}
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in {file_path}: {e}")
    
    async def _write_json(self, file_path: Path, data: Dict) -> None:
        """Write JSON file asynchronously"""
        file_path.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(data, indent=2, ensure_ascii=False))
    
    # =====================================================
    # TENANT OPERATIONS
    # =====================================================
    
    async def get_all_tenants(self) -> List[Dict]:
        """Get all tenants from registry"""
        data = await self._read_json(self.tenants_file)
        return data.get('tenants', [])
    
    async def get_tenant(self, tenant_id: str) -> Optional[Dict]:
        """Get specific tenant by ID"""
        tenants = await self.get_all_tenants()
        for tenant in tenants:
            if tenant.get('tenant_id') == tenant_id:
                return tenant
        return None
    
    async def get_tenant_config(self) -> Dict:
        """Get global tenant configuration"""
        data = await self._read_json(self.tenants_file)
        return data.get('config', {})
    
    # =====================================================
    # USER OPERATIONS
    # =====================================================
    
    async def get_tenant_users(self, tenant_id: str) -> Dict:
        """Get all users for a tenant"""
        tenant = await self.get_tenant(tenant_id)
        if not tenant:
            raise ValueError(f"Tenant {tenant_id} not found")
        
        users_file = self.data_dir / tenant['data_path'] / 'users.json'
        return await self._read_json(users_file)
    
    async def get_user(self, tenant_id: str, user_id: int) -> Optional[Dict]:
        """Get specific user"""
        users_data = await self.get_tenant_users(tenant_id)
        for user in users_data.get('users', []):
            if user.get('user_id') == user_id:
                return user
        return None
    
    async def create_user(self, tenant_id: str, user_data: Dict) -> Dict:
        """Create new user in tenant"""
        users_data = await self.get_tenant_users(tenant_id)
        tenant = await self.get_tenant(tenant_id)
        
        # Generate new user ID
        existing_ids = [u.get('user_id', 0) for u in users_data.get('users', [])]
        new_id = max(existing_ids, default=0) + 1
        
        # Create user object
        new_user = {
            "user_id": new_id,
            "tenant_id": tenant_id,
            "user_type": user_data.get('user_type', 'employee'),
            "personal_info": user_data.get('personal_info', {}),
            "contact_info": user_data.get('contact_info', {}),
            "access_credentials": {
                "username": f"{user_data['username']}@{tenant_id}",
                "password": user_data.get('password'),  # Should be hashed
                "role": user_data.get('role', 'editor'),
                "permissions": user_data.get('permissions', []),
                "is_active": True,
                "created_at": datetime.utcnow().isoformat()
            },
            "notes": user_data.get('notes', '')
        }
        
        # Add to users list
        users_data.setdefault('users', []).append(new_user)
        
        # Save
        users_file = self.data_dir / tenant['data_path'] / 'users.json'
        await self._write_json(users_file, users_data)
        
        return new_user
    
    async def update_user(self, tenant_id: str, user_id: int, update_data: Dict) -> Dict:
        """Update existing user"""
        users_data = await self.get_tenant_users(tenant_id)
        tenant = await self.get_tenant(tenant_id)
        
        # Find user
        user_index = None
        for i, user in enumerate(users_data.get('users', [])):
            if user.get('user_id') == user_id:
                user_index = i
                break
        
        if user_index is None:
            raise ValueError(f"User {user_id} not found")
        
        # Update user
        users_data['users'][user_index].update(update_data)
        
        # Save
        users_file = self.data_dir / tenant['data_path'] / 'users.json'
        await self._write_json(users_file, users_data)
        
        return users_data['users'][user_index]
    
    # =====================================================
    # EQUIPMENT OPERATIONS
    # =====================================================
    
    async def get_tenant_equipment(self, tenant_id: str) -> Dict:
        """Get all equipment for a tenant"""
        tenant = await self.get_tenant(tenant_id)
        if not tenant:
            raise ValueError(f"Tenant {tenant_id} not found")
        
        equipment_file = self.data_dir / tenant['data_path'] / 'equipment.json'
        return await self._read_json(equipment_file)
    
    async def get_equipment(self, tenant_id: str, equipment_id: int) -> Optional[Dict]:
        """Get specific equipment"""
        equipment_data = await self.get_tenant_equipment(tenant_id)
        for equipment in equipment_data.get('equipment', []):
            if equipment.get('id') == equipment_id:
                return equipment
        return None
    
    async def create_equipment(self, tenant_id: str, equipment_data: Dict) -> Dict:
        """Create new equipment"""
        data = await self.get_tenant_equipment(tenant_id)
        tenant = await self.get_tenant(tenant_id)
        
        # Generate new ID
        existing_ids = [e.get('id', 0) for e in data.get('equipment', [])]
        new_id = max(existing_ids, default=0) + 1
        
        # Create equipment object
        new_equipment = {
            "id": new_id,
            "tenant_id": tenant_id,
            **equipment_data
        }
        
        # Add to equipment list
        data.setdefault('equipment', []).append(new_equipment)
        
        # Save
        equipment_file = self.data_dir / tenant['data_path'] / 'equipment.json'
        await self._write_json(equipment_file, data)
        
        return new_equipment
    
    async def update_equipment(self, tenant_id: str, equipment_id: int, update_data: Dict) -> Dict:
        """Update existing equipment"""
        data = await self.get_tenant_equipment(tenant_id)
        tenant = await self.get_tenant(tenant_id)
        
        # Find equipment
        eq_index = None
        for i, eq in enumerate(data.get('equipment', [])):
            if eq.get('id') == equipment_id:
                eq_index = i
                break
        
        if eq_index is None:
            raise ValueError(f"Equipment {equipment_id} not found")
        
        # Update equipment
        data['equipment'][eq_index].update(update_data)
        
        # Save
        equipment_file = self.data_dir / tenant['data_path'] / 'equipment.json'
        await self._write_json(equipment_file, data)
        
        return data['equipment'][eq_index]

