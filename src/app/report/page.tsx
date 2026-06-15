"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const topNav = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Scanner", href: "/scanner" },
  { title: "Live Feed", href: "/loading" },
  { title: "Models", href: "/report" },
];

const sidebarItems = [
  { title: "Neural Grid", icon: <GridIcon /> },
  { title: "Traffic Flow", icon: <FlowIcon /> },
  { title: "Optimization", icon: <SpeedIcon /> },
  { title: "Security Ops", icon: <ShieldIcon />, active: true },
  { title: "System Logs", icon: <LogsIcon /> },
];

type FindingTag = "Kritik" | "Uyarı" | "Bilgi";

type ReportFinding = {
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

export default function ReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("jobId");

    if (!jobId) {
      setError("Rapor kimliği bulunamadı.");
      setIsLoading(false);
      return;
    }

    let isActive = true;

    async function fetchReport() {
      try {
        const response = await fetch(`/api/report/${jobId}`, {
          cache: "no-store",
        });

        const data = (await response.json()) as ReportResponse;

        if (!response.ok) {
          throw new Error(data.message || "Rapor alınamadı.");
        }

        if (!data.id || !data.url || !data.scores || !data.findings || !data.vitals) {
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

    fetchReport();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#090a0a] text-[#dce8e7]">
      <div className="min-h-screen bg-[radial-gradient(circle,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[18px_18px] p-3 max-md:p-0">
        <div className="mx-auto min-h-[calc(100vh-24px)] overflow-hidden rounded-[10px] border-[3px] border-[#6c5cff] bg-[#050707] max-md:min-h-screen max-md:rounded-none max-md:border-0">
          <ReportHeader />

          <div className="grid grid-cols-[240px_1fr] max-lg:grid-cols-1">
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
    <header className="border-b border-white/10 bg-[#0d0f0f]">
      <div className="flex h-14.5 items-center justify-between px-10 max-lg:px-5 max-md:h-auto max-md:flex-col max-md:items-start max-md:gap-4 max-md:py-4">
        <div className="flex items-center gap-9 max-md:flex-col max-md:items-start max-md:gap-4">
          <Link
            href="/"
            className="text-[23px] font-bold tracking-[-0.8px] text-[#70f8ff]"
          >
            AetherAnalytics
          </Link>

          <nav className="flex items-center gap-6 max-md:w-full max-md:overflow-auto">
            {topNav.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`relative shrink-0 text-[14px] font-medium tracking-[0.2px] transition ${
                  item.title === "Models"
                    ? "text-[#70f8ff]"
                    : "text-[#b3bcbb] hover:text-white"
                }`}
              >
                {item.title}

                {item.title === "Models" && (
                  <span className="absolute -bottom-2.5 left-0 h-px w-full bg-[#70f8ff]" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5 max-md:w-full max-md:justify-between">
          <div className="flex items-center gap-4 text-[#d7e0df]">
            <SlidersIcon />
            <BellIcon />
            <TerminalIcon />
          </div>

          <Link
            href="/scanner"
            className="flex h-7.75 items-center justify-center rounded-xs bg-linear-to-r from-[#19dce9] to-[#5524d5] px-5 text-[12px] font-bold tracking-[0.4px] text-white"
          >
            Execute Analysis
          </Link>

          <div className="size-8 rounded-full border border-[#174b51] bg-[radial-gradient(circle_at_50%_25%,#75f8ff_0_7%,#1f3038_32%,#050707_78%)]" />
        </div>
      </div>
    </header>
  );
}

function ReportSidebar() {
  return (
    <aside className="flex min-h-[calc(100vh-64px)] flex-col border-r border-white/10 bg-[#0b0d0d] max-lg:hidden">
      <div className="border-b border-white/10 px-8 py-7">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-[3px] bg-[#113437] text-[#6cf7ff]">
            <ChipIcon />
          </span>

          <div>
            <h2 className="text-[23px] font-bold tracking-[-0.8px] text-[#6ff8ff]">
              AetherOS v1.0
            </h2>
            <p className="font-mono text-[12px] font-bold text-[#a0aaa9]">
              System Nominal
            </p>
          </div>
        </div>

        <Link
          href="/scanner"
          className="mt-6 flex h-6.75 w-full items-center justify-center rounded-xs bg-white text-[12px] font-bold text-[#111]"
        >
          New Scan
        </Link>
      </div>

      <nav className="py-8">
        {sidebarItems.map((item) => (
          <a
            key={item.title}
            href="#"
            className={`relative flex h-14 items-center gap-6 px-8 font-mono text-[12px] font-bold tracking-[0.6px] transition ${
              item.active
                ? "bg-[#24113e] text-[#17dce9]"
                : "text-[#aeb8b7] hover:bg-white/4 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            {item.title}

            {item.active && (
              <span className="absolute right-0 top-0 h-full w-0.75 rounded-full bg-[#70f8ff]" />
            )}
          </a>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-8 py-8">
        <div className="space-y-8">
          <a
            href="#"
            className="flex items-center gap-5 font-mono text-[12px] font-bold text-[#b9c2c1]"
          >
            <HelpIcon />
            Support
          </a>

          <a
            href="#"
            className="flex items-center gap-5 font-mono text-[12px] font-bold text-[#b9c2c1]"
          >
            <CodeIcon />
            API
          </a>
        </div>
      </div>
    </aside>
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
  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-58px)] items-center justify-center bg-[#050707] px-5">
        <div className="rounded-md border border-white/10 bg-[#070808] px-8 py-7 text-center">
          <p className="font-mono text-[12px] font-bold tracking-[1.4px] text-[#70f8ff]">
            RAPOR YÜKLENİYOR
          </p>
          <h1 className="mt-3 text-[32px] font-bold tracking-[-1px] text-[#f0eeee]">
            Denetim verileri hazırlanıyor...
          </h1>
        </div>
      </section>
    );
  }

  if (error || !report) {
    return (
      <section className="flex min-h-[calc(100vh-58px)] items-center justify-center bg-[#050707] px-5">
        <div className="max-w-150 rounded-md border border-white/10 bg-[#070808] px-8 py-7 text-center">
          <p className="font-mono text-[12px] font-bold tracking-[1.4px] text-[#ffaaa4]">
            RAPOR HATASI
          </p>

          <h1 className="mt-3 text-[32px] font-bold tracking-[-1px] text-[#f0eeee]">
            Rapor görüntülenemedi
          </h1>

          <p className="mt-4 text-[15px] font-medium leading-normal text-[#aab4b3]">
            {error || "Rapor datası bulunamadı."}
          </p>

          <Link
            href="/scanner"
            className="mt-6 inline-flex h-9 items-center justify-center rounded-xs bg-[#15dbe8] px-6 text-[12px] font-bold text-[#042f32]"
          >
            Yeni Analiz Başlat
          </Link>
        </div>
      </section>
    );
  }

  const fallbackReport = isFallbackReport(report);

  return (
    <section className="bg-[#050707] px-11 py-8 max-lg:px-5">
      <div className="mx-auto max-w-325">
        <div className="mb-9 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <div
              className={`mb-4 flex items-center gap-3 font-mono text-[12px] font-bold tracking-[1.4px] ${
                fallbackReport ? "text-[#18dce9]" : "text-[#ffb6ad]"
              }`}
            >
              <WarningIcon />
              {fallbackReport ? "FALLBACK RAPOR" : "KRİTİK UYARI"}
            </div>

            <h1 className="text-[44px] font-bold leading-none tracking-[-2px] text-[#f0eeee] max-md:text-[34px]">
              Tam Denetim Raporu
            </h1>

            <p className="mt-5 max-w-150 text-[18px] font-medium leading-normal text-[#b9c4c3]">
              {report.url} için UX ve performans anormalliklerinin detaylı
              analizi. Yapay zeka destekli çözüm önerileri üretilmiştir.
            </p>
          </div>

          <div className="mb-1 flex items-center gap-2">
            <button className="flex h-8.5 items-center gap-2 border border-white/15 px-5 text-[12px] font-bold text-white transition hover:bg-white/4">
              <DownloadIcon />
              PDF İndir
            </button>

            <button className="h-8.5 bg-[#15dbe8] px-5 text-[12px] font-bold text-[#042f32] transition hover:bg-[#77faff]">
              Geliştiricilere İlet
            </button>
          </div>
        </div>

        {fallbackReport && <FallbackNotice />}

        <div className="grid grid-cols-[260px_1fr] gap-6 max-lg:grid-cols-1">
          <HealthScoreCard report={report} />
          <FindingsCard findings={report.findings} />
        </div>

        <SuggestionsCard />
        <VitalsTable vitals={report.vitals} />
      </div>
    </section>
  );
}

function FallbackNotice() {
  return (
    <div className="mb-6 overflow-hidden rounded-md border border-[#18dce9]/30 bg-[#07191b]">
      <div className="flex items-start gap-4 px-5 py-4 max-sm:flex-col">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xs bg-[#12393b] text-[#18dce9]">
          <WarningIcon />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-mono text-[12px] font-bold tracking-[1.2px] text-[#18dce9]">
            GERÇEK LIGHTHOUSE VERİSİ ALINAMADI
          </h2>

          <p className="mt-2 text-[14px] font-medium leading-normal text-[#b9c4c3]">
            PageSpeed API kotası dolduğu veya API erişimi başarısız olduğu için
            bu rapor geçici fallback verisiyle oluşturuldu. Geçerli bir
            PageSpeed API key eklendiğinde sistem otomatik olarak gerçek
            Lighthouse skorlarını kullanır.
          </p>
        </div>
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

function HealthScoreCard({ report }: { report: ReportData }) {
  const scoreDegree = Math.round((report.overallScore / 100) * 360);

  return (
    <div className="relative overflow-hidden rounded-md border border-white/10 bg-[#080909] p-6">
      <div className="absolute right-0 top-0 size-42.5 bg-[#551717]/35 blur-[70px]" />

      <div className="relative z-10">
        <h2 className="text-[22px] font-bold tracking-[-0.6px] text-[#e5dddd]">
          Sistem Sağlık Skoru
        </h2>

        <div className="mt-11 flex justify-center">
          <div
            className="relative flex size-34.5 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#ffaaa4 0deg ${scoreDegree}deg, #536363 ${scoreDegree}deg 360deg)`,
            }}
          >
            <div className="absolute size-29.5 rounded-full bg-[#050707]" />

            <div className="relative text-center">
              <div className="text-[33px] font-bold leading-none text-[#ffaaa4]">
                {report.overallScore}
              </div>
              <div className="mt-1 text-[12px] font-bold text-[#9fa9a8]">
                /100
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 h-px w-full bg-white/10" />

        <div className="mt-4 grid grid-cols-3 text-center">
          <ScoreMini title="Performans" value={report.scores.performance} danger />
          <ScoreMini title="UX" value={report.scores.ux} />
          <ScoreMini title="Güvenlik" value={report.scores.security} cyan />
        </div>
      </div>
    </div>
  );
}

function ScoreMini({
  title,
  value,
  danger,
  cyan,
}: {
  title: string;
  value: number;
  danger?: boolean;
  cyan?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold text-[#84908f]">{title}</p>
      <p
        className={`mt-2 text-[17px] font-bold ${
          danger ? "text-[#ffaaa4]" : cyan ? "text-[#18dce9]" : "text-[#5df6a8]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FindingsCard({ findings }: { findings: ReportFinding[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-[#070808] p-6">
      <h2 className="mb-6 flex items-center gap-3 text-[24px] font-bold tracking-[-0.7px] text-[#e5dddd]">
        <span className="text-[#18dce9]">
          <SearchIcon />
        </span>
        Bulgular & Analiz
      </h2>

      <div className="space-y-3">
        {findings.map((item) => {
          const meta = getFindingMeta(item.tag);

          return (
            <div
              key={item.title}
              className="flex items-center gap-5 rounded-[3px] bg-[#1b1c1c] px-4 py-4"
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center ${meta.iconBg}`}
              >
                {meta.icon}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[17px] font-bold text-[#d6d0d0]">
                  {item.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-[1.45] text-[#9ea8a7]">
                  {item.desc}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-xs px-3 py-2 font-mono text-[12px] font-bold ${meta.color}`}
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

function getFindingMeta(tag: FindingTag) {
  if (tag === "Kritik") {
    return {
      color: "bg-[#4a1515] text-[#ffaaa4]",
      iconBg: "bg-[#4a1515]",
      icon: <SpeedIcon />,
    };
  }

  if (tag === "Uyarı") {
    return {
      color: "bg-[#12393b] text-[#19dbe7]",
      iconBg: "bg-[#12393b]",
      icon: <TouchIcon />,
    };
  }

  return {
    color: "bg-[#143923] text-[#5df6a8]",
    iconBg: "bg-[#143923]",
    icon: <ImageIcon />,
  };
}

function SuggestionsCard() {
  return (
    <div className="mt-6 rounded-md border border-white/10 bg-[#070808] p-6">
      <h2 className="mb-6 flex items-center gap-3 text-[22px] font-bold tracking-[-0.7px] text-[#70f8ff]">
        <SparkIcon />
        AI Destekli Çözüm Önerileri
      </h2>

      <div className="grid grid-cols-2 gap-8 max-lg:grid-cols-1">
        <div className="border-l-2 border-[#ffaaa4] pl-5">
          <h3 className="text-[16px] font-bold text-[#d6d0d0]">
            Web Worker Entegrasyonu
          </h3>

          <p className="mt-3 text-[14px] font-medium leading-normal text-[#aab4b3]">
            Ağır veri işleme görevlerini ana iplikten ayırmak için Web Worker
            kullanın. Bu, TBT&apos;yi tahmini olarak %80 azaltacaktır.
          </p>

          <pre className="mt-4 overflow-hidden rounded-xs bg-[#111111] p-3 font-mono text-[12px] font-bold leading-[1.6] text-[#636b6a]">
            {`const worker = new Worker('data-
processor.js');
worker.postMessage(heavyDataset);`}
          </pre>
        </div>

        <div className="border-l-2 border-[#18dce9] pl-5">
          <h3 className="text-[16px] font-bold text-[#d6d0d0]">
            Erişilebilirlik Düzenlemeleri
          </h3>

          <p className="mt-3 text-[14px] font-medium leading-normal text-[#aab4b3]">
            Navigasyon elemanlarına `min-h-[48px]` ve `min-w-[48px]`
            uygulayarak dokunmatik hedef alanlarını genişletin.
          </p>

          <a href="#" className="mt-3 inline-flex font-mono text-[12px] font-bold text-[#18dce9]">
            Kodu Uygula →
          </a>
        </div>
      </div>
    </div>
  );
}

function VitalsTable({ vitals }: { vitals: ReportVital[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#070808]">
      <h2 className="px-6 py-6 text-[22px] font-bold tracking-[-0.8px] text-[#e5dddd]">
        Rakip Kıyaslaması (Core Web Vitals)
      </h2>

      <div className="overflow-auto">
        <table className="w-full min-w-190 text-left">
          <thead className="bg-[#111313] font-mono text-[11px] font-bold tracking-[0.7px] text-[#8f9a99]">
            <tr>
              <th className="px-4 py-4">METRİK</th>
              <th className="px-4 py-4">BİZİM SİSTEM</th>
              <th className="px-4 py-4">SEKTÖR ORTALAMASI</th>
              <th className="px-4 py-4">LİDER RAKİP</th>
              <th className="px-4 py-4 text-right">DURUM</th>
            </tr>
          </thead>

          <tbody>
            {vitals.map((item) => (
              <tr
                key={item.metric}
                className="border-t border-white/6 text-[14px] font-bold text-[#aeb8b7]"
              >
                <td className="px-4 py-5">{item.metric}</td>
                <td
                  className={`px-4 py-5 font-mono ${
                    item.status === "warning"
                      ? "text-[#ffaaa4]"
                      : item.metric.includes("CLS")
                        ? "text-[#18dce9]"
                        : "text-[#5df6a8]"
                  }`}
                >
                  {item.ours}
                </td>
                <td className="px-4 py-5 font-mono text-[#7d8786]">
                  {item.average}
                </td>
                <td className="px-4 py-5 font-mono text-[#8f9998]">
                  {item.leader}
                </td>
                <td className="px-4 py-5">
                  <div className="flex justify-end">
                    {item.status === "warning" ? (
                      <span className="text-[#ffaaa4]">
                        <WarningIcon />
                      </span>
                    ) : (
                      <span
                        className={
                          item.metric.includes("CLS")
                            ? "text-[#18dce9]"
                            : "text-[#5df6a8]"
                        }
                      >
                        <CheckCircleIcon />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Icons */

function SlidersIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M5 4V20M12 4V20M19 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 8H7M10 15H14M17 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 9A6 6 0 0 0 6 9C6 16 3 17 3 17H21S18 16 18 9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M10 21H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" stroke="currentColor" strokeWidth="2" />
      <path d="M7 10L10 12L7 14M12 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="8" height="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="4" width="6" height="6" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="14" width="6" height="6" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="6" height="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function FlowIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 17L9 12L13 15L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="17" r="1.5" fill="currentColor" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      <circle cx="13" cy="15" r="1.5" fill="currentColor" />
      <circle cx="20" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M5 16A7 7 0 0 1 19 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L20 6V11C20 16 16.8 20 12 21C7.2 20 4 16 4 11V6L12 3Z" fill="currentColor" />
    </svg>
  );
}

function LogsIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8H16M8 12H16M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9.8 9A2.3 2.3 0 0 1 12 7.5C13.4 7.5 14.5 8.4 14.5 9.8C14.5 11.6 12 11.8 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M8 9L4 12L8 15M16 9L20 12L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 4L21 20H3L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 10V14M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 4V15M12 15L8 11M12 15L16 11M5 20H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TouchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 11V5A2 2 0 0 1 13 5V13M13 13L14 10A2 2 0 0 1 18 11L16 18C15.5 20 14 21 12 21H10C8 21 6.5 20 5.5 18L3 13A1.8 1.8 0 0 1 6.2 11.5L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="14" stroke="currentColor" strokeWidth="2" />
      <path d="M8 15L11 12L13 14L16 10L20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18L19 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 12L11 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}