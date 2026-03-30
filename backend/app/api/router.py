from fastapi import APIRouter

from app.api.routes.analytics import router as analytics_router
from app.api.routes.auth import router as auth_router
from app.api.routes.cart import router as cart_router
from app.api.routes.contacts import router as contacts_router
from app.api.routes.crm import router as crm_router
from app.api.routes.health import router as health_router
from app.api.routes.orders import router as orders_router
from app.api.routes.products import router as products_router
from app.api.routes.settings import router as settings_router
from app.api.routes.wishlist import router as wishlist_router


api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(cart_router, tags=["cart"])
api_router.include_router(wishlist_router, tags=["wishlist"])
api_router.include_router(settings_router, prefix="/settings", tags=["settings"])
api_router.include_router(analytics_router, prefix="/analytics-events", tags=["analytics-events"])
api_router.include_router(crm_router, prefix="/crm", tags=["crm"])
api_router.include_router(contacts_router, prefix="/contact-requests", tags=["contact-requests"])
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(products_router, prefix="/products", tags=["products"])
api_router.include_router(orders_router, prefix="/orders", tags=["orders"])
