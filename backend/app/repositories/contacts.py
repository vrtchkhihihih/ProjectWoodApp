from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contact import ContactRequest
from app.schemas.contact import ContactRequestCreate


def create_contact_request(db: Session, payload: ContactRequestCreate) -> ContactRequest:
    item = ContactRequest(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_contact_requests(db: Session) -> list[ContactRequest]:
    query = select(ContactRequest).order_by(ContactRequest.id.desc())
    return db.execute(query).scalars().all()
