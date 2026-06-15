import { createAnalyzeJob, listAnalyzeJobs } from "@/lib/analyze-store";

export async function GET() {
  const jobs = await listAnalyzeJobs();

  return Response.json({
    items: jobs.map((job) => ({
      id: job.id,
      url: job.url,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      overallScore: job.report?.overallScore ?? null,
      scores: job.report?.scores ?? null,
    })),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const rawUrl = body?.url;

  if (!rawUrl || typeof rawUrl !== "string") {
    return Response.json(
      {
        message: "URL zorunludur.",
      },
      {
        status: 400,
      }
    );
  }

  let normalizedUrl: string;

  try {
    const url = new URL(rawUrl);
    normalizedUrl = url.href;
  } catch {
    return Response.json(
      {
        message: "Geçerli bir URL giriniz.",
      },
      {
        status: 400,
      }
    );
  }

  const job = await createAnalyzeJob(normalizedUrl);

  return Response.json(
    {
      jobId: job.id,
      url: job.url,
      status: job.status,
      progress: job.progress,
    },
    {
      status: 201,
    }
  );
}