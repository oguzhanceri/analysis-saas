"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

const topNav = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Scanner", href: "/scanner" },
  { title: "Live Feed", href: "/loading" },
  { title: "Models", href: "/report" },
];

const sidebarLinks = [
  { title: "Neural Grid", icon: <GridIcon /> },
  { title: "Traffic Flow", icon: <FlowIcon /> },
  { title: "Optimization", icon: <SpeedIcon /> },
  { title: "Security Ops", icon: <ShieldIcon />, active: true },
  { title: "System Logs", icon: <LogsIcon /> },
];

const modules = [
  {
    title: "SEO Audits",
    text: "Metadatalar, yapısal veriler ve arama görünürlüğü.",
    icon: <SearchIcon />,
  },
  {
    title: "UX/UI Analysis",
    text: "Erişilebilirlik, etkileşim kalitesi ve mobil uyumluluk.",
    icon: <TouchIcon />,
  },
  {
    title: "Performance",
    text: "Yükleme süreleri, Core Web Vitals ve ağ istekleri.",
    icon: <BoltIcon />,
  },
];

type AnalyzeResponse = {
  jobId?: string;
  url?: string;
  status?: string;
  progress?: number;
  message?: string;
};

export default function ScannerPage() {
  return (
    <main className="min-h-screen bg-[#0b0d0d] text-[#dce9e8]">
      <div className="min-h-screen bg-[radial-gradient(circle,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[18px_18px] p-4 max-md:p-0">
        <div className="mx-auto min-h-[calc(100vh-32px)] overflow-hidden rounded-[10px] border border-white/20 bg-[#0b0d0d] max-md:min-h-screen max-md:rounded-none max-md:border-0">
          <ScannerHeader />

          <div className="grid min-h-201.25 grid-cols-[310px_1fr] max-lg:grid-cols-1">
            <ScannerSidebar />

            <div className="grid grid-cols-[1fr_520px] max-2xl:grid-cols-[1fr_440px] max-xl:grid-cols-1">
              <ScannerContent />
              <RightPanel />
            </div>
          </div>

          <ScannerFooter />
        </div>
      </div>
    </main>
  );
}

function ScannerHeader() {
  return (
    <header className="border-b border-white/10 bg-[#101111]">
      <div className="flex h-18.5 items-center justify-between px-14 max-lg:px-6 max-md:h-auto max-md:flex-col max-md:items-start max-md:gap-5 max-md:py-5">
        <Link
          href="/"
          className="text-[29px] font-bold tracking-[-1px] text-[#6ff8ff]"
        >
          AetherAnalytics
        </Link>

        <div className="flex flex-1 items-center gap-7 pl-8 max-lg:pl-0 max-md:w-full max-md:overflow-auto">
          {topNav.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`relative shrink-0 text-[18px] font-medium tracking-[-0.3px] transition ${
                item.title === "Scanner"
                  ? "text-[#72f7ff]"
                  : "text-[#b6c0bf] hover:text-white"
              }`}
            >
              {item.title}

              {item.title === "Scanner" && (
                <span className="absolute -bottom-3 left-0 h-px w-full bg-[#72f7ff]" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5 max-md:w-full max-md:justify-between">
          <div className="flex items-center gap-4 text-[#78f5ff]">
            <SlidersIcon />
            <BellIcon />
            <TerminalIcon />
          </div>

          <Link
            href="/scanner"
            className="flex h-9 items-center justify-center rounded-[3px] bg-linear-to-r from-[#21dff0] to-[#5b35db] px-6 text-[14px] font-bold tracking-[0.5px] text-white"
          >
            Execute Analysis
          </Link>

          <div className="size-10.5 rounded-full border border-[#14383c] bg-[radial-gradient(circle_at_50%_30%,#82faff_0_10%,#12343a_30%,#020707_80%)]" />
        </div>
      </div>
    </header>
  );
}

function ScannerSidebar() {
  return (
    <aside className="border-r border-white/10 bg-[#0e1010] max-lg:hidden">
      <div className="border-b border-white/10 px-8 py-7">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-[3px] border border-white/10 bg-[#061718]">
            <div className="size-8 rounded-full bg-[radial-gradient(circle,#25e4f0_0_8%,#0c5960_25%,transparent_58%)] shadow-[0_0_25px_rgba(37,228,240,0.35)]" />
          </div>

          <div>
            <h2 className="text-[18px] font-medium tracking-[-0.3px] text-[#e6f2f1]">
              AetherOS v1.0
            </h2>
            <p className="font-mono text-[13px] text-[#a2adac]">
              System Nominal
            </p>
          </div>
        </div>

        <button className="mt-6 h-9 w-full border border-white/10 bg-[#0b0d0d] font-mono text-[14px] font-bold tracking-[0.4px] text-[#72f7ff] transition hover:bg-white/4">
          New Scan
        </button>
      </div>

      <nav className="py-8">
        {sidebarLinks.map((item) => (
          <a
            key={item.title}
            href="#"
            className={`relative flex h-16.25 items-center gap-7 px-8 font-mono text-[14px] font-bold tracking-[0.6px] transition ${
              item.active
                ? "bg-[#251343] text-[#19e5ef]"
                : "text-[#b4bfbe] hover:bg-white/4 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            {item.title}

            {item.active && (
              <span className="absolute right-0 top-0 h-full w-0.75 rounded-full bg-[#62f4ff]" />
            )}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function ScannerContent() {
  return (
    <section className="relative bg-[radial-gradient(circle_at_50%_36%,rgba(32,79,76,0.20),transparent_42%)] px-4 py-16 max-xl:px-10 max-lg:px-6 max-md:px-5">
      <div className="mx-auto max-w-265">
        <h1 className="text-[60px] font-bold leading-none tracking-[-3px] text-[#e2fbfb] max-md:text-[42px]">
          Hedef Belirleme
        </h1>

        <p className="mt-5 max-w-190 text-[22px] font-medium leading-[1.45] tracking-[-0.4px] text-[#bcc7c6] max-md:text-[18px]">
          Ağ üzerinde kapsamlı analiz başlatmak için hedef URL&apos;yi girin ve
          tarama parametrelerini yapılandırın.
        </p>

        <ScanCard />
      </div>
    </section>
  );
}

function ScanCard() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok) {
        setError(data.message || "Analiz başlatılamadı.");
        return;
      }

      if (!data.jobId || !data.url) {
        setError("Analiz kimliği alınamadı.");
        return;
      }

      router.push(
        `/loading?jobId=${data.jobId}&url=${encodeURIComponent(data.url)}`
      );
    } catch {
      setError("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-14 rounded-[7px] border border-white/10 bg-[#0a0c0c]/95 p-8 shadow-[0_0_90px_rgba(19,255,255,0.06)] max-md:p-5"
    >
      <div>
        <label className="mb-3 block font-mono text-[14px] font-bold tracking-[0.8px] text-[#12dce8]">
          HEDEF URL
        </label>

        <div className="flex h-14 items-center gap-4 rounded-sm border border-white/10 bg-[#242424] px-5">
          <GlobeIcon />

          <input
            name="url"
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://"
            className="h-full w-full bg-transparent font-mono text-[18px] font-bold text-white outline-none placeholder:text-[#727987]"
          />
        </div>

        {error && (
          <p className="mt-3 font-mono text-[13px] font-bold text-[#ffaaa4]">
            {error}
          </p>
        )}
      </div>

      <div className="my-8 h-px w-full bg-white/10" />

      <h2 className="text-[23px] font-medium tracking-[-0.4px] text-[#d9e3e2]">
        Tarama Modülleri
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-5 max-2xl:grid-cols-1">
        {modules.map((item) => (
          <ModuleCard key={item.title} {...item} />
        ))}
      </div>

      <div className="my-9 h-px w-full bg-white/10" />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12.25 min-w-53.75 items-center justify-center gap-3 rounded-[5px] bg-linear-to-r from-[#16dff0] to-[#5734d9] px-7 text-[14px] font-bold tracking-[0.8px] text-white transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-60"
        >
          <PlayIcon />
          {isSubmitting ? "BAŞLATILIYOR..." : "ANALİZİ BAŞLAT"}
        </button>
      </div>
    </form>
  );
}

function ModuleCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative min-h-33 rounded-sm border border-white/10 bg-[#1d1d1d] p-5">
      <div className="flex items-start justify-between">
        <span className="text-[#18e5ef]">{icon}</span>
        <span className="size-4.5 rounded-[3px] bg-[#18dce7]" />
      </div>

      <h3 className="mt-4 font-mono text-[16px] font-bold tracking-[0.3px] text-[#dce6e5]">
        {title}
      </h3>

      <p className="mt-2 text-[14px] font-semibold leading-[1.35] text-[#9da8a7]">
        {text}
      </p>
    </div>
  );
}

function RightPanel() {
  return (
    <aside className="border-l border-white/10 bg-[#0c0e0e] px-8 py-16 max-xl:grid max-xl:grid-cols-2 max-xl:gap-6 max-xl:border-l-0 max-xl:border-t max-xl:px-6 max-md:grid-cols-1 max-md:px-5">
      <Panel title="SİSTEM DURUMU">
        <div className="mb-5 flex items-center justify-end gap-2 font-mono text-[11px] font-bold tracking-[0.5px] text-[#3df39a]">
          <span className="size-2 rounded-full bg-[#31d589]" />
          ONLINE
        </div>

        <div className="space-y-3">
          <StatusRow label="Aktif Node'lar" value="124/128" />
          <StatusRow label="Ağ Gecikmesi" value="12ms" success />
          <StatusRow label="Son Senkronizasyon" value="T-0:02s" />
        </div>
      </Panel>

      <Panel title="SON HEDEFLER" className="mt-8 max-xl:mt-0">
        <div className="space-y-6 font-mono text-[14px] font-bold text-[#c1cbca]">
          <RecentTarget text="tech-startup.io" status="success" />
          <RecentTarget text="global-finance.com" status="success" />
          <RecentTarget text="legacy-portal.net" status="warning" />
        </div>
      </Panel>
    </aside>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-white/10 bg-[#070808] p-5 ${className}`}
    >
      <h2 className="mb-5 font-mono text-[16px] font-bold tracking-[0.7px] text-[#bfc9c8]">
        {title}
      </h2>

      {children}
    </div>
  );
}

function StatusRow({
  label,
  value,
  success = false,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="flex h-10.75 items-center justify-between bg-[#242424] px-4 font-mono text-[14px] font-bold text-[#9fa9a8]">
      <span>{label}</span>
      <span className={success ? "text-[#45ee9c]" : "text-[#c1caca]"}>
        {value}
      </span>
    </div>
  );
}

function RecentTarget({
  text,
  status,
}: {
  text: string;
  status: "success" | "warning";
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <RefreshIcon />
        <span className="truncate">{text}</span>
      </div>

      {status === "success" ? (
        <span className="text-[#46f5a4]">
          <CheckCircleIcon />
        </span>
      ) : (
        <span className="text-[#f1a6a2]">
          <WarningIcon />
        </span>
      )}
    </div>
  );
}

function ScannerFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0d0f0f]">
      <div className="flex min-h-31.5 items-center justify-between px-14 max-lg:flex-col max-lg:items-start max-lg:gap-6 max-lg:px-6 max-lg:py-8 max-md:px-5">
        <p className="text-[23px] font-medium tracking-[-0.6px] text-[#e3f1f0]">
          © 2024 AetherAnalytics AIOS. All systems operational.
        </p>

        <nav className="flex flex-wrap items-center gap-7 font-mono text-[14px] font-bold tracking-[0.5px] text-[#bec8c7]">
          <a href="#" className="transition hover:text-white">
            Documentation
          </a>
          <a href="#" className="transition hover:text-white">
            Privacy Protocol
          </a>
          <a href="#" className="transition hover:text-white">
            Terms of Synthesis
          </a>
          <a href="#" className="transition hover:text-white">
            Network Status
          </a>
        </nav>
      </div>
    </footer>
  );
}

/* Icons */

function SlidersIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

function GridIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
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
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 17L9 12L13 15L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="17" r="2" fill="currentColor" />
      <circle cx="9" cy="12" r="2" fill="currentColor" />
      <circle cx="13" cy="15" r="2" fill="currentColor" />
      <circle cx="20" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
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
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L20 6V11C20 16 16.8 20 12 21C7.2 20 4 16 4 11V6L12 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LogsIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
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

function GlobeIcon() {
  return (
    <svg
      className="shrink-0 text-[#687272]"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3.5 9H20.5M3.5 15H20.5M12 3C14 5.4 15 8.4 15 12C15 15.6 14 18.6 12 21M12 3C10 5.4 9 8.4 9 12C9 15.6 10 18.6 12 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 11V5A2 2 0 0 1 13 5V13M13 13L14 10A2 2 0 0 1 18 11L16 18C15.5 20 14 21 12 21H10C8 21 6.5 20 5.5 18L3 13A1.8 1.8 0 0 1 6.2 11.5L8 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14H11L10 22L20 9H13V2Z" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 5L19 12L8 19V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="shrink-0 text-[#a4afae]"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 12A8 8 0 1 1 17.7 6.4M20 4V10H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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

function WarningIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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