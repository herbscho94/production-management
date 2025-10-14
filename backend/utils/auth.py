"""
Authentication Manager
Handles JWT tokens and password hashing
"""

from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthManager:
    """Manages authentication and authorization"""
    
    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        self.secret_key = secret_key
        self.algorithm = algorithm
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash
        Also supports plain text for development (temporary)
        """
        # Check if password is already hashed (starts with $2b$ for bcrypt)
        if hashed_password.startswith('$2b$') or hashed_password.startswith('$2a$'):
            return pwd_context.verify(plain_password, hashed_password)
        else:
            # Plain text comparison (DEVELOPMENT ONLY)
            return plain_password == hashed_password
    
    def create_access_token(
        self, 
        data: Dict, 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a JWT access token
        
        Args:
            data: Dictionary with user data (user_id, tenant_id, role, permissions)
            expires_delta: Optional expiration time delta
        
        Returns:
            JWT token string
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=24)
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow()
        })
        
        encoded_jwt = jwt.encode(
            to_encode, 
            self.secret_key, 
            algorithm=self.algorithm
        )
        
        return encoded_jwt
    
    def decode_token(self, token: str) -> Dict:
        """
        Decode and validate JWT token
        
        Args:
            token: JWT token string
        
        Returns:
            Decoded token payload
        
        Raises:
            JWTError: If token is invalid or expired
        """
        try:
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=[self.algorithm]
            )
            return payload
        except JWTError as e:
            raise ValueError(f"Invalid token: {str(e)}")
    
    def check_permission(self, user_payload: Dict, required_permission: str) -> bool:
        """
        Check if user has a specific permission
        
        Args:
            user_payload: Decoded JWT token payload
            required_permission: Permission string to check
        
        Returns:
            True if user has permission, False otherwise
        """
        permissions = user_payload.get('permissions', [])
        return required_permission in permissions
    
    def check_role(self, user_payload: Dict, required_role: str) -> bool:
        """
        Check if user has a specific role
        
        Args:
            user_payload: Decoded JWT token payload
            required_role: Role string to check (e.g., 'admin')
        
        Returns:
            True if user has role, False otherwise
        """
        return user_payload.get('role') == required_role

