import { OrderTrackingPage } from "@/components/shared/Shop/OrderTrackingPage";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function TrackPage({ params }: PageProps) {
  const { token } = await params;
  return <OrderTrackingPage token={token} />;
}
