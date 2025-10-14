"""
Validation Utilities
Additional validation functions for API requests
"""

from fastapi import HTTPException, status
from typing import Dict


def validate_tenant_access(token_payload: Dict, requested_tenant_id: str) -> None:
    """
    Validate that user has access to requested tenant
    
    Args:
        token_payload: Decoded JWT token
        requested_tenant_id: Tenant ID from request
    
    Raises:
        HTTPException: If access is denied
    """
    user_tenant_id = token_payload.get('tenant_id')
    
    if user_tenant_id != requested_tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied to tenant {requested_tenant_id}"
        )


def validate_permission(token_payload: Dict, required_permission: str) -> None:
    """
    Validate that user has required permission
    
    Args:
        token_payload: Decoded JWT token
        required_permission: Permission string required
    
    Raises:
        HTTPException: If permission is missing
    """
    permissions = token_payload.get('permissions', [])
    
    if required_permission not in permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission '{required_permission}' required"
        )


def validate_role(token_payload: Dict, required_role: str) -> None:
    """
    Validate that user has required role
    
    Args:
        token_payload: Decoded JWT token
        required_role: Role string required
    
    Raises:
        HTTPException: If role doesn't match
    """
    user_role = token_payload.get('role')
    
    if user_role != required_role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{required_role}' required"
        )

