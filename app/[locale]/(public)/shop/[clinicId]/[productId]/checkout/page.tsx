import { Suspense } from "react";
import { ShopCheckoutPage } from "@/components/shared/Shop/ShopCheckoutPage";

type PageProps = {
  params: Promise<{ clinicId: string; productId: string }>;
};

export default async function ShopCheckoutRoute({ params }: PageProps) {
  const { clinicId, productId } = await params;
  return (
    <Suspense>
      <ShopCheckoutPage clinicId={clinicId} productId={productId} />
    </Suspense>
  );
}
