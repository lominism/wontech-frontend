import { Suspense } from "react";
import { ShopPaymentPage } from "@/components/shared/Shop/ShopPaymentPage";

type PageProps = {
  params: Promise<{ clinicId: string; productId: string }>;
};

export default async function ShopPaymentRoute({ params }: PageProps) {
  const { clinicId, productId } = await params;
  return (
    <Suspense>
      <ShopPaymentPage clinicId={clinicId} productId={productId} />
    </Suspense>
  );
}
