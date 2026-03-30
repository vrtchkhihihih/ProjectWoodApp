import Link from "next/link";

import { assetUrl } from "@/lib/assets";
import { getColorSwatch } from "@/lib/colorSwatches";
import type { CollectionCard as CollectionCardType } from "@/lib/api";

type Props = {
  item: CollectionCardType;
};

export function CollectionCard({ item }: Props) {
  const previewColors = item.colors.slice(0, 5);
  const extraCount = Math.max(0, item.colors.length - previewColors.length);

  return (
    <article className="collection-card">
      <img className="collection-image" src={assetUrl(item.preview_image)} alt={item.name} />
      <div className="collection-body">
        <h2 className="collection-name">{item.name}</h2>
        <p className="collection-description">{item.description}</p>

        <div className="swatch-row">
          {previewColors.map((color) => (
            <span key={color.id} className="swatch-pill">
              <span className="swatch-dot" style={{ backgroundColor: getColorSwatch(color.name) }} />
              <span>{color.name}</span>
            </span>
          ))}
          {extraCount > 0 ? <span className="chip">+{extraCount} цветов</span> : null}
        </div>

        <div className="actions">
          <Link href={`/catalog/${item.id}`} className="btn btn-primary">
            Открыть коллекцию
          </Link>
        </div>
      </div>
    </article>
  );
}
