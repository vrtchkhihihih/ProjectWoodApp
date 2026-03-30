"use client";

import { useEffect, useMemo, useState } from "react";

import { resolveProductImage } from "@/lib/productImages";

type Props = {
  image?: string | null;
  productId?: string | null;
  collectionId?: string | null;
  alt: string;
  className?: string;
};

export function ProductThumb({ image, productId, collectionId, alt, className }: Props) {
  const primarySrc = useMemo(
    () =>
      resolveProductImage({
        image,
        productId,
        collectionId,
      }),
    [collectionId, image, productId],
  );

  const fallbackSrc = useMemo(
    () =>
      resolveProductImage({
        collectionId,
      }),
    [collectionId],
  );

  const [currentSrc, setCurrentSrc] = useState(primarySrc);

  useEffect(() => {
    setCurrentSrc(primarySrc);
  }, [primarySrc]);

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
