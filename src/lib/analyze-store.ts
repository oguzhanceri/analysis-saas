import { prisma } from "@/lib/prisma";

export type AnalyzeStatus = "queued" | "running" | "completed" | "failed";

type AnalyzeJobRecord = {
  id: string;
  url: string;
  status: string;
  progress: number;
  logsJson: string;
  reportJson: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AnalyzeJob = {
  id: string;
  url: string;
  status: AnalyzeStatus;
  progress: number;
  createdAt: number;
  logs: string[];
  report?: AnalyzeReport;
};

export type AnalyzeReport = {
  id: string;
  url: string;
  overallScore: number;
  scores: {
    performance: number;
    ux: number;
    security: number;
    seo: number;
    accessibility: number;
  };
  findings: {
    title: string;
    desc: string;
    tag: "Kritik" | "Uyarı" | "Bilgi";
  }[];
  vitals: {
    metric: string;
    ours: string;
    average: string;
    leader: string;
    status: "success" | "warning";
  }[];
};

export async function createAnalyzeJob(url: string) {
  const id = crypto.randomUUID();

  const job = await prisma.analyzeJob.create({
    data: {
      id,
      url,
      status: "queued",
      progress: 0,
      logsJson: JSON.stringify(["> Analiz kuyruğa alındı..."]),
      reportJson: null,
    },
  });

  return toAnalyzeJob(job);
}

export async function getAnalyzeJob(id: string) {
  const job = await prisma.analyzeJob.findUnique({
    where: {
      id,
    },
  });

  if (!job) {
    return null;
  }

  return updateJobProgress(toAnalyzeJob(job));
}

export async function listAnalyzeJobs() {
  const jobs = await prisma.analyzeJob.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const updatedJobs = await Promise.all(
    jobs.map((job: AnalyzeJobRecord) => updateJobProgress(toAnalyzeJob(job)))
  );

  return updatedJobs.sort(
    (a: AnalyzeJob, b: AnalyzeJob) => b.createdAt - a.createdAt
  );
}

async function updateJobProgress(job: AnalyzeJob) {
  const elapsed = Date.now() - job.createdAt;
  const progress = Math.min(100, Math.floor(elapsed / 120));

  let status: AnalyzeStatus = "queued";

  if (progress < 10) {
    status = "queued";
  } else if (progress < 100) {
    status = "running";
  } else {
    status = "completed";
  }

  const logs = createLogs(job.url, progress);

  const report =
    status === "completed"
      ? job.report ?? createMockReport(job.id, job.url)
      : job.report;

  const updatedJob = await prisma.analyzeJob.update({
    where: {
      id: job.id,
    },
    data: {
      status,
      progress,
      logsJson: JSON.stringify(logs),
      reportJson: report ? JSON.stringify(report) : null,
    },
  });

  return toAnalyzeJob(updatedJob);
}

function toAnalyzeJob(job: AnalyzeJobRecord): AnalyzeJob {
  const logs = parseJson<string[]>(job.logsJson, []);
  const report = parseJson<AnalyzeReport | undefined>(
    job.reportJson,
    undefined
  );

  return {
    id: job.id,
    url: job.url,
    status: job.status as AnalyzeStatus,
    progress: job.progress,
    createdAt: job.createdAt.getTime(),
    logs,
    report,
  };
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function createLogs(url: string, progress: number) {
  const logs = [
    "> Aether Core v4.2 başlatılıyor...",
    `> Hedef belirlendi: ${url}`,
  ];

  if (progress >= 15) logs.push("> SSL sertifika zinciri analiz ediliyor... [OK]");
  if (progress >= 30) logs.push("> DOM yapısı analiz ediliyor... [204 düğüm haritalandı]");
  if (progress >= 45) logs.push("> Core Web Vitals verileri hazırlanıyor...");
  if (progress >= 60) logs.push("> Erişilebilirlik parametreleri değerlendiriliyor...");
  if (progress >= 78) logs.push("> Derin AI sezgiselleri hesaplanıyor...");
  if (progress >= 100) logs.push("> Analiz tamamlandı. Rapor oluşturuldu.");

  return logs;
}

function createMockReport(id: string, url: string): AnalyzeReport {
  return {
    id,
    url,
    overallScore: 58,
    scores: {
      performance: 42,
      ux: 76,
      security: 94,
      seo: 81,
      accessibility: 88,
    },
    findings: [
      {
        title: "Ana İplik (Main Thread) Bloklanması",
        desc: "Ağır JavaScript yürütümü nedeniyle kaydırma sırasında TBT değeri yükseldi.",
        tag: "Kritik",
      },
      {
        title: "Mobil Dokunmatik Hedefleri Çok Küçük",
        desc: "Navigasyon menüsündeki linkler erişilebilirlik standartlarını tam karşılamıyor.",
        tag: "Uyarı",
      },
      {
        title: "Görsel Optimizasyon Eksikliği",
        desc: "Hero görseli yeni nesil formatlarda sunulmuyor.",
        tag: "Bilgi",
      },
    ],
    vitals: [
      {
        metric: "LCP (Largest Contentful Paint)",
        ours: "3.2s",
        average: "2.5s",
        leader: "1.8s",
        status: "warning",
      },
      {
        metric: "FID (First Input Delay)",
        ours: "85ms",
        average: "100ms",
        leader: "70ms",
        status: "success",
      },
      {
        metric: "CLS (Cumulative Layout Shift)",
        ours: "0.04",
        average: "0.15",
        leader: "0.02",
        status: "success",
      },
    ],
  };
}