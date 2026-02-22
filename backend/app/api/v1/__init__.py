from fastapi import APIRouter

from app.api.v1.endpoints import bible, plans, units, random_verse, feedback

api_router = APIRouter(prefix="/v1", tags=["v1"])

api_router.include_router(bible.router, prefix="/books", tags=["bible"])
api_router.include_router(bible.router_metadata, prefix="/metadata", tags=["bible"])
api_router.include_router(bible.router_verses, prefix="/verses", tags=["bible"])
api_router.include_router(plans.router, prefix="/plan", tags=["plans"])
api_router.include_router(units.router, prefix="/unit", tags=["units"])
api_router.include_router(random_verse.router, prefix="/random-verse", tags=["random"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
