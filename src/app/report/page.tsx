"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getReportRecommendations,
  type ReportRecommendation,
} from "@/lib/report-recommendations";

const topNav = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Scanner", href: "/scanner" },
  { title: "Live Feed", href: "/loading" },
  { title: "Models", href: "/report" },
];

const sidebarItems = [
  { title: "Command Center", href: "/dashboard", icon: <GridIcon /> },
  { title: "Traffic Flow", href: "/loading", icon: <FlowIcon /> },
  { title: "Optimization", href: "/report", icon: <SpeedIcon />, active: true },
  { title: "URL Scanner", href: "/scanner", icon: <SearchIcon /> },
  { title: "History Logs", href: "/history", icon: <LogsIcon /> },
];

type FindingTag = "Kritik" | "Uyarı" | "Bilgi";

type ReportFinding = {
  auditId?: string;
  title: string;
  desc: string;
  tag: FindingTag;
};

type ReportVital = {
  metric: string;
  ours: string;
  average: string;
  leader: string;
  status: "success" | "warning";
};

type ReportData = {
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
  findings: ReportFinding[];
  vitals: ReportVital[];
};

type ReportResponse = Partial<ReportData> & {
  message?: string;
};

type AnalyzeResponse = {
  jobId?: string;
  url?: string;
  status?: string;
  progress?: number;
  message?: string;
};

export default function ReportPage() {
  const router = useRouter();

  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("jobId");

    async function fetchReport(currentJobId: string) {
      try {
        const response = await fetch(`/api/report/${currentJobId}`, {
          cache: "no-store",
        });

        const data = (await response.json()) as ReportResponse;

        if (!response.ok) {
          throw new Error(data.message || "Rapor alınamadı.");
        }

        if (
          !data.id ||
          !data.url ||
          !data.scores ||
          !data.findings ||
          !data.vitals
        ) {
          throw new Error("Rapor datası eksik geldi.");
        }

        if (isActive) {
          setReport(data as ReportData);
          setError("");
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Bir hata oluştu.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    async function redirectToLatestReport() {
      try {
        const response = await fetch("/api/analyze", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Analiz geçmişi alınamadı.");
        }

        const latestCompletedJob = Array.isArray(data.items)
          ? data.items.find((item: { id: string; status: string }) => {
              return item.status === "completed";
            })
          : null;

        if (latestCompletedJob?.id) {
          router.replace(`/report?jobId=${latestCompletedJob.id}`);
          await fetchReport(latestCompletedJob.id);
          return;
        }

        if (isActive) {
          setError(
            "Henüz tamamlanmış rapor bulunamadı. Önce yeni bir analiz başlatın."
          );
          setIsLoading(false);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Rapor yönlendirmesi yapılamadı."
          );
          setIsLoading(false);
        }
      }
    }

    if (!jobId) {
      redirectToLatestReport();
    } else {
      fetchReport(jobId);
    }

    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#050707] text-[#dce8e7]">
      <div className="min-h-screen bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[18px_18px] p-4 max-md:p-0">
        <div className="mx-auto min-h-[calc(100vh-32px)] overflow-hidden rounded-[18px] border border-white/15 bg-[#050707] shadow-[0_24px_100px_rgba(0,0,0,0.55)] max-md:min-h-screen max-md:rounded-none max-md:border-0">
          <ReportHeader />

          <div className="grid grid-cols-[280px_1fr] max-lg:grid-cols-1">
            <ReportSidebar />

            <ReportContent
              report={report}
              error={error}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ReportHeader() {
  return (
    <header className="border-b border-white/10 bg-[#0b0d0d]/95 backdrop-blur-xl">
      <div className="flex min-h-18.5 items-center justify-between gap-8 px-10 max-lg:px-6 max-md:flex-col max-md:items-start max-md:gap-5 max-md:py-5">
        <div className="flex items-center gap-9 max-md:flex-col max-md:items-start max-md:gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-[24px] font-bold tracking-[-0.9px] text-[#eaffff]"
          >
            <span className="relative flex size-9 items-center justify-center rounded-lg border border-[#6ff8ff]/25 bg-[#061718]">
              <span className="absolute size-5 rounded-full bg-[#6ff8ff]/15 blur-md" />
              <span className="relative size-2.5 rounded-full bg-[#6ff8ff] shadow-[0_0_18px_rgba(111,248,255,0.75)]" />
            </span>
            AetherAnalytics
          </Link>

          <nav className="flex items-center gap-6 max-md:w-full max-md:overflow-auto">
            {topNav.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`relative shrink-0 text-[15px] font-semibold tracking-[-0.2px] transition ${
                  item.title === "Models"
                    ? "text-[#72f7ff]"
                    : "text-[#aebdbc] hover:text-white"
                }`}
              >
                {item.title}

                {item.title === "Models" && (
                  <span className="absolute -bottom-7 left-0 h-px w-full bg-[#72f7ff] shadow-[0_0_12px_rgba(114,247,255,0.8)] max-md:-bottom-2" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 max-md:w-full max-md:justify-between">
          <div className="flex items-center gap-3 text-[#78f5ff] max-sm:hidden">
            <HeaderIconButton>
              <SlidersIcon />
            </HeaderIconButton>
            <HeaderIconButton>
              <BellIcon />
            </HeaderIconButton>
            <HeaderIconButton>
              <TerminalIcon />
            </HeaderIconButton>
          </div>

          <Link
            href="/scanner"
            className="flex h-10 items-center justify-center rounded-md bg-linear-to-r from-[#16dff0] to-[#5734d9] px-5 text-[13px] font-bold tracking-[0.5px] text-white shadow-[0_10px_34px_rgba(33,223,240,0.18)] transition hover:brightness-110"
          >
            Execute Analysis
          </Link>

          <div className="size-10.5 rounded-full border border-[#14383c] bg-[radial-gradient(circle_at_50%_30%,#82faff_0_10%,#12343a_30%,#020707_80%)]" />
        </div>
      </div>
    </header>
  );
}

function HeaderIconButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/3 text-[#7ff7ff] transition hover:bg-white/[0.07]">
      {children}
    </span>
  );
}

function ReportSidebar() {
  return (
    <aside className="flex min-h-[calc(100vh-74px)] flex-col border-r border-white/10 bg-[#090b0b] max-lg:hidden">
      <div className="border-b border-white/10 px-7 py-7">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-md border border-white/10 bg-[#061718] text-[#6cf7ff]">
            <ChipIcon />
          </span>

          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.4px] text-[#e6f2f1]">
              Report Engine
            </h2>
            <p className="font-mono text-[12px] text-[#93a09f]">
              Rule-based insights
            </p>
          </div>
        </div>

        <Link
          href="/scanner"
          className="mt-6 flex h-10 w-full items-center justify-center rounded-md border border-[#72f7ff]/20 bg-[#0b0d0d] font-mono text-[13px] font-bold tracking-[0.4px] text-[#72f7ff] transition hover:bg-[#72f7ff]/8"
        >
          New Scan
        </Link>
      </div>

      <nav className="py-7">
        {sidebarItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`relative flex h-15 items-center gap-5 px-7 font-mono text-[13px] font-bold tracking-[0.4px] transition ${
              item.active
                ? "bg-[#162a2d] text-[#19e5ef]"
                : "text-[#aeb9b8] hover:bg-white/4 hover:text-white"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.title}

            {item.active && (
              <span className="absolute right-0 top-0 h-full w-0.75 rounded-full bg-[#62f4ff] shadow-[0_0_18px_rgba(98,244,255,0.7)]" />
            )}
          </Link>
        ))}
      </nav>

      <div className="mx-7 mt-auto mb-7 rounded-2xl border border-white/10 bg-white/3 p-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[1px] text-[#72f7ff]">
          Report Flow
        </p>
        <p className="mt-3 text-[14px] font-medium leading-[1.45] text-[#aeb9b8]">
          PageSpeed verisi alınır, skorlar normalize edilir ve kural tabanlı
          öneriler rapora eklenir.
        </p>

        <div className="mt-5 space-y-4">
          <SidebarLink href="/history" icon={<HelpIcon />} text="History" />
          <SidebarLink href="/scanner" icon={<CodeIcon />} text="New Analysis" />
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 font-mono text-[12px] font-bold text-[#b9c2c1] transition hover:text-white"
    >
      {icon}
      {text}
    </Link>
  );
}

function ReportContent({
  report,
  error,
  isLoading,
}: {
  report: ReportData | null;
  error: string;
  isLoading: boolean;
}) {
  const router = useRouter();

  const [developerCopyStatus, setDeveloperCopyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isRescanning, setIsRescanning] = useState(false);

  const recommendations = report
    ? getReportRecommendations(
        report.findings.map((finding) => ({
          auditId: finding.auditId,
          title: finding.title,
          description: finding.desc,
          category: finding.tag,
        }))
      )
    : [];

  function handleDownloadPdf() {
    window.print();
  }

  async function handleRescan() {
    if (!report || isRescanning) return;

    setIsRescanning(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: report.url,
        }),
      });

      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok || !data.jobId || !data.url) {
        throw new Error(data.message || "Tekrar analiz başlatılamadı.");
      }

      router.push(
        `/loading?jobId=${data.jobId}&url=${encodeURIComponent(data.url)}`
      );
    } catch {
      setIsRescanning(false);
    }
  }

  async function handleSendToDevelopers() {
    if (!report) return;

    const message = [
      "AetherAnalytics Teknik Rapor",
      "============================",
      "",
      `URL: ${report.url}`,
      `Rapor ID: ${report.id}`,
      "",
      "Skorlar",
      "------",
      `Overall Score: ${report.overallScore}/100`,
      `Performance: ${report.scores.performance}/100`,
      `UX: ${report.scores.ux}/100`,
      `SEO: ${report.scores.seo}/100`,
      `Accessibility: ${report.scores.accessibility}/100`,
      `Security: ${report.scores.security}/100`,
      "",
      "PageSpeed Bulguları",
      "-------------------",
      ...report.findings.flatMap((finding, index) => [
        `${index + 1}. ${finding.title}`,
        finding.auditId ? `Audit ID: ${finding.auditId}` : "",
        `Seviye: ${finding.tag}`,
        `Açıklama: ${finding.desc}`,
        "",
      ]),
      "Akıllı Çözüm Önerileri",
      "----------------------",
      ...recommendations.flatMap((recommendation, index) => [
        `${index + 1}. ${recommendation.title}`,
        `Kategori: ${recommendation.category}`,
        `Öncelik: ${getPriorityLabel(recommendation.priority)}`,
        `Açıklama: ${recommendation.description}`,
        "Aksiyonlar:",
        ...recommendation.actions.map((action) => `- ${action}`),
        "",
      ]),
      "Core Web Vitals",
      "---------------",
      ...report.vitals.map(
        (vital) =>
          `${vital.metric}: ${vital.ours} | Ortalama: ${vital.average} | Lider: ${vital.leader} | Durum: ${vital.status}`
      ),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(message);

      setDeveloperCopyStatus("success");

      window.setTimeout(() => {
        setDeveloperCopyStatus("idle");
      }, 2500);
    } catch {
      const subject = encodeURIComponent(
        `AetherAnalytics Raporu - ${report.url}`
      );
      const body = encodeURIComponent(message);

      setDeveloperCopyStatus("error");
      window.location.href = `mailto:?subject=${subject}&body=${body}`;

      window.setTimeout(() => {
        setDeveloperCopyStatus("idle");
      }, 2500);
    }
  }

  if (isLoading) {
    return <ReportLoading />;
  }

  if (error || !report) {
    return <ReportError error={error} />;
  }

  const fallbackReport = isFallbackReport(report);
  const host = getHostName(report.url);
  const criticalCount = report.findings.filter(
    (item) => item.tag === "Kritik"
  ).length;
  const warningCount = report.findings.filter(
    (item) => item.tag === "Uyarı"
  ).length;
  const successVitals = report.vitals.filter(
    (item) => item.status === "success"
  ).length;

  return (
    <section className="relative overflow-hidden bg-[#050707] px-10 py-9 max-lg:px-6 max-md:px-5 print:px-0 print:py-0">
      <div className="pointer-events-none absolute -right-45 -top-45 size-115 rounded-full bg-[#72f7ff]/8 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -bottom-55 -left-55 size-130 rounded-full bg-[#5734d9]/10 blur-3xl print:hidden" />

      <div className="relative mx-auto max-w-330">
        <div className="mb-7 flex items-start justify-between gap-6 max-xl:flex-col">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <StatusBadge
                tone={fallbackReport ? "warning" : "success"}
                text={fallbackReport ? "Fallback Report" : "Real PageSpeed Data"}
              />

              <span className="rounded-full border border-white/10 bg-white/3 px-4 py-2 font-mono text-[12px] font-bold text-[#9ca8a7]">
                ID: {report.id.slice(0, 8)}
              </span>
            </div>

            <h1 className="text-[54px] font-bold leading-none tracking-[-3px] text-[#eaffff] max-md:text-[38px] max-md:tracking-[-1.8px]">
              Tam Denetim Raporu
            </h1>

            <div className="mt-5 flex min-w-0 flex-wrap items-center gap-3">
              <span className="flex min-w-0 items-center gap-2 rounded-full border border-[#72f7ff]/20 bg-[#72f7ff]/6 px-4 py-2 font-mono text-[13px] font-bold text-[#72f7ff]">
                <ExternalLinkIcon />
                <span className="truncate">{host}</span>
              </span>

              <span className="rounded-full border border-white/10 bg-white/3 px-4 py-2 font-mono text-[13px] font-bold text-[#aeb9b8]">
                {report.findings.length} bulgu
              </span>

              <span className="rounded-full border border-white/10 bg-white/3 px-4 py-2 font-mono text-[13px] font-bold text-[#aeb9b8]">
                {recommendations.length} öneri
              </span>
            </div>

            <p className="mt-5 max-w-195 text-[18px] font-medium leading-[1.55] tracking-[-0.3px] text-[#aebdbc]">
              {report.url} için performans, SEO, erişilebilirlik, UX ve teknik
              kalite sinyalleri analiz edildi. Bulgulara göre uygulanabilir
              çözüm önerileri üretildi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/3 px-5 text-[13px] font-bold text-white transition hover:bg-white/[0.07]"
            >
              <DownloadIcon />
              PDF İndir
            </button>

            <button
              type="button"
              onClick={handleSendToDevelopers}
              className="flex h-11 items-center gap-2 rounded-xl border border-[#72f7ff]/20 bg-[#72f7ff]/10 px-5 text-[13px] font-bold text-[#72f7ff] transition hover:bg-[#72f7ff]/15"
            >
              <CopyIcon />
              {developerCopyStatus === "success"
                ? "Rapor Kopyalandı"
                : developerCopyStatus === "error"
                  ? "Mail Taslağı Açıldı"
                  : "Geliştiricilere İlet"}
            </button>

            <button
              type="button"
              onClick={handleRescan}
              disabled={isRescanning}
              className="flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-[#16dff0] to-[#5734d9] px-5 text-[13px] font-bold text-white shadow-[0_16px_40px_rgba(33,223,240,0.18)] transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-60"
            >
              {isRescanning ? <SpinnerIcon /> : <RefreshIcon />}
              {isRescanning ? "Başlatılıyor" : "Tekrar Analiz Et"}
            </button>
          </div>
        </div>

        {fallbackReport && <FallbackNotice />}

        <div className="grid grid-cols-[320px_1fr] gap-6 max-xl:grid-cols-1">
          <HealthScoreCard report={report} />

          <div className="grid grid-cols-4 gap-4 max-2xl:grid-cols-2 max-md:grid-cols-1">
            <SummaryCard
              title="Performance"
              value={report.scores.performance}
              suffix="/100"
              tone={getScoreTone(report.scores.performance)}
              icon={<SpeedIcon />}
            />
            <SummaryCard
              title="SEO"
              value={report.scores.seo}
              suffix="/100"
              tone={getScoreTone(report.scores.seo)}
              icon={<SearchIcon />}
            />
            <SummaryCard
              title="Accessibility"
              value={report.scores.accessibility}
              suffix="/100"
              tone={getScoreTone(report.scores.accessibility)}
              icon={<TouchIcon />}
            />
            <SummaryCard
              title="Security"
              value={report.scores.security}
              suffix="/100"
              tone={getScoreTone(report.scores.security)}
              icon={<ShieldIcon />}
            />

            <InsightStat
              title="Kritik Bulgu"
              value={criticalCount}
              text="Öncelikli müdahale gerektiren maddeler."
              tone="danger"
            />
            <InsightStat
              title="Uyarı"
              value={warningCount}
              text="İyileştirme fırsatı bulunan alanlar."
              tone="warning"
            />
            <InsightStat
              title="Başarılı Vital"
              value={`${successVitals}/${report.vitals.length}`}
              text="İyi durumda olan Core Web Vitals metrikleri."
              tone="success"
            />
            <InsightStat
              title="Öneri Motoru"
              value={recommendations.length}
              text="Rule-based aksiyon önerisi üretildi."
              tone="cyan"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_420px] gap-6 max-2xl:grid-cols-1">
          <FindingsCard findings={report.findings} />
          <RecommendationsSummary recommendations={recommendations} />
        </div>

        <SuggestionsCard recommendations={recommendations} />
        <VitalsTable vitals={report.vitals} />
      </div>
    </section>
  );
}

function ReportLoading() {
  return (
    <section className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-[#050707] px-5">
      <div className="w-full max-w-140 rounded-3xl border border-white/10 bg-[#070909] p-8 text-center shadow-[0_0_90px_rgba(19,255,255,0.06)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#72f7ff]/20 bg-[#72f7ff]/8 text-[#72f7ff]">
          <SpinnerIcon />
        </div>

        <p className="mt-6 font-mono text-[12px] font-bold uppercase tracking-[1.4px] text-[#70f8ff]">
          Rapor Yükleniyor
        </p>

        <h1 className="mt-3 text-[34px] font-bold tracking-[-1.2px] text-[#eaffff] max-md:text-[28px]">
          Denetim verileri hazırlanıyor...
        </h1>

        <p className="mt-4 text-[15px] font-medium leading-normal text-[#aab4b3]">
          PageSpeed sonuçları, bulgular ve kural tabanlı öneriler rapor ekranına
          aktarılıyor.
        </p>
      </div>
    </section>
  );
}

function ReportError({ error }: { error: string }) {
  return (
    <section className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-[#050707] px-5">
      <div className="w-full max-w-155 rounded-3xl border border-white/10 bg-[#070909] p-8 text-center shadow-[0_0_90px_rgba(255,170,164,0.06)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#ffaaa4]/20 bg-[#ffaaa4]/8 text-[#ffaaa4]">
          <WarningIcon />
        </div>

        <p className="mt-6 font-mono text-[12px] font-bold uppercase tracking-[1.4px] text-[#ffaaa4]">
          Rapor Hatası
        </p>

        <h1 className="mt-3 text-[34px] font-bold tracking-[-1.2px] text-[#eaffff] max-md:text-[28px]">
          Rapor görüntülenemedi
        </h1>

        <p className="mt-4 text-[15px] font-medium leading-normal text-[#aab4b3]">
          {error || "Rapor datası bulunamadı."}
        </p>

        <div className="mt-7 flex justify-center gap-3 max-sm:flex-col">
          <Link
            href="/scanner"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#15dbe8] px-6 text-[13px] font-bold text-[#042f32] transition hover:bg-[#77faff]"
          >
            Yeni Analiz Başlat
          </Link>

          <Link
            href="/history"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/3 px-6 text-[13px] font-bold text-white transition hover:bg-white/[0.07]"
          >
            History Aç
          </Link>
        </div>
      </div>
    </section>
  );
}

function FallbackNotice() {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#18dce9]/30 bg-[#07191b]">
      <div className="flex items-start gap-4 px-5 py-4 max-sm:flex-col">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#12393b] text-[#18dce9]">
          <WarningIcon />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-mono text-[12px] font-bold uppercase tracking-[1.2px] text-[#18dce9]">
            Fallback rapor algılandı
          </h2>

          <p className="mt-2 text-[14px] font-medium leading-normal text-[#b9c4c3]">
            PageSpeed API kotası dolduğu veya API erişimi başarısız olduğu için
            bu rapor geçici fallback verisiyle oluşturulmuş olabilir. API
            bağlantısı sağlıklı olduğunda sistem gerçek Lighthouse skorlarını
            kullanır.
          </p>
        </div>
      </div>
    </div>
  );
}

function HealthScoreCard({ report }: { report: ReportData }) {
  const scoreDegree = Math.round((report.overallScore / 100) * 360);
  const tone = getScoreTone(report.overallScore);
  const color = getToneColor(tone);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080a0a] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div
        className="absolute -right-20 -top-20 size-52 rounded-full blur-3xl"
        style={{ backgroundColor: color.glow }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[12px] font-bold uppercase tracking-[1px] text-[#72f7ff]">
              Overall Score
            </p>
            <h2 className="mt-2 text-[24px] font-bold tracking-[-0.7px] text-[#e5eeee]">
              Sistem Sağlığı
            </h2>
          </div>

          <span
            className="rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.7px]"
            style={{
              color: color.text,
              backgroundColor: color.badge,
            }}
          >
            {getScoreLabel(report.overallScore)}
          </span>
        </div>

        <div className="mt-10 flex justify-center">
          <div
            className="relative flex size-42 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${color.text} 0deg ${scoreDegree}deg, #263232 ${scoreDegree}deg 360deg)`,
            }}
          >
            <div className="absolute size-36 rounded-full bg-[#050707]" />

            <div className="relative text-center">
              <div
                className="text-[46px] font-bold leading-none tracking-[-1.4px]"
                style={{ color: color.text }}
              >
                {report.overallScore}
              </div>
              <div className="mt-1 text-[12px] font-bold text-[#9fa9a8]">
                /100
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-white/10" />

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <ScoreMini title="UX" value={report.scores.ux} />
          <ScoreMini title="SEO" value={report.scores.seo} />
          <ScoreMini title="A11Y" value={report.scores.accessibility} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  suffix,
  tone,
  icon,
}: {
  title: string;
  value: number;
  suffix: string;
  tone: "success" | "warning" | "danger" | "cyan";
  icon: React.ReactNode;
}) {
  const color = getToneColor(tone);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080a0a] p-5">
      <div
        className="absolute -right-13.75 -top-13.75 size-36 rounded-full blur-3xl"
        style={{ backgroundColor: color.glow }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span
          className="flex size-11 items-center justify-center rounded-xl border"
          style={{
            color: color.text,
            backgroundColor: color.badge,
            borderColor: color.border,
          }}
        >
          {icon}
        </span>

        <span
          className="rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.7px]"
          style={{
            color: color.text,
            backgroundColor: color.badge,
          }}
        >
          {getScoreLabel(value)}
        </span>
      </div>

      <p className="relative mt-6 font-mono text-[12px] font-bold uppercase tracking-[0.8px] text-[#8f9b9a]">
        {title}
      </p>

      <p className="relative mt-2 text-[32px] font-bold tracking-[-1.1px] text-[#eaffff]">
        {value}
        <span className="ml-1 text-[14px] text-[#8f9b9a]">{suffix}</span>
      </p>
    </div>
  );
}

function InsightStat({
  title,
  value,
  text,
  tone,
}: {
  title: string;
  value: number | string;
  text: string;
  tone: "success" | "warning" | "danger" | "cyan";
}) {
  const color = getToneColor(tone);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080a0a] p-5">
      <p className="font-mono text-[12px] font-bold uppercase tracking-[0.8px] text-[#8f9b9a]">
        {title}
      </p>

      <p
        className="mt-3 text-[30px] font-bold tracking-[-1px]"
        style={{ color: color.text }}
      >
        {value}
      </p>

      <p className="mt-2 text-[14px] font-medium leading-[1.45] text-[#9ca8a7]">
        {text}
      </p>
    </div>
  );
}

function ScoreMini({ title, value }: { title: string; value: number }) {
  const tone = getScoreTone(value);
  const color = getToneColor(tone);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 px-3 py-4">
      <p className="font-mono text-[10px] font-bold uppercase text-[#84908f]">
        {title}
      </p>
      <p className="mt-2 text-[18px] font-bold" style={{ color: color.text }}>
        {value}
      </p>
    </div>
  );
}

function FindingsCard({ findings }: { findings: ReportFinding[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#070909] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-[24px] font-bold tracking-[-0.7px] text-[#e5eeee]">
          <span className="text-[#18dce9]">
            <SearchIcon />
          </span>
          Bulgular & Analiz
        </h2>

        <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 font-mono text-[11px] font-bold text-[#9ca8a7]">
          {findings.length} kayıt
        </span>
      </div>

      <div className="space-y-3">
        {findings.map((item, index) => {
          const meta = getFindingMeta(item.tag);

          return (
            <div
              key={`${item.title}-${index}`}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-[#121515] px-4 py-4 transition hover:border-white/20 hover:bg-[#151919] max-md:flex-col"
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}
              >
                {meta.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[17px] font-bold text-[#dce6e5]">
                    {item.title}
                  </h3>

                  {item.auditId && (
                    <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold text-[#7f8988]">
                      {item.auditId}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-[14px] font-medium leading-normal text-[#9ea8a7]">
                  {item.desc}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-[11px] font-bold ${meta.color}`}
              >
                {item.tag}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationsSummary({
  recommendations,
}: {
  recommendations: ReportRecommendation[];
}) {
  const high = recommendations.filter((item) => item.priority === "high").length;
  const medium = recommendations.filter(
    (item) => item.priority === "medium"
  ).length;
  const low = recommendations.filter((item) => item.priority === "low").length;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#070909] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <h2 className="flex items-center gap-3 text-[24px] font-bold tracking-[-0.7px] text-[#70f8ff]">
        <SparkIcon />
        Öneri Özeti
      </h2>

      <p className="mt-4 text-[15px] font-medium leading-[1.55] text-[#aab4b3]">
        PageSpeed bulguları, AetherAnalytics kural motoru tarafından
        eşleştirildi. Öncelik sırasına göre uygulanabilir aksiyonlar üretildi.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <PriorityBox label="Yüksek" value={high} tone="danger" />
        <PriorityBox label="Orta" value={medium} tone="cyan" />
        <PriorityBox label="Düşük" value={low} tone="success" />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.9px] text-[#72f7ff]">
          Sonraki en iyi adım
        </p>

        <p className="mt-3 text-[14px] font-medium leading-normal text-[#aeb9b8]">
          Önce yüksek öncelikli SEO ve performans önerilerini uygula, ardından
          tekrar analiz başlatıp skor değişimini dashboard üzerinden kontrol et.
        </p>
      </div>
    </div>
  );
}

function PriorityBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger" | "cyan";
}) {
  const color = getToneColor(tone);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121515] p-4 text-center">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.7px] text-[#8f9b9a]">
        {label}
      </p>
      <p className="mt-2 text-[26px] font-bold" style={{ color: color.text }}>
        {value}
      </p>
    </div>
  );
}

function SuggestionsCard({
  recommendations,
}: {
  recommendations: ReportRecommendation[];
}) {
  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-[#070909] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-[24px] font-bold tracking-[-0.7px] text-[#70f8ff]">
          <SparkIcon />
          Akıllı Çözüm Önerileri
        </h2>

        <span className="rounded-full border border-[#72f7ff]/20 bg-[#72f7ff]/8 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.8px] text-[#72f7ff]">
          Rule-based engine
        </span>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
          {recommendations.map((recommendation) => {
            const meta = getRecommendationMeta(recommendation);

            return (
              <div
                key={recommendation.id}
                className="rounded-2xl border border-white/10 bg-[#121515] p-5"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-bold ${meta.badgeColor}`}
                  >
                    {recommendation.category}
                  </span>

                  <span className="rounded-full bg-white/6 px-3 py-1.5 font-mono text-[11px] font-bold text-[#9ea8a7]">
                    {getPriorityLabel(recommendation.priority)}
                  </span>
                </div>

                <h3 className="text-[18px] font-bold tracking-[-0.3px] text-[#dce6e5]">
                  {recommendation.title}
                </h3>

                <p className="mt-3 text-[14px] font-medium leading-[1.55] text-[#aab4b3]">
                  {recommendation.description}
                </p>

                <ul className="mt-5 space-y-3">
                  {recommendation.actions.map((action) => (
                    <li
                      key={action}
                      className="flex gap-3 text-[14px] font-medium leading-normal text-[#aab4b3]"
                    >
                      <span
                        className={`mt-2 size-1.5 shrink-0 rounded-full ${meta.dotColor}`}
                      />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>

                {recommendation.matchedFindings.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#080a0a] p-4">
                    <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.8px] text-[#636b6a]">
                      İlgili bulgu
                    </p>

                    <div className="space-y-1">
                      {recommendation.matchedFindings.map((finding) => (
                        <p
                          key={finding}
                          className="text-[12px] font-medium leading-normal text-[#7f8988]"
                        >
                          {finding}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#121515] p-5">
          <h3 className="text-[17px] font-bold text-[#d6d0d0]">
            Kritik öneri bulunamadı
          </h3>

          <p className="mt-3 text-[14px] font-medium leading-normal text-[#aab4b3]">
            Bu raporda öneri üretilecek özel bir PageSpeed bulgusu bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
}

function VitalsTable({ vitals }: { vitals: ReportVital[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#070909] shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6">
        <div>
          <p className="font-mono text-[12px] font-bold uppercase tracking-[0.8px] text-[#72f7ff]">
            Core Web Vitals
          </p>
          <h2 className="mt-1 text-[24px] font-bold tracking-[-0.8px] text-[#e5eeee]">
            Rakip Kıyaslaması
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/3 px-4 py-2 font-mono text-[11px] font-bold text-[#9ca8a7]">
          {vitals.length} metrik
        </span>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-190 text-left">
          <thead className="bg-[#111515] font-mono text-[11px] font-bold uppercase tracking-[0.7px] text-[#8f9a99]">
            <tr>
              <th className="px-5 py-4">Metrik</th>
              <th className="px-5 py-4">Bizim Sistem</th>
              <th className="px-5 py-4">Sektör Ortalaması</th>
              <th className="px-5 py-4">Lider Rakip</th>
              <th className="px-5 py-4 text-right">Durum</th>
            </tr>
          </thead>

          <tbody>
            {vitals.map((item) => {
              const healthy = item.status === "success";

              return (
                <tr
                  key={item.metric}
                  className="border-t border-white/10 text-[14px] font-bold text-[#aeb8b7]"
                >
                  <td className="px-5 py-5">{item.metric}</td>
                  <td
                    className={`px-5 py-5 font-mono ${
                      healthy ? "text-[#5df6a8]" : "text-[#ffaaa4]"
                    }`}
                  >
                    {item.ours}
                  </td>
                  <td className="px-5 py-5 font-mono text-[#7d8786]">
                    {item.average}
                  </td>
                  <td className="px-5 py-5 font-mono text-[#8f9998]">
                    {item.leader}
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-end">
                      {healthy ? (
                        <span className="text-[#5df6a8]">
                          <CheckCircleIcon />
                        </span>
                      ) : (
                        <span className="text-[#ffaaa4]">
                          <WarningIcon />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function isFallbackReport(report: ReportData) {
  return report.findings.some((item) => {
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

function getHostName(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function getScoreTone(score: number): "success" | "warning" | "danger" | "cyan" {
  if (score >= 90) return "success";
  if (score >= 70) return "cyan";
  if (score >= 50) return "warning";
  return "danger";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "İyi";
  if (score >= 70) return "Orta";
  if (score >= 50) return "Riskli";
  return "Kritik";
}

function getToneColor(tone: "success" | "warning" | "danger" | "cyan") {
  if (tone === "success") {
    return {
      text: "#5df6a8",
      badge: "rgba(93,246,168,0.10)",
      border: "rgba(93,246,168,0.25)",
      glow: "rgba(93,246,168,0.10)",
    };
  }

  if (tone === "warning") {
    return {
      text: "#ffd36f",
      badge: "rgba(255,211,111,0.10)",
      border: "rgba(255,211,111,0.25)",
      glow: "rgba(255,211,111,0.10)",
    };
  }

  if (tone === "danger") {
    return {
      text: "#ffaaa4",
      badge: "rgba(255,170,164,0.10)",
      border: "rgba(255,170,164,0.25)",
      glow: "rgba(255,170,164,0.10)",
    };
  }

  return {
    text: "#18dce9",
    badge: "rgba(24,220,233,0.10)",
    border: "rgba(24,220,233,0.25)",
    glow: "rgba(24,220,233,0.10)",
  };
}

function getFindingMeta(tag: FindingTag) {
  if (tag === "Kritik") {
    return {
      color: "bg-[#4a1515] text-[#ffaaa4]",
      iconBg: "bg-[#4a1515] text-[#ffaaa4]",
      icon: <SpeedIcon />,
    };
  }

  if (tag === "Uyarı") {
    return {
      color: "bg-[#12393b] text-[#19dbe7]",
      iconBg: "bg-[#12393b] text-[#19dbe7]",
      icon: <TouchIcon />,
    };
  }

  return {
    color: "bg-[#143923] text-[#5df6a8]",
    iconBg: "bg-[#143923] text-[#5df6a8]",
    icon: <ImageIcon />,
  };
}

function getRecommendationMeta(recommendation: ReportRecommendation) {
  if (recommendation.priority === "high") {
    return {
      badgeColor: "bg-[#4a1515] text-[#ffaaa4]",
      dotColor: "bg-[#ffaaa4]",
    };
  }

  if (recommendation.category === "Accessibility") {
    return {
      badgeColor: "bg-[#143923] text-[#5df6a8]",
      dotColor: "bg-[#5df6a8]",
    };
  }

  return {
    badgeColor: "bg-[#12393b] text-[#19dbe7]",
    dotColor: "bg-[#18dce9]",
  };
}

function getPriorityLabel(priority: ReportRecommendation["priority"]) {
  if (priority === "high") return "Yüksek Öncelik";
  if (priority === "medium") return "Orta Öncelik";
  return "Düşük Öncelik";
}

function StatusBadge({
  tone,
  text,
}: {
  tone: "success" | "warning";
  text: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.8px] ${
        tone === "success"
          ? "border-[#42f59d]/20 bg-[#42f59d]/8 text-[#42f59d]"
          : "border-[#18dce9]/25 bg-[#18dce9]/8 text-[#18dce9]"
      }`}
    >
      <span
        className={`size-2 rounded-full ${
          tone === "success" ? "bg-[#42f59d]" : "bg-[#18dce9]"
        }`}
      />
      {text}
    </span>
  );
}

/* Icons */

function SlidersIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4V20M12 4V20M19 4V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 8H7M10 15H14M17 10H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 9A6 6 0 0 0 6 9C6 16 3 17 3 17H21S18 16 18 9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 21H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 10L10 12L7 14M12 15H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect
        x="8"
        y="8"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 3V6M12 18V21M3 12H6M18 12H21M6 6L4 4M18 6L20 4M6 18L4 20M18 18L20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function FlowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 17L9 12L13 15L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="17" r="1.7" fill="currentColor" />
      <circle cx="9" cy="12" r="1.7" fill="currentColor" />
      <circle cx="13" cy="15" r="1.7" fill="currentColor" />
      <circle cx="20" cy="7" r="1.7" fill="currentColor" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 16A7 7 0 0 1 19 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 16L16 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 19H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L20 6V11C20 16 16.8 20 12 21C7.2 20 4 16 4 11V6L12 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LogsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 8H16M8 12H16M8 16H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.8 9A2.3 2.3 0 0 1 12 7.5C13.4 7.5 14.5 8.4 14.5 9.8C14.5 11.6 12 11.8 12 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 9L4 12L8 15M16 9L20 12L16 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4L21 20H3L12 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 10V14M12 17H12.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4V15M12 15L8 11M12 15L16 11M5 20H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TouchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 11V5A2 2 0 0 1 13 5V13M13 13L14 10A2 2 0 0 1 18 11L16 18C15.5 20 14 21 12 21H10C8 21 6.5 20 5.5 18L3 13A1.8 1.8 0 0 1 6.2 11.5L8 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 15L11 12L13 14L16 10L20 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18L19 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.5 12L11 14.5L15.5 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 12A8 8 0 1 1 17.7 6.4M20 4V10H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 16H4A2 2 0 0 1 2 14V5A2 2 0 0 1 4 3H13A2 2 0 0 1 15 5V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 5H19V10M19 5L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 6H6A2 2 0 0 0 4 8V18A2 2 0 0 0 6 20H16A2 2 0 0 0 18 18V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M20 12A8 8 0 0 0 12 4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}