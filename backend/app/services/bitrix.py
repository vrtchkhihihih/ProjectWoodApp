import json
from urllib import request
from urllib.error import HTTPError, URLError

from sqlalchemy.orm import Session

from app.models.site import CrmSyncLog
from app.services.site_settings import get_site_settings


def _create_log(
    db: Session,
    *,
    entity_type: str,
    entity_id: str,
    status: str,
    request_url: str | None,
    payload_json: str | None,
    response_body: str | None = None,
    error_message: str | None = None,
) -> None:
    db.add(
        CrmSyncLog(
            entity_type=entity_type,
            entity_id=entity_id,
            status=status,
            request_url=request_url,
            payload_json=payload_json,
            response_body=response_body,
            error_message=error_message,
        )
    )
    db.commit()


def _post_json(url: str, payload: dict) -> str:
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    with request.urlopen(req, timeout=10) as response:
        return response.read().decode("utf-8")


def sync_contact_to_bitrix(
    db: Session,
    *,
    contact_id: int,
    customer_name: str,
    phone: str,
    email: str | None,
    subject: str | None,
    comment: str | None,
) -> None:
    settings = get_site_settings(db)
    if not settings.bitrix_sync_contacts or not settings.bitrix_webhook_url:
        return

    payload = {
        "fields": {
            "TITLE": subject or f"Заявка с сайта #{contact_id}",
            "NAME": customer_name,
            "PHONE": [{"VALUE": phone, "VALUE_TYPE": "WORK"}],
            "EMAIL": [{"VALUE": email, "VALUE_TYPE": "WORK"}] if email else [],
            "COMMENTS": comment or "",
            "CATEGORY_ID": settings.bitrix_pipeline_id,
            "ASSIGNED_BY_ID": settings.bitrix_responsible_id,
        }
    }
    payload_json = json.dumps(payload, ensure_ascii=False)
    try:
        response_body = _post_json(settings.bitrix_webhook_url, payload)
        _create_log(
            db,
            entity_type="contact_request",
            entity_id=str(contact_id),
            status="success",
            request_url=settings.bitrix_webhook_url,
            payload_json=payload_json,
            response_body=response_body,
        )
    except (HTTPError, URLError, TimeoutError, ValueError) as exc:
        _create_log(
            db,
            entity_type="contact_request",
            entity_id=str(contact_id),
            status="error",
            request_url=settings.bitrix_webhook_url,
            payload_json=payload_json,
            error_message=str(exc),
        )


def sync_order_to_bitrix(
    db: Session,
    *,
    order_id: int,
    order_number: str,
    customer_name: str,
    phone: str,
    email: str,
    comment: str | None,
    total_amount: int,
    item_lines: list[str],
) -> None:
    settings = get_site_settings(db)
    if not settings.bitrix_sync_orders or not settings.bitrix_webhook_url:
        return

    payload = {
        "fields": {
            "TITLE": f"Заказ {order_number}",
            "NAME": customer_name,
            "PHONE": [{"VALUE": phone, "VALUE_TYPE": "WORK"}],
            "EMAIL": [{"VALUE": email, "VALUE_TYPE": "WORK"}],
            "COMMENTS": "\n".join(
                [
                    f"Номер заказа: {order_number}",
                    f"Сумма: {total_amount} ₽",
                    f"Комментарий: {comment or '-'}",
                    "",
                    "Состав заказа:",
                    *item_lines,
                ]
            ),
            "CATEGORY_ID": settings.bitrix_pipeline_id,
            "ASSIGNED_BY_ID": settings.bitrix_responsible_id,
        }
    }
    payload_json = json.dumps(payload, ensure_ascii=False)
    try:
        response_body = _post_json(settings.bitrix_webhook_url, payload)
        _create_log(
            db,
            entity_type="order",
            entity_id=str(order_id),
            status="success",
            request_url=settings.bitrix_webhook_url,
            payload_json=payload_json,
            response_body=response_body,
        )
    except (HTTPError, URLError, TimeoutError, ValueError) as exc:
        _create_log(
            db,
            entity_type="order",
            entity_id=str(order_id),
            status="error",
            request_url=settings.bitrix_webhook_url,
            payload_json=payload_json,
            error_message=str(exc),
        )
