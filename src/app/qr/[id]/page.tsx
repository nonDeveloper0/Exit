import { EVIDENCE, QR_LOCATIONS } from "@/lib/data";
import QrPageClient from "./QrPageClient";
import { notFound } from "next/navigation";

export default async function QrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = QR_LOCATIONS.find((l) => l.id === id);

  if (!location) {
    notFound();
  }

  const evidence = EVIDENCE.filter((e) => e.qrId === location.id);

  return <QrPageClient location={location} evidence={evidence} />;
}
