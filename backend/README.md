# Backend

Базовый backend для миграции проекта на `FastAPI + MySQL`.

## Запуск

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

API будет доступно на `http://localhost:8000`.

## Что уже есть

- `GET /` - корневой endpoint
- `GET /api/v1/health` - healthcheck
- `GET /api/v1/products` - список коллекций
- `GET /api/v1/products/{product_id}` - детали коллекции
- `POST /api/v1/orders` - создание заявки
- `GET /api/v1/orders` - список заявок
- `POST /api/v1/contact-requests` - заявка со страницы контактов
- `GET /api/v1/contact-requests` - список контактных заявок

## Следующий этап

- подключить SQLAlchemy и MySQL таблицы;
- перенести каталог из фронтенда в БД;
- добавить пользователей, заказы, корзину и админские сущности;
- вынести интеграцию с Битрикс24 на сервер.

## MySQL

По умолчанию используется строка подключения:

```env
DATABASE_URL=mysql+mysqlconnector://woodapp:woodapp@localhost:3306/woodapp
```

При старте backend пытается:

- создать таблицы `collections` и `collection_colors`;
- наполнить их стартовыми данными каталога.

Если MySQL пока не поднят, API всё равно останется рабочим за счёт временного fallback на встроенные данные.
