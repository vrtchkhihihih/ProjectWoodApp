# Frontend

Базовый frontend для миграции проекта на `Next.js + TypeScript`.

## Запуск

```bash
npm install
copy .env.local.example .env.local
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

## Что уже есть

- App Router
- TypeScript-конфигурация
- главная страница
- каталог коллекций
- детальная страница коллекции
- подключение к FastAPI через `NEXT_PUBLIC_API_URL`

## Следующий этап

- перенести дизайн со старого `site/`;
- заменить временные `img` URL на нормальные media endpoints;
- добавить авторизацию, корзину, заказы и админские сценарии;
- подключить реальные API для Bitrix24 и аналитики.
