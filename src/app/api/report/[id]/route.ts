import { getAnalyzeJob } from "@/lib/analyze-store";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const job = getAnalyzeJob(id);

  if (!job) {
    return Response.json(
      {
        message: "Rapor bulunamadı.",
      },
      {
        status: 404,
      }
    );
  }

  if (job.status !== "completed" || !job.report) {
    return Response.json(
      {
        message: "Rapor henüz hazır değil.",
        status: job.status,
        progress: job.progress,
      },
      {
        status: 409,
      }
    );
  }

  return Response.json(job.report);
}