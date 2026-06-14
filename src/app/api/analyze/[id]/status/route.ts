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
        message: "Analiz bulunamadı.",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json({
    jobId: job.id,
    url: job.url,
    status: job.status,
    progress: job.progress,
    logs: job.logs,
    reportId: job.status === "completed" ? job.id : null,
  });
}