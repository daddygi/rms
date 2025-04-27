// src/app/dashboard/reports/[id]/page.tsx
import { db } from "@/db";
import { incidentReports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientWrapper from "./ClientWrapper";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const [report] = await db
    .select()
    .from(incidentReports)
    .where(eq(incidentReports.id, params.id));

  if (!report) return notFound();

  return <ClientWrapper report={report} />;
}
