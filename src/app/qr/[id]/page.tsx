import { EVIDENCE, QR_CODES } from "@/lib/data";
import QrPageClient from "./QrPageClient";
import { notFound } from "next/navigation";

export default async function QrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const qr = QR_CODES.find((q) => q.id === id);

  if (!qr) {
    notFound();
  }

  const evidence = EVIDENCE.filter((e) => qr.evidenceIds.includes(e.id));

  return <QrPageClient qrId={qr.id} location={qr.location} evidence={evidence} />;
}
