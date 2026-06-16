import { ClinicDetail } from "@/components/shared/ClinicTable/Detail/ClinicDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClinicDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ClinicDetail clinicId={id} />;
}
