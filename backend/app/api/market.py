from fastapi import APIRouter, Depends
from ..ai.market import get_market_indices
from .auth import get_current_user
from ..models.user import User

router = APIRouter()

@router.get("/indices")
async def fetch_indices(current_user: User = Depends(get_current_user)):
    """
    Fetch current market indices (Nifty, Sensex, Gold) via AI search.
    """
    indices = await get_market_indices()
    return indices
