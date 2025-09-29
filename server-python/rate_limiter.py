"""
Simple in-memory rate limiter for the AutBot application.

This is a basic implementation for demonstration purposes.
In production, consider using Redis-based rate limiting.
"""

import time
from typing import Dict, Tuple
from collections import defaultdict, deque
from fastapi import HTTPException
import threading


class SimpleRateLimiter:
    """
    Simple in-memory rate limiter using sliding window.
    
    This implementation is suitable for single-instance deployments.
    For multi-instance deployments, use Redis-based rate limiting.
    """
    
    def __init__(self):
        self._requests: Dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()
    
    def is_allowed(self, key: str, limit: int, window: int) -> Tuple[bool, Dict[str, int]]:
        """
        Check if request is allowed based on rate limit.
        
        Args:
            key: Unique identifier (e.g., IP address)
            limit: Maximum number of requests allowed
            window: Time window in seconds
            
        Returns:
            Tuple of (is_allowed, stats_dict)
        """
        current_time = time.time()
        cutoff_time = current_time - window
        
        with self._lock:
            # Remove old requests outside the window
            request_times = self._requests[key]
            while request_times and request_times[0] < cutoff_time:
                request_times.popleft()
            
            # Check if under limit
            current_count = len(request_times)
            
            if current_count >= limit:
                # Rate limit exceeded
                oldest_request = request_times[0] if request_times else current_time
                reset_time = oldest_request + window
                
                return False, {
                    "current_count": current_count,
                    "limit": limit,
                    "window": window,
                    "reset_time": int(reset_time),
                    "retry_after": int(reset_time - current_time)
                }
            
            # Allow request and record it
            request_times.append(current_time)
            
            return True, {
                "current_count": current_count + 1,
                "limit": limit,
                "window": window,
                "remaining": limit - current_count - 1
            }
    
    def cleanup_old_entries(self, max_age: int = 7200):  # 2 hours
        """Clean up old entries to prevent memory leaks."""
        current_time = time.time()
        cutoff_time = current_time - max_age
        
        with self._lock:
            keys_to_remove = []
            for key, request_times in self._requests.items():
                # Remove old requests
                while request_times and request_times[0] < cutoff_time:
                    request_times.popleft()
                
                # If no recent requests, remove the key entirely
                if not request_times:
                    keys_to_remove.append(key)
            
            for key in keys_to_remove:
                del self._requests[key]


# Global rate limiter instance
rate_limiter = SimpleRateLimiter()


def check_rate_limit(key: str, limit: int, window: int):
    """
    Decorator-friendly rate limit check.
    
    Raises HTTPException if rate limit is exceeded.
    """
    allowed, stats = rate_limiter.is_allowed(key, limit, window)
    
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "RateLimitExceeded",
                "message": f"Rate limit exceeded. Try again in {stats['retry_after']} seconds.",
                "stats": stats
            },
            headers={
                "X-RateLimit-Limit": str(stats["limit"]),
                "X-RateLimit-Window": str(stats["window"]),
                "X-RateLimit-Reset": str(stats["reset_time"]),
                "Retry-After": str(stats["retry_after"])
            }
        )
    
    return stats