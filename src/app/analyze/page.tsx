import Link from 'next/link'

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-[#0b0d0d] text-[#d9e5e4]">
      <div className="min-h-screen bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[18px_18px] p-1">
        <div className="mx-auto min-h-[calc(100vh-8px)] overflow-hidden rounded-[10px] border border-white/20 bg-[#101212]">
          <AnalyzeHeader />
          <TargetSection />
          <DashboardSection />
          <AnalyzeFooter />
        </div>
      </div>
    </main>
  );
}

 
function AnalyzeHeader() {
  const navItems = [
    "Sistem Komutları",
    "Zeka Merkezi",
    "Veri Hatları",
    "Terminal İşlemleri",
  ];

  return (
    <header className="relative z-20 border-b border-white/10 bg-[#111313]/90">
      <div className="mx-auto flex h-18 w-full max-w-370 items-center justify-between px-14 max-xl:px-8 max-md:h-auto max-md:flex-col max-md:items-start max-md:gap-5 max-md:px-5 max-md:py-5">
        <Link href="/" className="flex items-center gap-4">
          <LogoIcon />
          <span className="text-[26px] font-bold tracking-[-0.6px] text-[#e4f4f2]">
            AetherAnalytics
          </span>
        </Link>

        <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8 max-lg:static max-lg:translate-x-0 max-lg:translate-y-0 max-md:w-full max-md:overflow-auto">
          {navItems.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`relative shrink-0 text-[14px] font-bold tracking-[0.3px] transition-colors duration-300 ${
                index === 1 ? "text-[#e7f7f5]" : "text-[#a9b1b1] hover:text-white"
              }`}
            >
              {item}

              {index === 1 && (
                <span className="absolute -bottom-2 left-0 h-px w-full bg-[#e9ffff]" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6 max-md:w-full max-md:justify-between">
          <a
            href="#"
            className="flex items-center gap-3 text-[14px] font-bold tracking-[0.3px] text-[#d8e3e2]"
          >
            <UserIcon />
            Yönetici
          </a>

          <a
            href="#"
            className="text-[14px] font-medium tracking-[0.2px] text-[#d5dddd] transition hover:text-white"
          >
            Giriş Yap
          </a>

          <Link
            href="/scanner"
            className="flex h-8.5 items-center rounded-sm bg-[#dcfbfb] px-6 text-[13px] font-bold tracking-[0.3px] text-[#153232] transition hover:bg-white"
          >
            Analizi Başlat
          </Link>
        </div>
      </div>
    </header>
  );
}

function TargetSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-19.5 pt-23 text-center max-md:pb-12 max-md:pt-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-195 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1b3634]/35 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-205">
        <h1 className="text-[54px] font-bold leading-none tracking-[-2.5px] text-[#e2e5e5] max-md:text-[40px] max-sm:text-[34px]">
          Hedef Belirleme
        </h1>

        <p className="mx-auto mt-7 max-w-190 text-[22px] font-medium leading-[1.45] tracking-[-0.3px] text-[#bcc8c7] max-md:text-[18px]">
          Kapsamlı analiz için hedef URL&apos;yi girin. Motor; mimariyi,
          performansı ve yapısal bütünlüğü denetleyecektir.
        </p>

        <form action="/loading" method="GET" className="mx-auto mt-8 flex h-16 max-w-190 items-center rounded-[7px] border border-white/15 bg-[#262828] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] max-md:h-auto max-md:flex-col max-md:gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-4 px-4 max-md:h-13 max-md:w-full">
            <GlobeIcon />
            <input
              name="url"
              type="url"
              required
              placeholder="https://web-siteniz.com"
              className="h-full w-full bg-transparent text-[18px] font-semibold tracking-[0.8px] text-white outline-none placeholder:text-[#9aa3a3]"
            />
          </label>

          <button
            type="submit"
            className="flex h-12 min-w-47.5 items-center justify-center gap-3 rounded-[5px] bg-linear-to-r from-[#20d8e8] to-[#5b21d6] text-[13px] font-bold tracking-[0.4px] text-[#083434] transition duration-300 hover:brightness-110 max-md:w-full"
          >
            <SparkIcon />
            Analizi Başlat
          </button>
        </form>

        <p className="mt-3 text-[13px] font-bold tracking-[0.5px] text-[#526060]">
          Desteklenen Ortamlar: React, Next.js, Vue ve vanilla DOM.
        </p>
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section className="mx-auto grid w-full max-w-340 grid-cols-[1fr_430px] gap-7 px-14 pb-12 max-xl:px-8 max-lg:grid-cols-1 max-md:px-5">
      <div className="space-y-7">
        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          <StatCard icon={<SpeedIcon />} title="Ort. Puan" value="92/100" />
          <StatCard icon={<ScanIcon />} title="Toplam Tarama" value="1,04" />
          <StatCard
            icon={<BugIcon />}
            title="Kritik Uyarılar"
            value="3 Aktif"
            danger
          />
        </div>

        <RecentScans />
      </div>

      <div className="space-y-7">
        <EngineStatus />
        <DataConnections />
      </div>
    </section>
  );
}

function StatCard({
  icon,
  title,
  value,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[7px] border border-white/15 bg-[#242626] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-2 text-[14px] font-bold tracking-[0.4px] text-[#cfd8d7]">
        <span className="text-[#aeb9b8]">{icon}</span>
        {title}
      </div>

      <div
        className={`mt-2 text-[28px] font-bold leading-none tracking-[-1px] ${
          danger ? "text-[#f0aaa7]" : "text-[#e9f7f5]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function RecentScans() {
  const rows = [
    {
      url: "aether-dashboard.app",
      ux: "98",
      perf: "85",
      seo: "100",
      uxColor: "text-[#48f5a0]",
      perfColor: "text-[#22e1e8]",
      seoColor: "text-[#72ff9c]",
    },
    {
      url: "storefront-v2.dev",
      ux: "45",
      perf: "72",
      seo: "91",
      uxColor: "text-[#f1a6a2]",
      perfColor: "text-[#22e1e8]",
      seoColor: "text-[#72ff9c]",
    },
  ];

  return (
    <div className="overflow-hidden rounded-[7px] border border-white/15 bg-[#191b1b]">
      <div className="flex h-8.5 items-center justify-between border-b border-white/10 bg-[#242626] px-5">
        <h2 className="text-[14px] font-bold tracking-[0.3px] text-[#e2e8e8]">
          Son Tarama Günlükleri
        </h2>

        <a
          href="#"
          className="text-[14px] font-bold tracking-[0.2px] text-[#e7eeee]"
        >
          Tümünü Gör
        </a>
      </div>

      <div className="grid grid-cols-[1fr_90px_90px_90px_70px] border-b border-white/10 px-5 py-3 text-[13px] font-bold tracking-[0.2px] text-[#c7d0cf] max-md:hidden">
        <span>Hedef URL</span>
        <span>UX</span>
        <span>Perf</span>
        <span>SEO</span>
        <span className="text-right">İşlem</span>
      </div>

      <div>
        {rows.map((row) => (
          <div
            key={row.url}
            className="grid grid-cols-[1fr_90px_90px_90px_70px] items-center border-b border-white/5 px-5 py-4 last:border-b-0 max-md:grid-cols-1 max-md:gap-3"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-9 items-center justify-center rounded-[3px] border border-white/10 bg-[#303434] text-[#98a5a4]">
                <WindowIcon />
              </span>

              <span className="font-mono text-[17px] font-bold tracking-[0.2px] text-[#f1f4f4]">
                {row.url}
              </span>
            </div>

            <span className={`font-mono text-[16px] font-bold ${row.uxColor}`}>
              {row.ux}
            </span>

            <span className={`font-mono text-[16px] font-bold ${row.perfColor}`}>
              {row.perf}
            </span>

            <span className={`font-mono text-[16px] font-bold ${row.seoColor}`}>
              {row.seo}
            </span>

            <a
              href="#"
              className="flex justify-end text-[#c6cece] transition hover:text-white max-md:justify-start"
            >
              <ArrowRightIcon />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngineStatus() {
  return (
    <div className="rounded-[7px] border border-white/15 bg-[#202222] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[14px] font-bold tracking-[0.4px] text-[#e2e8e8]">
          <CpuIcon />
          Motor Durumu
        </h2>

        <span className="size-2.25 rounded-full bg-[#9bcfcb] shadow-[0_0_12px_rgba(155,207,203,0.9)]" />
      </div>

      <div className="bg-[#121313] px-3 py-3 font-mono text-[14px] font-bold leading-[1.8] tracking-[0.4px] text-[#7a8585]">
        <p>Sistem Beklemede. Giriş bekleniyor...</p>
        <p className="text-[#1ee0ea]">&gt; Yapay Zeka Taraması Hazırlanıyor</p>
        <p>&gt; DOM vektörleri bekleniyor</p>
        <p>_</p>
      </div>
    </div>
  );
}

function DataConnections() {
  const items = ["Search Console API", "Lighthouse API"];

  return (
    <div className="rounded-[7px] border border-white/15 bg-[#171919] p-5">
      <h2 className="mb-4 flex items-center gap-2 text-[14px] font-bold tracking-[0.4px] text-[#e2e8e8]">
        <LinkIcon />
        Veri Bağlantıları
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex h-11.75 items-center justify-between bg-[#343636] px-4"
          >
            <div className="flex items-center gap-4">
              {index === 0 ? <SearchIcon /> : <ChartIcon />}
              <span className="text-[16px] font-medium text-[#f1f4f4]">
                {item}
              </span>
            </div>

            <span className="size-2 rounded-full bg-[#5df59b]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyzeFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0c0e0e]">
      <div className="mx-auto flex w-full max-w-370 items-center justify-between px-14 py-12 max-xl:px-8 max-md:flex-col max-md:items-start max-md:gap-8 max-md:px-5">
        <div>
          <h2 className="text-[26px] font-bold tracking-[-0.8px] text-[#e5f2f1]">
            AetherAnalytics
          </h2>

          <p className="mt-5 max-w-77.5 text-[17px] font-medium leading-[1.45] text-[#b8c4c3]">
            © 2024 AetherAnalytics AI. Tüm hakları saklıdır.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-8 text-[16px] font-medium text-[#c8d2d1] max-md:gap-5">
          <a href="#" className="transition hover:text-white">
            Gizlilik Politikası
          </a>
          <a href="#" className="transition hover:text-white">
            Kullanım Koşulları
          </a>
          <a href="#" className="transition hover:text-white">
            Güvenlik
          </a>
          <a href="#" className="transition hover:text-white">
            Durum
          </a>
          <a href="#" className="transition hover:text-white">
            API Belgeleri
          </a>
        </nav>
      </div>
    </footer>
  );
}

/* Icons */

function LogoIcon() {
  return (
    <span className="flex size-6.5 items-center justify-center rounded-[3px] bg-[#ddfbfb] text-[#173333]">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="3" y="7" width="2" height="5" rx="0.7" fill="currentColor" />
        <rect x="6.5" y="4" width="2" height="8" rx="0.7" fill="currentColor" />
        <rect x="10" y="2" width="2" height="10" rx="0.7" fill="currentColor" />
      </svg>
    </span>
  );
}

function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 20C5.8 16.8 8.5 15 12 15C15.5 15 18.2 16.8 19.5 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="shrink-0 text-[#aeb9b8]"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 9H20.5M3.5 15H20.5M12 3C14.1 5.4 15.1 8.4 15.1 12C15.1 15.6 14.1 18.6 12 21M12 3C9.9 5.4 8.9 8.4 8.9 12C8.9 15.6 9.9 18.6 12 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
        d="M4 20H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4V9H9M20 20V15H15M20 9A8 8 0 0 0 6.5 4.5M4 15A8 8 0 0 0 17.5 19.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BugIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="8"
        y="7"
        width="8"
        height="12"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 7L7 5M15 7L17 5M4 13H8M16 13H20M5 19L8 17M19 19L16 17M12 7V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WindowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="14" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 9H20M8 14H16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 3V7M14 3V7M10 17V21M14 17V21M3 10H7M3 14H7M17 10H21M17 14H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 12V17A4 4 0 0 0 16 17V12M12 7V17M8 7H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="text-[#a8b5b4]" width="23" height="23" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="text-[#a8b5b4]" width="23" height="23" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 16V11M12 16V8M16 16V13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}