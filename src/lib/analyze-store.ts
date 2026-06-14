export type AnalyzeStatus = "queued" | "running" | "completed" | "failed";

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

const globalForAnalyze = globalThis as unknown as {
  analyzeJobs?: Map<string, AnalyzeJob>;
};

export const analyzeJobs =
  globalForAnalyze.analyzeJobs ?? new Map<string, AnalyzeJob>();

if (!globalForAnalyze.analyzeJobs) {
  globalForAnalyze.analyzeJobs = analyzeJobs;
}

export function createAnalyzeJob(url: string) {
  const id = crypto.randomUUID();

  const job: AnalyzeJob = {
    id,
    url,
    status: "queued",
    progress: 0,
    createdAt: Date.now(),
    logs: ["> Analiz kuyruğa alındı..."],
  };

  analyzeJobs.set(id, job);

  return job;
}

export function getAnalyzeJob(id: string) {
  const job = analyzeJobs.get(id);

  if (!job) {
    return null;
  }

  return updateJobProgress(job);
}

function updateJobProgress(job: AnalyzeJob) {
  const elapsed = Date.now() - job.createdAt;
  const progress = Math.min(100, Math.floor(elapsed / 120));

  job.progress = progress;

  if (progress < 10) {
    job.status = "queued";
  } else if (progress < 100) {
    job.status = "running";
  } else {
    job.status = "completed";
  }

  job.logs = createLogs(job.url, progress);

  if (job.status === "completed" && !job.report) {
    job.report = createMockReport(job.id, job.url);
  }

  analyzeJobs.set(job.id, job);

  return job;
}

function createLogs(url: string, progress: number) {
  const logs = [
    "> Aether Core v4.2 başlatılıyor...",
    `> Hedef belirlendi: ${url}`,
  ];

  if (progress >= 15) {
    logs.push("> SSL sertifika zinciri analiz ediliyor... [OK]");
  }

  if (progress >= 30) {
    logs.push("> DOM yapısı analiz ediliyor... [204 düğüm haritalandı]");
  }

  if (progress >= 45) {
    logs.push("> Core Web Vitals verileri hazırlanıyor...");
  }

  if (progress >= 60) {
    logs.push("> Erişilebilirlik parametreleri değerlendiriliyor...");
  }

  if (progress >= 78) {
    logs.push("> Derin AI sezgiselleri hesaplanıyor...");
  }

  if (progress >= 100) {
    logs.push("> Analiz tamamlandı. Rapor oluşturuldu.");
  }

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