import type { AnalyzeReport } from "@/lib/analyze-store";

type PageSpeedCategory = {
  score?: number | null;
};

type PageSpeedAudit = {
  id?: string;
  title?: string;
  description?: string;
  score?: number | null;
  displayValue?: string;
};

type PageSpeedResponse = {
  error?: {
    message?: string;
  };
  lighthouseResult?: {
    categories?: {
      performance?: PageSpeedCategory;
      accessibility?: PageSpeedCategory;
      "best-practices"?: PageSpeedCategory;
      seo?: PageSpeedCategory;
    };
    audits?: Record<string, PageSpeedAudit>;
  };
};

export async function createPageSpeedReport(
  id: string,
  url: string
): Promise<AnalyzeReport> {
  const params = new URLSearchParams({
    url,
    strategy: "mobile",
    locale: "tr",
  });

  params.append("category", "performance");
  params.append("category", "accessibility");
  params.append("category", "best-practices");
  params.append("category", "seo");

  if (process.env.PAGESPEED_API_KEY) {
    params.set("key", process.env.PAGESPEED_API_KEY);
  }

  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  const data = (await response.json()) as PageSpeedResponse;

  if (!response.ok || data.error) {
    throw new Error(
      data.error?.message || "PageSpeed Insights isteği başarısız oldu."
    );
  }

  const categories = data.lighthouseResult?.categories;
  const audits = data.lighthouseResult?.audits || {};

  if (!categories) {
    throw new Error("PageSpeed Insights kategori verisi dönmedi.");
  }

  const performance = toPercent(categories.performance?.score);
  const accessibility = toPercent(categories.accessibility?.score);
  const seo = toPercent(categories.seo?.score);
  const security = toPercent(categories["best-practices"]?.score);
  const ux = Math.round((performance + accessibility) / 2);

  const overallScore = Math.round(
    (performance + accessibility + seo + security + ux) / 5
  );

  return {
    id,
    url,
    overallScore,
    scores: {
      performance,
      ux,
      security,
      seo,
      accessibility,
    },
    findings: createFindings(audits),
    vitals: createVitals(audits),
  };
}

function toPercent(score: number | null | undefined) {
  if (typeof score !== "number") {
    return 0;
  }

  return Math.round(score * 100);
}

function createFindings(audits: Record<string, PageSpeedAudit>) {
 const importantAuditIds = [
  "render-blocking-resources",
  "unused-javascript",
  "unused-css-rules",
  "total-byte-weight",

  "third-party-summary",
  "third-party-facades",
  "bootup-time",
  "mainthread-work-breakdown",

  "uses-text-compression",
  "unminified-css",
  "unminified-javascript",
  "duplicated-javascript",
  "legacy-javascript",

  "uses-rel-preconnect",
  "font-display",
  "redirects",

  "modern-image-formats",
  "uses-optimized-images",
  "uses-responsive-images",
  "offscreen-images",
  "efficiently-encode-images",

  "largest-contentful-paint",
  "cumulative-layout-shift",
  "total-blocking-time",

  "color-contrast",
  "image-alt",
  "button-name",
  "link-name",
  "tap-targets",

  "meta-description",
  "document-title",
  "uses-https",
];

  const findings = importantAuditIds
    .map((auditId) => ({
      auditId,
      audit: audits[auditId],
    }))
    .filter(
      (item): item is { auditId: string; audit: PageSpeedAudit } =>
        Boolean(item.audit)
    )
    .filter(({ audit }) => {
      if (typeof audit.score !== "number") return false;

      return audit.score < 0.9;
    })
    .slice(0, 6)
    .map(({ auditId, audit }) => ({
      auditId,
      title: audit.title || "İyileştirme önerisi",
      desc: cleanDescription(
        audit.description || "Bu alanda iyileştirme yapılabilir."
      ),
      tag: getFindingTag(audit.score),
    }));

  if (findings.length > 0) {
    return findings;
  }

  return [
    {
      auditId: "no-critical-issues",
      title: "Kritik sorun bulunmadı",
      desc: "PageSpeed Insights analizine göre temel metriklerde ciddi bir problem tespit edilmedi.",
      tag: "Bilgi" as const,
    },
  ];
}

function createVitals(audits: Record<string, PageSpeedAudit>) {
  const lcp = audits["largest-contentful-paint"];
  const tbt = audits["total-blocking-time"];
  const cls = audits["cumulative-layout-shift"];

  return [
    {
      metric: "LCP (Largest Contentful Paint)",
      ours: getAuditValue(lcp, "-"),
      average: "≤ 2.5s",
      leader: "≤ 1.8s",
      status: getVitalStatus(lcp),
    },
    {
      metric: "TBT (Total Blocking Time)",
      ours: getAuditValue(tbt, "-"),
      average: "≤ 200ms",
      leader: "≤ 100ms",
      status: getVitalStatus(tbt),
    },
    {
      metric: "CLS (Cumulative Layout Shift)",
      ours: getAuditValue(cls, "-"),
      average: "≤ 0.10",
      leader: "≤ 0.05",
      status: getVitalStatus(cls),
    },
  ];
}

function getAuditValue(audit: PageSpeedAudit | undefined, fallback: string) {
  return audit?.displayValue || fallback;
}

function getVitalStatus(audit: PageSpeedAudit | undefined) {
  if (typeof audit?.score === "number" && audit.score >= 0.9) {
    return "success" as const;
  }

  return "warning" as const;
}

function getFindingTag(score: number | null | undefined) {
  if (typeof score !== "number") {
    return "Bilgi" as const;
  }

  if (score < 0.5) {
    return "Kritik" as const;
  }

  if (score < 0.9) {
    return "Uyarı" as const;
  }

  return "Bilgi" as const;
}

function cleanDescription(description: string) {
  return description
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}