import {
  createAnalyzeJob,
  listAnalyzeJobs,
  type AnalyzeJob,
} from "@/lib/analyze-store";

export async function GET() {
  const jobs: AnalyzeJob[] = await listAnalyzeJobs();

  return Response.json({
    items: jobs.map((job) => ({
      id: job.id,
      url: job.url,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      overallScore: job.report?.overallScore ?? null,
      scores: job.report?.scores ?? null,
      isFallback: job.report ? isFallbackReport(job.report.findings) : false,
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

function isFallbackReport(
  findings: {
    title: string;
    desc: string;
  }[]
) {
  return findings.some((item) => {
    const title = item.title.toLowerCase();
    const desc = item.desc.toLowerCase();

    return (
      title.includes("fallback") ||
      title.includes("pagespeed kotası") ||
      desc.includes("fallback") ||
      desc.includes("quota exceeded")
    );
  });
}