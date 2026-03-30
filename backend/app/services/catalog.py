from app.schemas.product import CollectionCard, ProductColor, ProductDetail


CATALOG_DATA = [
    {
        "id": "classic",
        "name": "Classic",
        "description": "Лаконичные акустические панели с широкой палитрой декоров и вариантами основы из черного или серого фетра.",
        "preview_image": "/legacy/home/classic-home.png",
        "colors": [
            {"id": "cl-01", "name": "Дуб Сонома светлый", "image": "/legacy/products/cl-01.jpg", "felt": "черный", "art": "01-05-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-02", "name": "Белое натуральное дерево", "image": "/legacy/products/cl-02.jpg", "felt": "черный", "art": "01-07-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-03", "name": "Пихтовый", "image": "/legacy/products/cl-03.jpg", "felt": "черный", "art": "01-14-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-04", "name": "Терракот красный", "image": "/legacy/products/cl-04.jpg", "felt": "черный", "art": "01-17-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-05", "name": "Звездная ночь", "image": "/legacy/products/cl-05.jpg", "felt": "черный", "art": "01-19-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-06", "name": "Виола", "image": "/legacy/products/cl-06.jpg", "felt": "черный", "art": "01-18-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-07", "name": "Кофейный", "image": "/legacy/products/cl-07.jpg", "felt": "черный", "art": "01-16-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-08", "name": "Сумеречный голубой", "image": "/legacy/products/cl-08.jpg", "felt": "черный", "art": "01-15-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-09", "name": "Антрацит", "image": "/legacy/products/cl-09.jpg", "felt": "черный", "art": "01-13-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-10", "name": "Орех пекан", "image": "/legacy/products/cl-10.jpg", "felt": "черный", "art": "01-20-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
            {"id": "cl-11", "name": "Орех королевский темный", "image": "/legacy/products/cl-11.jpg", "felt": "черный", "art": "01-02-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-12", "name": "Дуб LOFT", "image": "/legacy/products/cl-12.jpg", "felt": "черный", "art": "01-24-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
            {"id": "cl-13", "name": "Орех шоколад", "image": "/legacy/products/cl-13.jpg", "felt": "черный", "art": "01-23-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
            {"id": "cl-14", "name": "Дуб янтарный", "image": "/legacy/products/cl-14.jpg", "felt": "черный", "art": "01-22-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
            {"id": "cl-15", "name": "Дуб шале натуральный", "image": "/legacy/products/cl-15.jpg", "felt": "черный", "art": "01-01-2780", "size": "2780×600×22", "price": 8900},
            {"id": "cl-16", "name": "Дуб Скандинавский", "image": "/legacy/products/cl-16.jpg", "felt": "черный", "art": "01-21-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
            {"id": "cl-g1", "name": "Дуб Сонома светлый", "image": "/legacy/products/cl-g1.jpg", "felt": "серый", "art": "01-05-2780-02", "size": "2780×600×22", "price": 8900},
            {"id": "cl-g2", "name": "Белое натуральное дерево", "image": "/legacy/products/cl-g2.jpg", "felt": "серый", "art": "01-07-2780-02", "size": "2780×600×22", "price": 8900},
            {"id": "cl-g3", "name": "Терракот красный", "image": "/legacy/products/cl-g3.jpg", "felt": "серый", "art": "01-17-2780-02", "size": "2780×600×22", "price": 8900},
            {"id": "cl-g4", "name": "Сумеречный голубой", "image": "/legacy/products/cl-g4.jpg", "felt": "серый", "art": "01-15-2780-02", "size": "2780×600×22", "price": 8900},
            {"id": "cl-g5", "name": "Дуб янтарный", "image": "/legacy/products/cl-g5.jpg", "felt": "серый", "art": "01-22-2780-02", "size": "2780×600×22", "price": 9100, "is_new": True},
        ],
    },
    {
        "id": "avangard",
        "name": "Avangard",
        "description": "Коллекция реечных панелей с выразительным профилем и акцентной геометрией.",
        "preview_image": "/legacy/home/avangard-home.png",
        "colors": [
            {"id": "av-01", "name": "Дуб LOFT", "image": "/legacy/products/av-01.png", "felt": "черный", "art": "02-24-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
            {"id": "av-02", "name": "Орех пекан", "image": "/legacy/products/av-02.png", "felt": "черный", "art": "02-20-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
            {"id": "av-03", "name": "Орех шоколад", "image": "/legacy/products/av-03.jpg", "felt": "черный", "art": "02-23-2780", "size": "2780×600×22", "price": 9100, "is_new": True},
        ],
    },
    {
        "id": "samples",
        "name": "Образцы",
        "description": "Набор образцов для подбора цвета и фактуры. Стоимость учитывается при заказе панелей.",
        "preview_image": "/legacy/home/samples-home.png",
        "colors": [
            {"id": "sm-01", "name": "Белое натуральное дерево", "image": "/legacy/products/sm-01.png", "felt": "черный", "art": "10-07-300", "size": "300×120×22", "price": 250},
            {"id": "sm-02", "name": "Дуб Сонома светлый", "image": "/legacy/products/sm-02.png", "felt": "черный", "art": "10-05-300", "size": "300×120×22", "price": 250},
            {"id": "sm-03", "name": "Дуб шале натуральный", "image": "/legacy/products/sm-03.png", "felt": "черный", "art": "10-01-300", "size": "300×120×22", "price": 250},
            {"id": "sm-04", "name": "Орех королевский темный", "image": "/legacy/products/sm-04.png", "felt": "черный", "art": "10-02-300", "size": "300×120×22", "price": 250},
            {"id": "sm-05", "name": "Антрацит", "image": "/legacy/products/sm-05.png", "felt": "черный", "art": "10-13-300", "size": "300×120×22", "price": 250},
            {"id": "sm-06", "name": "Сумеречный голубой", "image": "/legacy/products/sm-06.png", "felt": "черный", "art": "10-15-300", "size": "300×120×22", "price": 250},
            {"id": "sm-07", "name": "Пихтовый", "image": "/legacy/products/sm-07.png", "felt": "черный", "art": "10-14-300", "size": "300×120×22", "price": 250},
            {"id": "sm-08", "name": "Кофейный", "image": "/legacy/products/sm-08.png", "felt": "черный", "art": "10-16-300", "size": "300×120×22", "price": 250},
            {"id": "sm-09", "name": "Терракот красный", "image": "/legacy/products/sm-09.png", "felt": "черный", "art": "10-17-300", "size": "300×120×22", "price": 250},
            {"id": "sm-10", "name": "Виола", "image": "/legacy/products/sm-10.png", "felt": "черный", "art": "10-18-300", "size": "300×120×22", "price": 250},
            {"id": "sm-11", "name": "Звездная ночь", "image": "/legacy/products/sm-11.png", "felt": "черный", "art": "10-19-300", "size": "300×120×22", "price": 250},
            {"id": "sm-12", "name": "Орех пекан", "image": "/legacy/products/sm-12.png", "felt": "черный", "art": "10-20-300", "size": "300×120×22", "price": 250, "is_new": True},
            {"id": "sm-13", "name": "Дуб Скандинавский", "image": "/legacy/products/sm-13.png", "felt": "черный", "art": "10-21-300", "size": "300×120×22", "price": 250, "is_new": True},
            {"id": "sm-14", "name": "Дуб янтарный", "image": "/legacy/products/sm-14.png", "felt": "черный", "art": "10-22-300", "size": "300×120×22", "price": 250, "is_new": True},
            {"id": "sm-15", "name": "Орех шоколад", "image": "/legacy/products/sm-15.png", "felt": "черный", "art": "10-23-300", "size": "300×120×22", "price": 250, "is_new": True},
            {"id": "sm-16", "name": "Дуб LOFT", "image": "/legacy/products/sm-16.png", "felt": "черный", "art": "10-24-300", "size": "300×120×22", "price": 250, "is_new": True},
            {"id": "sm-g1", "name": "Белое натуральное дерево", "image": "/legacy/products/sm-g1.png", "felt": "серый", "art": "10-07-300-02", "size": "300×120×22", "price": 250},
            {"id": "sm-g2", "name": "Дуб шале натуральный", "image": "/legacy/products/sm-g2.png", "felt": "серый", "art": "10-01-300-02", "size": "300×120×22", "price": 250},
            {"id": "sm-g3", "name": "Дуб Сонома светлый", "image": "/legacy/products/sm-g3.png", "felt": "серый", "art": "10-05-300-02", "size": "300×120×22", "price": 250},
            {"id": "sm-g4", "name": "Терракот красный", "image": "/legacy/products/sm-g4.png", "felt": "серый", "art": "10-17-300-02", "size": "300×120×22", "price": 250},
            {"id": "sm-g5", "name": "Сумеречный голубой", "image": "/legacy/products/sm-g5.png", "felt": "серый", "art": "10-15-300-02", "size": "300×120×22", "price": 250},
            {"id": "sm-g6", "name": "Дуб янтарный", "image": "/legacy/products/sm-g6.png", "felt": "серый", "art": "10-22-300-02", "size": "300×120×22", "price": 250, "is_new": True},
        ],
    },
    {
        "id": "components",
        "name": "Комплектующие",
        "description": "Торцевые планки и расходники для монтажа акустических панелей.",
        "preview_image": "/legacy/products/components-preview.jpg",
        "colors": [
            {"id": "ac-01", "name": "Торцевая планка Дуб шале натуральный", "image": "/legacy/products/ac-01.png", "art": "04-01-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-02", "name": "Торцевая планка Виола", "image": "/legacy/products/ac-02.png", "art": "04-18-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-03", "name": "Торцевая планка Звездная ночь", "image": "/legacy/products/ac-03.png", "art": "04-19-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-04", "name": "Торцевая планка Пихтовый", "image": "/legacy/products/ac-04.png", "art": "04-14-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-05", "name": "Торцевая планка Сумеречный голубой", "image": "/legacy/products/ac-05.png", "art": "04-15-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-06", "name": "Торцевая планка Терракот красный", "image": "/legacy/products/ac-06.png", "art": "04-17-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-07", "name": "Торцевая планка Кофейный", "image": "/legacy/products/ac-07.png", "art": "04-16-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-08", "name": "Торцевая планка Дуб LOFT", "image": "/legacy/products/ac-08.png", "art": "04-24-2780", "size": "2780×27×22", "price": 1500, "is_new": True},
            {"id": "ac-09", "name": "Торцевая планка Орех шоколад", "image": "/legacy/products/ac-09.png", "art": "04-23-2780", "size": "2780×27×22", "price": 1500, "is_new": True},
            {"id": "ac-10", "name": "Торцевая планка Дуб янтарный", "image": "/legacy/products/ac-10.png", "art": "04-22-2780", "size": "2780×27×22", "price": 1500, "is_new": True},
            {"id": "ac-11", "name": "Торцевая планка Дуб Скандинавский", "image": "/legacy/products/ac-11.png", "art": "04-21-2780", "size": "2780×27×22", "price": 1500, "is_new": True},
            {"id": "ac-12", "name": "Торцевая планка Орех пекан", "image": "/legacy/products/ac-12.png", "art": "04-20-2780", "size": "2780×27×22", "price": 1500, "is_new": True},
            {"id": "ac-13", "name": "Торцевая планка Антрацит", "image": "/legacy/products/ac-13.png", "art": "04-13-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-14", "name": "Торцевая планка Орех королевский темный", "image": "/legacy/products/ac-14.png", "art": "04-02-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-15", "name": "Торцевая планка Дуб Сонома светлый", "image": "/legacy/products/ac-15.png", "art": "04-05-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-16", "name": "Торцевая планка Белое натуральное дерево", "image": "/legacy/products/ac-16.png", "art": "04-07-2780", "size": "2780×27×22", "price": 1500},
            {"id": "ac-mat", "name": "Акустический мат", "image": "/legacy/products/ac-mat.jpg", "art": "06-01-2780", "size": "2800×600×9", "price": 4850},
            {"id": "ac-ring", "name": "Компенсационное кольцо d60", "image": "/legacy/products/ac-ring.jpg", "art": "07-01-68", "size": "68 мм", "price": 400},
            {"id": "ac-screw", "name": "Саморезы 4,2×32 мм", "image": "/legacy/products/ac-screw.jpg", "art": "09-01-32", "size": "4,2×32", "price": 315},
            {"id": "ac-glue", "name": "Клей монтажный 280 мл", "image": "/legacy/products/ac-glue.webp", "art": "08-01-300", "size": "280 мл", "price": 510},
        ],
    },
    {
        "id": "accessories",
        "name": "Аксессуары",
        "description": "Полки, вешалки и комплекты подсветки ARTDECO для интерьера и прихожей.",
        "preview_image": "/legacy/products/accessories-preview.jpg",
        "colors": [
            {"id": "ad-h80-nat", "name": "ARTDECO Вешалка Дуб натуральный", "image": "/legacy/products/ad-h80-nat.jpg", "art": "13-02-80", "size": "80 мм", "price": 1600},
            {"id": "ad-h80-wal", "name": "ARTDECO Вешалка Темный орех", "image": "/legacy/products/ad-h80-wal.jpg", "art": "13-03-80", "size": "80 мм", "price": 1600},
            {"id": "ad-h80-blk", "name": "ARTDECO Вешалка Черный дуб", "image": "/legacy/products/ad-h80-blk.jpg", "art": "13-01-80", "size": "80 мм", "price": 1600},
            {"id": "ad-h190-nat", "name": "ARTDECO Вешалка с крючком 190 Натуральный дуб", "image": "/legacy/products/ad-h190-nat.jpg", "art": "14-02-190", "size": "190 мм", "price": 2450},
            {"id": "ad-h190-wal", "name": "ARTDECO Вешалка с крючком 190 Темный орех", "image": "/legacy/products/ad-h190-wal.jpg", "art": "14-03-190", "size": "190 мм", "price": 2450},
            {"id": "ad-h190-blk", "name": "ARTDECO Вешалка с крючком 190 Черный дуб", "image": "/legacy/products/ad-h190-blk.jpg", "art": "14-01-190", "size": "190 мм", "price": 2450},
            {"id": "ad-h270-nat", "name": "ARTDECO Вешалка с крючком 270 Натуральный дуб", "image": "/legacy/products/ad-h270-nat.jpg", "art": "15-02-270", "size": "270 мм", "price": 2950},
            {"id": "ad-h270-wal", "name": "ARTDECO Вешалка с крючком 270 Темный орех", "image": "/legacy/products/ad-h270-wal.jpg", "art": "15-01-270", "size": "270 мм", "price": 2950},
            {"id": "ad-h270-blk", "name": "ARTDECO Вешалка с крючком 270 Черный дуб", "image": "/legacy/products/ad-h270-blk.jpg", "art": "15-01-270b", "size": "270 мм", "price": 2950},
            {"id": "ad-sh359", "name": "ARTDECO Полка узкая 359", "image": "/legacy/products/ad-sh359.jpg", "art": "12-75-359", "size": "359 мм", "price": 3350},
            {"id": "ad-sh519", "name": "ARTDECO Полка узкая 519", "image": "/legacy/products/ad-sh519.jpg", "art": "12-75-519", "size": "519 мм", "price": 4690},
            {"id": "ad-sh759", "name": "ARTDECO Полка узкая 759", "image": "/legacy/products/ad-sh759.jpg", "art": "12-75-759", "size": "759 мм", "price": 5390},
            {"id": "ad-sh1159", "name": "ARTDECO Полка узкая 1159", "image": "/legacy/products/ad-sh1159.jpg", "art": "12-75-1159", "size": "1159 мм", "price": 5750},
            {"id": "ad-sw359", "name": "ARTDECO Полка широкая 359", "image": "/legacy/products/ad-sw359.jpg", "art": "12-140-359", "size": "359 мм", "price": 3690},
            {"id": "ad-sw519", "name": "ARTDECO Полка широкая 519", "image": "/legacy/products/ad-sw519.jpg", "art": "112-140-519", "size": "519 мм", "price": 5100},
            {"id": "ad-sw759", "name": "ARTDECO Полка широкая 759", "image": "/legacy/products/ad-sw759.jpg", "art": "12-140-759", "size": "759 мм", "price": 5670},
            {"id": "ad-l1b", "name": "Комплект подсветки черный", "image": "/legacy/products/ad-l1b.jpg", "art": "1-05-02-2780", "size": "2780×12×12", "price": 4490},
            {"id": "ad-l2b", "name": "Комплект подсветки x2 черный", "image": "/legacy/products/ad-l2b.jpg", "art": "2-05-02-2780", "size": "2780×12×12", "price": 8100},
            {"id": "ad-l1s", "name": "Комплект подсветки серебро", "image": "/legacy/products/ad-l1s.jpg", "art": "1-05-01-2780", "size": "2780×12×12", "price": 4490},
            {"id": "ad-l2s", "name": "Комплект подсветки x2 серебро", "image": "/legacy/products/ad-l2s.jpg", "art": "2-05-01-2780", "size": "2780×12×12", "price": 8100},
        ],
    },
]


def get_collection_cards() -> list[CollectionCard]:
    return [
        CollectionCard(
            id=item["id"],
            name=item["name"],
            description=item["description"],
            preview_image=item["preview_image"],
            colors=[ProductColor(**color) for color in item["colors"]],
        )
        for item in CATALOG_DATA
    ]


def get_product_detail(product_id: str) -> ProductDetail | None:
    for item in CATALOG_DATA:
        if item["id"] == product_id:
            return ProductDetail(
                id=item["id"],
                name=item["name"],
                description=item["description"],
                preview_image=item["preview_image"],
                colors=[ProductColor(**color) for color in item["colors"]],
            )
    return None
