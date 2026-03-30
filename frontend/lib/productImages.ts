import { assetUrl } from "@/lib/assets";
import { getProductImageOverride } from "@/lib/productImageOverrides";

const COLLECTION_IMAGE_FALLBACKS: Record<string, string> = {
  classic: "/legacy/home/catalog-classic-card.png",
  avangard: "/legacy/home/catalog-avangard-card.png",
  samples: "/legacy/home/catalog-samples-card.png",
  components: "/legacy/products/components-preview.jpg",
  accessories: "/legacy/products/accessories-preview.jpg",
};

const DEFAULT_IMAGE_FALLBACK = "/legacy/home/catalog-classic-card.png";

export function getCollectionImageFallback(collectionId?: string | null) {
  if (!collectionId) {
    return DEFAULT_IMAGE_FALLBACK;
  }

  return COLLECTION_IMAGE_FALLBACKS[collectionId] ?? DEFAULT_IMAGE_FALLBACK;
}

export function resolveProductImage(params: {
  image?: string | null;
  productId?: string | null;
  collectionId?: string | null;
}) {
  const fallbackImage = getCollectionImageFallback(params.collectionId);
  const sourceImage = (params.image ?? "").trim() || fallbackImage;
  const normalizedImage = params.productId
    ? getProductImageOverride(params.productId, sourceImage)
    : sourceImage;

  return assetUrl(normalizedImage);
}
