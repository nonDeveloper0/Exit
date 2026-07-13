import { INTERROGATION_QUIZZES, QR_CODES, SUSPECTS } from "@/lib/data";
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

  const quiz = INTERROGATION_QUIZZES[id] ?? null;
  const suspect = quiz ? SUSPECTS.find((s) => s.id === quiz.suspectId) ?? null : null;

  return (
    <QrPageClient
      qrId={qr.id}
      location={qr.location}
      quiz={quiz}
      suspectName={suspect?.name ?? null}
    />
  );
}
