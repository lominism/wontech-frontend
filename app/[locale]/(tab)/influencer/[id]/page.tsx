import { InfluencerDetail } from "@/components/shared/InfluencerTable/Detail/InfluencerDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InfluencerDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <InfluencerDetail influencerId={id} />;
}
