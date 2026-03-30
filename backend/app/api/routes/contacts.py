from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.contacts import create_contact_request, list_contact_requests
from app.schemas.contact import ContactRequestCreate, ContactRequestRead
from app.services.bitrix import sync_contact_to_bitrix


router = APIRouter()


@router.post("", response_model=ContactRequestRead, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactRequestCreate, db: Session = Depends(get_db)) -> ContactRequestRead:
    item = create_contact_request(db, payload)
    sync_contact_to_bitrix(
        db,
        contact_id=item.id,
        customer_name=item.customer_name,
        phone=item.phone,
        email=item.email,
        subject=item.subject,
        comment=item.comment,
    )
    return ContactRequestRead.model_validate(item)


@router.get("", response_model=list[ContactRequestRead])
def list_contacts(db: Session = Depends(get_db)) -> list[ContactRequestRead]:
    return [ContactRequestRead.model_validate(item) for item in list_contact_requests(db)]
