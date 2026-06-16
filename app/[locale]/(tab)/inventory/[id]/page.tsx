import { ProductDetail } from "@/components/shared/Inventory/Detail/ProductDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}
