import Link from "next/link";

import { CollectionDetailClient } from "@/components/CollectionDetailClient";
import { getCollection } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string }>;
};

export default async function CollectionDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { color } = await searchParams;
  const collection = await getCollection(id);

  return (
    <main className="container page-space">
      <Link href="/#catalog" className="back-link">
        ← Назад к каталогу
      </Link>
      <CollectionDetailClient collection={collection} initialColorId={color} />
    </main>
  );
}
