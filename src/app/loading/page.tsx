"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const scanSteps = [
  {
    percent: 8,
    title: "Bağlantı Kuruluyor",
    subtitle: "İstemci bağlantısı doğrulanıyor",
  },
  {
    percent: 20,
    title: "SSL Kontrolü",
    subtitle: "Güvenlik katmanı analiz ediliyor",
  },
  {
    percent: 42,
    title: "DOM Analizi",
    subtitle: "DOM Yapısı Çözümleniyor",
  },
  {
    percent: 64,
    title: "AI Modeli",
    subtitle: "Sinir ağı modelleri yükleniyor",
  },
  {
    percent: 84,
    title: "Meta Analizi",
    subtitle: "Veri katmanları ayrıştırılıyor",
  },
  {
    percent: 100,
    title: "Analiz Tamamlandı",
    subtitle: "Sonuçlar hazırlanıyor",
  },
];

type AnalyzeStatus = "queued" | "running" | "completed" | "failed";

type StatusResponse = {
  jobId?: string;
  url?: string;
  status?: AnalyzeStatus;
  progress?: number;
  logs?: string[];
  reportId?: string | null;
  message?: string;
};

export default function LoadingPage() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  const [jobId, setJobId] = useState("");
  const [targetUrl, setTargetUrl] = useState("https://client-domain.com");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<AnalyzeStatus>("queued");
  const [logs, setLogs] = useState<string[]>(["> Analiz kuyruğa alındı..."]);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("jobId");
    const url = params.get("url");

    if (!id) {
      setError("Analiz kimliği bulunamadı.");
      return;
    }

    setJobId(id);

    if (url) {
      setTargetUrl(url);
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;

    let intervalId: number | undefined;

    async function fetchStatus() {
      try {
        const response = await fetch(`/api/analyze/${jobId}/status`, {
          cache: "no-store",
        });

        const data = (await response.json()) as StatusResponse;

        if (!response.ok) {
          setError(data.message || "Analiz durumu alınamadı.");

          if (intervalId) {
            window.clearInterval(intervalId);
          }

          return;
        }

        setError("");
        setStatus(data.status || "running");
        setProgress(typeof data.progress === "number" ? data.progress : 0);

        if (data.url) {
          setTargetUrl(data.url);
        }

        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }

        if (data.status === "completed" && data.reportId) {
          if (intervalId) {
            window.clearInterval(intervalId);
          }

          if (!hasRedirected.current) {
            hasRedirected.current = true;

            window.setTimeout(() => {
              router.push(`/report?jobId=${data.reportId}`);
            }, 900);
          }
        }

        if (data.status === "failed") {
          setError("Analiz başarısız oldu.");

          if (intervalId) {
            window.clearInterval(intervalId);
          }
        }
      } catch {
        setError("Sunucuya bağlanırken bir hata oluştu.");

        if (intervalId) {
          window.clearInterval(intervalId);
        }
      }
    }

    fetchStatus();
    intervalId = window.setInterval(fetchStatus, 700);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [jobId, router]);

  const activeStep = useMemo(() => {
    return (
      scanSteps.find((step) => progress <= step.percent) ??
      scanSteps[scanSteps.length - 1]
    );
  }, [progress]);

  const pageTitle = useMemo(() => {
    if (error) return "Tarama Durduruldu";
    if (status === "completed") return "Analiz Tamamlandı";
    return "Sinirsel Tarama Devam Ediyor...";
  }, [error, status]);

  return (
    <main className="min-h-screen bg-[#050707] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[18px_18px] p-1">
        <section className="relative flex min-h-[calc(100vh-8px)] items-center justify-center overflow-hidden rounded-[14px] border-4 border-[#7667ff] bg-[#050707] px-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(16,95,92,0.24),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-size-[8px_8px] opacity-60" />

          <div className="relative z-10 flex w-full max-w-190 flex-col items-center text-center">
            <ScannerVisual />

            <h1 className="mt-8 text-[52px] font-bold leading-none tracking-[-2.6px] text-[#e2fbfb] max-md:text-[38px] max-sm:text-[32px]">
              {pageTitle}
            </h1>

            <p className="mt-7 text-[26px] font-bold tracking-[-0.8px] text-[#12dce8] max-md:text-[21px]">
              {error ? "İşlem kontrol edilmeli" : `${activeStep.subtitle} %${progress}`}
            </p>

            <p className="mt-8 max-w-130 text-[17px] font-medium leading-[1.45] text-[#8f9b9a] max-md:text-[15px]">
              Lütfen bekleyin, AetherAnalytics AIOS hedef mimariyi güvenlik ve
              performans metrikleri açısından inceliyor.
            </p>

            <div className="mt-9 h-1.75 w-full max-w-125 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#13dce8] shadow-[0_0_18px_rgba(19,220,232,0.85)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <TerminalLogs
              targetUrl={targetUrl}
              logs={logs}
              progress={progress}
              error={error}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function ScannerVisual() {
  return (
    <div className="relative flex h-52.5 w-65 items-center justify-center">
      <div className="scanner-gear absolute bottom-0 h-37.5 w-42.5 rounded-[45px] bg-[#0d3e40]/70">
        <div className="absolute left-1/2 top-1/2 size-18 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050707]" />
        <div className="absolute -bottom-10.5 -left-4.5 size-17.5 rounded-[22px] bg-[#0d3e40]" />
        <div className="absolute -bottom-10.5 -right-4.5 size-17.5 rounded-[22px] bg-[#0d3e40]" />
      </div>

      <div className="scanner-chip relative z-10 flex size-34.5 items-center justify-center rounded-[14px] border border-white/10 bg-[#1d1d1d] shadow-[0_0_70px_rgba(18,220,232,0.16)]">
        <span className="text-[#14dce8]">
          <TargetIcon />
        </span>

        <div className="scanner-orbit absolute left-1/2 top-1/2 h-30 w-30 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-1/2 h-0.75 w-18.5 origin-left rounded-full bg-[#12dce8] shadow-[0_0_18px_rgba(18,220,232,0.85)]" />
        </div>
      </div>
    </div>
  );
}

function TerminalLogs({
  targetUrl,
  logs,
  progress,
  error,
}: {
  targetUrl: string;
  logs: string[];
  progress: number;
  error: string;
}) {
  return (
    <div className="mt-8 w-full max-w-125 rounded-sm border border-white/5 bg-[#070808]/90 px-5 py-5 text-left shadow-[0_0_40px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[12px] font-bold tracking-[1.6px] text-[#5d6665]">
          SYSTEM LOGS
        </span>

        <span className="text-[#7f8988]">
          <TerminalIcon />
        </span>
      </div>

      <div className="space-y-2 font-mono text-[13px] font-bold leading-[1.45]">
        <p className="text-[#36403f]">&gt; Hedef URL: {targetUrl}</p>

        {logs.map((item, index) => {
          const isLast = index === logs.length - 1;

          return (
            <p
              key={`${item}-${index}`}
              className={isLast ? "text-[#12dce8]" : "text-[#343d3c]"}
            >
              {item}
            </p>
          );
        })}

        {error && <p className="text-[#ffaaa4]">&gt; Hata: {error}</p>}

        {progress >= 100 && !error && (
          <p className="text-[#63ffb2]">
            &gt; Rapor dosyası oluşturuldu. Yönlendirme bekleniyor...
          </p>
        )}
      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8V12L15 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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