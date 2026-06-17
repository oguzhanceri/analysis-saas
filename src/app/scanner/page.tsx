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
  { title: "Command Center", href: "/dashboard", icon: <GridIcon /> },
  { title: "URL Scanner", href: "/scanner", icon: <SearchIcon />, active: true },
  { title: "Analysis Jobs", href: "/loading", icon: <FlowIcon /> },
  { title: "Optimization Rules", href: "/report", icon: <SpeedIcon /> },
  { title: "History Logs", href: "/history", icon: <LogsIcon /> },
];

const modules = [
  {
    title: "SEO Audits",
    text: "Meta açıklama, başlık yapısı, indexlenebilirlik ve arama görünürlüğü.",
    icon: <SearchIcon />,
    tag: "Search",
  },
  {
    title: "UX/UI Analysis",
    text: "Mobil deneyim, erişilebilirlik, dokunma alanları ve okunabilirlik.",
    icon: <TouchIcon />,
    tag: "Experience",
  },
  {
    title: "Performance",
    text: "Core Web Vitals, yükleme süreleri, görsel optimizasyonu ve ağ istekleri.",
    icon: <BoltIcon />,
    tag: "Speed",
  },
];

const scanModes = [
  {
    id: "standard",
    title: "Standard Scan",
    desc: "Genel sağlık, SEO ve performans kontrolü.",
  },
  {
    id: "deep",
    title: "Deep Analysis",
    desc: "Daha detaylı teknik bulgu ve öneri üretimi.",
  },
  {
    id: "launch",
    title: "Launch Check",
    desc: "Yayına çıkmadan önce kritik kontroller.",
  },
];

const quickTargets = [
  "https://example.com",
  "https://nextjs.org",
  "https://web.dev",
];

const insightCards = [
  {
    title: "Analiz Kapsamı",
    value: "5 Modül",
    text: "SEO, performans, erişilebilirlik, UX ve güvenlik sinyalleri.",
  },
  {
    title: "Veri Kaynağı",
    value: "PageSpeed",
    text: "Gerçek Lighthouse/PageSpeed metrikleri üzerinden raporlama.",
  },
  {
    title: "Çıktı",
    value: "Rule-based",
    text: "OpenAI kullanmadan, dinamik kural tabanlı çözüm önerileri.",
  },
];

const launchChecklist = [
  "URL doğrulama",
  "PageSpeed metrikleri",
  "Core Web Vitals",
  "SEO bulguları",
  "Rule-based öneriler",
];

const recentTargets = [
  { text: "example.com", status: "success" as const },
  { text: "nextjs.org", status: "success" as const },
  { text: "legacy-portal.net", status: "warning" as const },
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
    <main className="min-h-screen bg-[#050707] text-[#dce9e8]">
      <div className="min-h-screen bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[18px_18px] p-4 max-md:p-0">
        <div className="mx-auto min-h-[calc(100vh-32px)] overflow-hidden rounded-[18px] border border-white/15 bg-[#070909] shadow-[0_24px_100px_rgba(0,0,0,0.55)] max-md:min-h-screen max-md:rounded-none max-md:border-0">
          <ScannerHeader />

          <div className="grid min-h-201.25 grid-cols-[300px_1fr] max-lg:grid-cols-1">
            <ScannerSidebar />

            <div className="grid grid-cols-[1fr_430px] max-2xl:grid-cols-[1fr_390px] max-xl:grid-cols-1">
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
    <header className="border-b border-white/10 bg-[#0b0d0d]/95 backdrop-blur-xl">
      <div className="flex min-h-18.5 items-center justify-between gap-8 px-10 max-lg:px-6 max-md:flex-col max-md:items-start max-md:gap-5 max-md:py-5">
        <Link
          href="/"
          className="group flex items-center gap-3 text-[24px] font-bold tracking-[-0.9px] text-[#eaffff]"
        >
          <span className="relative flex size-9 items-center justify-center rounded-lg border border-[#6ff8ff]/25 bg-[#061718]">
            <span className="absolute size-5 rounded-full bg-[#6ff8ff]/15 blur-md" />
            <span className="relative size-2.5 rounded-full bg-[#6ff8ff] shadow-[0_0_18px_rgba(111,248,255,0.75)]" />
          </span>
          AetherAnalytics
        </Link>

        <nav className="flex flex-1 items-center gap-6 max-md:w-full max-md:overflow-auto">
          {topNav.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`relative shrink-0 text-[15px] font-semibold tracking-[-0.2px] transition ${
                item.title === "Scanner"
                  ? "text-[#72f7ff]"
                  : "text-[#aebdbc] hover:text-white"
              }`}
            >
              {item.title}

              {item.title === "Scanner" && (
                <span className="absolute -bottom-7 left-0 h-px w-full bg-[#72f7ff] shadow-[0_0_12px_rgba(114,247,255,0.8)] max-md:-bottom-2" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 max-md:w-full max-md:justify-between">
          <div className="flex items-center gap-3 text-[#78f5ff] max-sm:hidden">
            <IconButton>
              <SlidersIcon />
            </IconButton>
            <IconButton>
              <BellIcon />
            </IconButton>
            <IconButton>
              <TerminalIcon />
            </IconButton>
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

function IconButton({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/3 text-[#7ff7ff] transition hover:bg-white/[0.07]">
      {children}
    </span>
  );
}

function ScannerSidebar() {
  return (
    <aside className="border-r border-white/10 bg-[#090b0b] max-lg:hidden">
      <div className="border-b border-white/10 px-7 py-7">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-md border border-white/10 bg-[#061718]">
            <div className="size-8 rounded-full bg-[radial-gradient(circle,#25e4f0_0_8%,#0c5960_25%,transparent_58%)] shadow-[0_0_25px_rgba(37,228,240,0.35)]" />
          </div>

          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.3px] text-[#e6f2f1]">
              Scanner Core
            </h2>
            <p className="font-mono text-[12px] text-[#93a09f]">
              System ready
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
        {sidebarLinks.map((item) => (
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

      <div className="mx-7 mt-3 rounded-xl border border-white/10 bg-white/3 p-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[1px] text-[#72f7ff]">
          Pipeline
        </p>
        <p className="mt-3 text-[14px] font-medium leading-[1.45] text-[#aeb9b8]">
          Analizler gerçek PageSpeed verisiyle başlar, ardından kural tabanlı
          öneri motoru raporu zenginleştirir.
        </p>
      </div>
    </aside>
  );
}

function ScannerContent() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(25,229,239,0.16),transparent_34%),radial-gradient(circle_at_10%_70%,rgba(87,52,217,0.18),transparent_32%)] px-10 py-14 max-lg:px-6 max-md:px-5 max-md:py-9">
      <div className="pointer-events-none absolute -right-30 -top-30 size-90 rounded-full border border-[#72f7ff]/10 bg-[#72f7ff]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-45 -left-45 size-105 rounded-full bg-[#5734d9]/10 blur-3xl" />

      <div className="relative mx-auto max-w-260">
        <div className="inline-flex items-center gap-3 rounded-full border border-[#72f7ff]/20 bg-[#72f7ff]/5 px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.8px] text-[#72f7ff]">
          <span className="size-2 rounded-full bg-[#42f59d] shadow-[0_0_14px_rgba(66,245,157,0.85)]" />
          Scanner ready
        </div>

        <div className="mt-7 grid grid-cols-[1fr_220px] gap-8 max-xl:grid-cols-1">
          <div>
            <h1 className="max-w-205 text-[64px] font-bold leading-[0.95] tracking-[-4px] text-[#eaffff] max-md:text-[42px] max-md:tracking-[-2px]">
              Web siteni gerçek verilerle analiz et.
            </h1>

            <p className="mt-6 max-w-190 text-[21px] font-medium leading-normal tracking-[-0.5px] text-[#b8c8c7] max-md:text-[17px]">
              Hedef URL&apos;yi gir, PageSpeed verileriyle performans, SEO,
              erişilebilirlik ve kullanıcı deneyimi raporunu birkaç adımda
              oluştur.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#070909]/70 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] max-xl:max-w-90">
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.8px] text-[#8dfaff]">
              Report Engine
            </p>
            <div className="mt-5 space-y-3">
              <MetricMini label="API" value="Online" success />
              <MetricMini label="Database" value="SQLite" />
              <MetricMini label="Rules" value="Active" success />
            </div>
          </div>
        </div>

        <div className="mt-9 grid grid-cols-3 gap-4 max-lg:grid-cols-1">
          {insightCards.map((item) => (
            <InsightCard key={item.title} {...item} />
          ))}
        </div>

        <ScanCard />

        <div className="mt-8 grid grid-cols-5 overflow-hidden rounded-2xl border border-white/10 bg-[#070909]/80 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {launchChecklist.map((item, index) => (
            <div
              key={item}
              className="flex min-h-20 items-center gap-3 border-r border-white/10 px-5 last:border-r-0 max-lg:border-b max-sm:border-r-0"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#72f7ff]/10 font-mono text-[11px] font-bold text-[#72f7ff]">
                {index + 1}
              </span>
              <span className="text-[14px] font-semibold text-[#c9d7d6]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScanCard() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [selectedMode, setSelectedMode] = useState(scanModes[0].id);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedUrl = normalizeTargetUrl(url);

    if (!normalizedUrl) {
      setError("Lütfen geçerli bir URL gir. Örnek: https://example.com");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: normalizedUrl,
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
      className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#080a0a]/95 shadow-[0_0_90px_rgba(19,255,255,0.06)]"
    >
      <div className="border-b border-white/10 bg-white/3 px-7 py-5 max-md:px-5">
        <div className="flex items-center justify-between gap-5 max-md:flex-col max-md:items-start">
          <div>
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.9px] text-[#72f7ff]">
              New target
            </p>
            <h2 className="mt-1 text-[25px] font-semibold tracking-[-0.7px] text-[#edfefe]">
              Yeni analiz başlat
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#42f59d]/20 bg-[#42f59d]/8 px-4 py-2 font-mono text-[12px] font-bold text-[#42f59d]">
            <span className="size-2 rounded-full bg-[#42f59d]" />
            Ready to scan
          </div>
        </div>
      </div>

      <div className="p-7 max-md:p-5">
        <div>
          <label className="mb-3 block font-mono text-[13px] font-bold uppercase tracking-[0.8px] text-[#12dce8]">
            Hedef URL
          </label>

          <div className="group flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 bg-[#121515] px-5 transition focus-within:border-[#72f7ff]/55 focus-within:shadow-[0_0_30px_rgba(114,247,255,0.12)]">
            <GlobeIcon />

            <input
              name="url"
              type="text"
              inputMode="url"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className="h-16 w-full bg-transparent font-mono text-[18px] font-bold text-white outline-none placeholder:text-[#687272] max-md:text-[15px]"
            />

            <span className="hidden shrink-0 rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.5px] text-[#778281] sm:block">
              URL
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {quickTargets.map((target) => (
              <button
                key={target}
                type="button"
                onClick={() => {
                  setUrl(target);
                  setError("");
                }}
                className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 font-mono text-[11px] font-bold text-[#9faaaa] transition hover:border-[#72f7ff]/30 hover:text-[#72f7ff]"
              >
                {target.replace("https://", "")}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-[#ffaaa4]/20 bg-[#ffaaa4]/8 px-4 py-3 font-mono text-[13px] font-bold text-[#ffaaa4]">
              {error}
            </p>
          )}
        </div>

        <div className="my-8 h-px w-full bg-white/10" />

        <div className="grid grid-cols-[260px_1fr] gap-7 max-xl:grid-cols-1">
          <div>
            <h3 className="text-[22px] font-semibold tracking-[-0.5px] text-[#d9e3e2]">
              Tarama modu
            </h3>
            <p className="mt-2 text-[15px] font-medium leading-normal text-[#9da8a7]">
              Şimdilik backend&apos;e ekstra parametre göndermiyoruz. Bu seçim
              arayüz tarafında analiz deneyimini hazırlar.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-2xl:grid-cols-1">
            {scanModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedMode === mode.id
                    ? "border-[#72f7ff]/45 bg-[#72f7ff]/10 shadow-[0_0_28px_rgba(114,247,255,0.08)]"
                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <span
                  className={`mb-4 block size-4 rounded-full border ${
                    selectedMode === mode.id
                      ? "border-[#72f7ff] bg-[#72f7ff]"
                      : "border-white/20"
                  }`}
                />
                <span className="block font-mono text-[14px] font-bold text-[#edfefe]">
                  {mode.title}
                </span>
                <span className="mt-2 block text-[13px] font-medium leading-[1.4] text-[#9da8a7]">
                  {mode.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="my-8 h-px w-full bg-white/10" />

        <div className="flex items-end justify-between gap-6 max-lg:flex-col max-lg:items-start">
          <div>
            <h3 className="text-[22px] font-semibold tracking-[-0.5px] text-[#d9e3e2]">
              Aktif modüller
            </h3>
            <p className="mt-2 max-w-140 text-[15px] font-medium leading-normal text-[#9da8a7]">
              Analiz tamamlandığında rapor ekranında skorlar, bulgular, Core Web
              Vitals ve dinamik çözüm önerileri görüntülenir.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-13 min-w-55 items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#16dff0] to-[#5734d9] px-7 text-[13px] font-bold uppercase tracking-[0.8px] text-white shadow-[0_16px_40px_rgba(33,223,240,0.18)] transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? <SpinnerIcon /> : <PlayIcon />}
            {isSubmitting ? "Başlatılıyor..." : "Analizi Başlat"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-5 max-2xl:grid-cols-1">
          {modules.map((item) => (
            <ModuleCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </form>
  );
}

function normalizeTargetUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  const candidate = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const parsedUrl = new URL(candidate);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) return "";
    if (!parsedUrl.hostname.includes(".")) return "";

    return parsedUrl.toString();
  } catch {
    return "";
  }
}

function ModuleCard({
  icon,
  title,
  text,
  tag,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tag: string;
}) {
  return (
    <div className="group relative min-h-37.5 overflow-hidden rounded-2xl border border-white/10 bg-[#121515] p-5 transition hover:-translate-y-1 hover:border-[#72f7ff]/25 hover:bg-[#151919]">
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[#72f7ff]/5 blur-2xl transition group-hover:bg-[#72f7ff]/10" />

      <div className="relative flex items-start justify-between gap-5">
        <span className="flex size-11 items-center justify-center rounded-xl border border-[#18e5ef]/20 bg-[#18e5ef]/8 text-[#18e5ef]">
          {icon}
        </span>

        <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.7px] text-[#9da8a7]">
          {tag}
        </span>
      </div>

      <h3 className="relative mt-5 font-mono text-[16px] font-bold tracking-[0.2px] text-[#dce6e5]">
        {title}
      </h3>

      <p className="relative mt-2 text-[14px] font-semibold leading-[1.45] text-[#9da8a7]">
        {text}
      </p>
    </div>
  );
}

function RightPanel() {
  return (
    <aside className="border-l border-white/10 bg-[#080a0a] px-7 py-14 max-xl:grid max-xl:grid-cols-2 max-xl:gap-6 max-xl:border-l-0 max-xl:border-t max-xl:px-6 max-md:grid-cols-1 max-md:px-5 max-md:py-8">
      <Panel title="SİSTEM DURUMU">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[24px] font-bold tracking-[-0.8px] text-[#edfefe]">
              Online
            </p>
            <p className="mt-1 font-mono text-[12px] text-[#8d9897]">
              API pipeline active
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#3df39a]/20 bg-[#3df39a]/8 px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.5px] text-[#3df39a]">
            <span className="size-2 rounded-full bg-[#31d589]" />
            LIVE
          </div>
        </div>

        <div className="space-y-3">
          <StatusRow label="PageSpeed API" value="Ready" success />
          <StatusRow label="Report DB" value="SQLite" />
          <StatusRow label="Rule Engine" value="Active" success />
        </div>
      </Panel>

      <Panel title="SON HEDEFLER" className="mt-8 max-xl:mt-0">
        <div className="space-y-5 font-mono text-[13px] font-bold text-[#c1cbca]">
          {recentTargets.map((item) => (
            <RecentTarget key={item.text} {...item} />
          ))}
        </div>
      </Panel>

      <Panel title="ANALİZ AKIŞI" className="mt-8 max-xl:col-span-2 max-md:col-span-1">
        <div className="space-y-4">
          <TimelineItem title="URL alındı" text="Hedef adres normalize edilir." />
          <TimelineItem title="Veri çekilir" text="PageSpeed API üzerinden metrikler alınır." />
          <TimelineItem title="Rapor üretilir" text="Bulgular ve öneriler dashboard'a kaydedilir." />
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
      className={`rounded-2xl border border-white/10 bg-[#070808] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] ${className}`}
    >
      <h2 className="mb-5 font-mono text-[14px] font-bold uppercase tracking-[0.8px] text-[#bfc9c8]">
        {title}
      </h2>

      {children}
    </div>
  );
}

function InsightCard({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#070909]/70 p-5">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.8px] text-[#8dfaff]">
        {title}
      </p>
      <p className="mt-3 text-[28px] font-bold tracking-[-1px] text-[#edfefe]">
        {value}
      </p>
      <p className="mt-2 text-[14px] font-medium leading-[1.45] text-[#9ca8a7]">
        {text}
      </p>
    </div>
  );
}

function MetricMini({
  label,
  value,
  success = false,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-4 py-3 font-mono text-[12px] font-bold">
      <span className="text-[#8f9b9a]">{label}</span>
      <span className={success ? "text-[#42f59d]" : "text-[#dce9e8]"}>
        {value}
      </span>
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
    <div className="flex min-h-11 items-center justify-between rounded-xl bg-[#121515] px-4 font-mono text-[13px] font-bold text-[#9fa9a8]">
      <span>{label}</span>
      <span className={success ? "text-[#45ee9c]" : "text-[#c1caca]"}>
        {value}
      </span>
    </div>
  );
}

function TimelineItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative pl-8">
      <span className="absolute left-0 top-1 flex size-4 items-center justify-center rounded-full border border-[#72f7ff]/40">
        <span className="size-1.5 rounded-full bg-[#72f7ff]" />
      </span>
      <h3 className="font-mono text-[13px] font-bold text-[#e8f5f4]">
        {title}
      </h3>
      <p className="mt-1 text-[13px] font-medium leading-[1.45] text-[#8f9b9a]">
        {text}
      </p>
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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
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
    <footer className="border-t border-white/10 bg-[#090b0b]">
      <div className="flex min-h-26.5 items-center justify-between gap-6 px-10 max-lg:flex-col max-lg:items-start max-lg:px-6 max-lg:py-8 max-md:px-5">
        <p className="text-[18px] font-medium tracking-[-0.4px] text-[#d6e5e4]">
          © 2026 AetherAnalytics. Web intelligence system operational.
        </p>

        <nav className="flex flex-wrap items-center gap-6 font-mono text-[13px] font-bold tracking-[0.4px] text-[#aeb9b8]">
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
          <Link href="/history" className="transition hover:text-white">
            History
          </Link>
          <Link href="/scanner" className="transition hover:text-white">
            New Scan
          </Link>
          <Link href="/report" className="transition hover:text-white">
            Latest Report
          </Link>
        </nav>
      </div>
    </footer>
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

function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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

function LogsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
      className="shrink-0 text-[#687272] transition group-focus-within:text-[#72f7ff]"
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
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