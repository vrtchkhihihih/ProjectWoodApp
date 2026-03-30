export const CMS_STORAGE_KEY = "wa_cms_homepage";

export type HomepageCmsContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroButtonLabel: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutTextPrimary: string;
  aboutTextSecondary: string;
  aboutQuote: string;
};

export const defaultHomepageCmsContent: HomepageCmsContent = {
  heroEyebrow: "Wood App - акустика и дизайн",
  heroTitle: "Акустические панели",
  heroButtonLabel: "Смотреть каталог",
  aboutEyebrow: "About Us",
  aboutTitle: "Привет! Мы рады приветствовать вас.",
  aboutTextPrimary: "Мы создаем акустические панели для пространств, где важны не только форма и свет, но и звук.",
  aboutTextSecondary:
    "Наши решения объединяют технологию и дизайн, чтобы интерьер работал на ощущение спокойствия, глубины и комфорта.",
  aboutQuote:
    "Мы работаем с теми, кто понимает: правильно созданное пространство - это не только красота. Тишина тоже роскошь.",
};

export function mergeHomepageCmsContent(
  value: Partial<HomepageCmsContent> | null | undefined,
): HomepageCmsContent {
  return {
    ...defaultHomepageCmsContent,
    ...(value ?? {}),
  };
}
