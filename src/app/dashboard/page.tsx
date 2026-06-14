import Link from 'next/link'
import type { ReactNode } from 'react'

const navItems = [
   { title: 'Platform', href: '/' },
   { title: 'Çözümler', href: '/scanner' },
   { title: 'Kaynaklar', href: '/report' },
   { title: 'Fiyatlandırma', href: '/dashboard' },
]

const sidebarItems = [
   { label: 'Genel Bakış', icon: <GridIcon />, active: true },
   { label: 'Yapay Zeka Ağı', icon: <BrainIcon /> },
   { label: 'Analitik', icon: <ChartBoxIcon /> },
   { label: 'Lojistik', icon: <TruckIcon /> },
   { label: 'Güvenlik', icon: <ShieldIcon /> },
   { label: 'Ayarlar', icon: <GearIcon /> },
]

const flowItems = [
   {
      dot: 'bg-[#ffaaa4]',
      title: '/pricing sayfasında CLS artışı',
      desc: 'Görsellerin asenkron yüklenmesi nedeniyle düzen kayması 0.4s arttı. Önerilen düzeltme mevcut.',
      meta: '12 dk önce · Yüksek Öncelikli',
   },
   {
      dot: 'bg-[#68f4ff]',
      title: 'Erişilebilirlik iyileştirmesi bulundu',
      desc: 'Hero bölümü butonunda kontrast oranı yetersiz (mevcut: 3.1:1, hedef: 4.5:1).',
      meta: '1 saat önce · Orta Öncelikli',
   },
   {
      dot: 'bg-[#a986ff]',
      title: "'OmniMetrics' özellikleri güncellendi",
      desc: 'API dokümanlarında yeni semantik analiz uç noktaları tespit edildi. Analizi inceleyin.',
      meta: '3 saat önce · İstihbarat',
   },
]

const competitors = [
   ['AetherAnalytics', '24%', 'Yüksek', '-'],
   ['DataPulse', '31%', 'Orta', '+12% Hız'],
   ['MetricMind', '18%', 'Düşük', '+8% Doğruluk'],
   ['OmniMetrics', '15%', 'Yüksek', '-4% Kapsam'],
]

const auditHistory = [
   {
      title: 'Üretim Ana Sitesi - Otomatik Denetim',
      desc: 'Skor: 94/100 · Tamamlandı',
      time: '10 dk önce',
      status: 'success',
   },
   {
      title: 'Hazırlık Ortamı - Yayım Öncesi Kontrol',
      desc: 'Skor: 72/100 · Hata: Politikalar Geçemedi',
      time: '2 sa önce',
      status: 'danger',
   },
   {
      title: 'Kullanıcı Portalı - Derin Tarama',
      desc: 'Devam Ediyor... 45%',
      time: 'Aktif',
      status: 'purple',
   },
   {
      title: 'Pazarlama Sayfası - Hızlı Tarama',
      desc: 'Skor: 89/100 · Tamamlandı',
      time: 'Dün',
      status: 'success',
   },
]

export default function DashboardPage() {
   return (
      <main className="min-h-screen bg-[#070808] text-[#dce8e7]">
         <div className="min-h-screen bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[18px_18px] p-2">
            <div className="mx-auto min-h-[calc(100vh-16px)] overflow-hidden rounded-xl border border-[#655cff] bg-[#0b0d0d]">
               <DashboardHeader />

               <div className="grid min-h-[calc(100vh-82px)] grid-cols-[255px_1fr] max-lg:grid-cols-1">
                  <Sidebar />
                  <DashboardContent />
               </div>
            </div>
         </div>
      </main>
   )
}

function DashboardHeader() {
   return (
      <header className="relative z-30 border-b border-white/10 bg-[#0e1010]">
         <div className="flex h-18 items-center justify-between px-12 max-lg:px-6 max-md:h-auto max-md:flex-col max-md:items-start max-md:gap-5 max-md:py-5">
            <Link href="/" className="flex items-center gap-3">
               <span className="text-[25px] font-bold tracking-[-0.8px] text-[#70f8ff]">AetherAnalytics</span>
            </Link>

            <nav className="absolute left-[34%] top-1/2 flex -translate-y-1/2 items-center gap-7 max-xl:left-[36%] max-lg:static max-lg:translate-y-0 max-md:w-full max-md:overflow-auto">
               {navItems.map((item) => (
                  <Link key={item.title} href={item.href} className="shrink-0 text-[14px] font-medium tracking-[0.2px] text-[#bac3c2] transition hover:text-white">
                     {item.title}
                  </Link>
               ))}
            </nav>

            <div className="flex items-center gap-5 max-md:w-full max-md:justify-between">
               <button className="text-[#d5dfde] transition hover:text-white">
                  <BellIcon />
               </button>

               <button className="text-[#d5dfde] transition hover:text-white">
                  <GearIcon />
               </button>

               <span className="h-9 w-px bg-white/10" />

               <a href="#" className="text-[14px] font-medium text-[#d8e0df] transition hover:text-white">
                  Giriş Yap
               </a>

               <Link href="/scanner" className="flex h-9.75 items-center justify-center rounded-xs bg-[#75f4ff] px-5 text-[14px] font-bold text-[#062d31] transition hover:bg-white">
                  Başlayın
               </Link>

               <div className="size-8.5 overflow-hidden rounded-full border border-[#1e4d52] bg-[#071717]">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_50%_35%,#54e9ef,transparent_22%),radial-gradient(circle_at_50%_95%,#0b272b,#010606_70%)]" />
               </div>
            </div>
         </div>
      </header>
   )
}

function Sidebar() {
   return (
      <aside className="flex min-h-full flex-col border-r border-white/10 bg-[#0d0f0f] px-5 py-7 max-lg:hidden">
         <div className="flex items-center gap-3 px-2">
            <span className="flex size-7.75 items-center justify-center rounded-[3px] border border-[#24575b] bg-[#14383b] text-[#71f7ff]">
               <HexIcon />
            </span>

            <div>
               <p className="text-[13px] font-bold tracking-[1.1px] text-[#d8e4e3]">AETHERANALYTICS</p>
               <p className="text-[11px] font-medium text-[#7d8988]">Kurumsal Paket</p>
            </div>
         </div>

         <nav className="mt-9 space-y-2">
            {sidebarItems.map((item) => (
               <a key={item.label} href="#" className={`relative flex h-9.75 items-center gap-4 px-4 text-[13px] font-bold tracking-[0.3px] transition ${item.active ? 'bg-[#222928] text-[#73f7ff]' : 'text-[#a5afae] hover:bg-white/4 hover:text-white'}`}>
                  <span>{item.icon}</span>
                  {item.label}

                  {item.active && <span className="absolute -right-1.25 top-0 h-full w-1 rounded-full bg-[#72faff]" />}
               </a>
            ))}
         </nav>

         <div className="mt-auto border-t border-white/10 pt-7">
            <div className="space-y-5">
               <a href="#" className="flex items-center gap-4 px-4 text-[13px] font-bold tracking-[0.3px] text-[#73f7ff]">
                  <UploadIcon />
                  Planı Yükselt
               </a>

               <a href="#" className="flex items-center gap-4 px-4 text-[13px] font-bold tracking-[0.3px] text-[#b7c0bf]">
                  <HelpIcon />
                  Destek
               </a>

               <a href="#" className="flex items-center gap-4 px-4 text-[13px] font-bold tracking-[0.3px] text-[#b7c0bf]">
                  <LogoutIcon />
                  Çıkış Yap
               </a>
            </div>
         </div>
      </aside>
   )
}

function DashboardContent() {
   return (
      <section className="px-12 py-12 max-xl:px-8 max-md:px-5">
         <div className="mb-8 flex items-start justify-between gap-6 max-md:flex-col">
            <div>
               <h1 className="text-[27px] font-bold tracking-[-0.8px] text-[#edf4f3]">Yönetici Özeti</h1>
               <p className="mt-2 font-mono text-[14px] font-medium tracking-[0.3px] text-[#a8b3b2]">Canlı sistem izleme ve öngörücü AI içgörüleri.</p>
            </div>

            <div className="flex items-center gap-3">
               <button className="flex h-8.75 items-center gap-3 bg-[#303333] px-4 text-[14px] font-medium text-[#e5eeee]">
                  <CalendarIcon />
                  Son 30 Gün
                  <ChevronDownIcon />
               </button>

               <button className="flex h-8.75 items-center gap-3 rounded-xs bg-[#16e5ee] px-5 text-[13px] font-bold text-[#063033]">
                  <DownloadIcon />
                  Rapor Oluştur
               </button>
            </div>
         </div>

         <div className="grid grid-cols-[1fr_280px] gap-6 max-xl:grid-cols-1">
            <div className="space-y-6">
               <StatsGrid />
               <TrendCard />
               <WebVitalsCard />

               <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
                  <CompetitorCard />
                  <AuditHistoryCard />
               </div>
            </div>

            <AiFlowCard />
         </div>
      </section>
   )
}

function StatsGrid() {
   return (
      <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
         <MetricCard title="BÜTÜNSEL SAĞLIK" value="92" suffix="" change="+2.4%" icon={<PulseIcon />} circular />

         <MetricCard title="KULLANICI DENEYİMİ PUANI" value="88" suffix="/100" change="+1.1%" icon={<TouchIcon />} bar="w-[88%] bg-[#6c28ff]" />

         <MetricCard title="SEO PUANI" value="95" suffix="/100" change="-0.5%" icon={<SearchIcon />} negative bar="w-[95%] bg-[#5ff7b6]" />

         <MetricCard title="PERFORMANS" value="81" suffix="/100" change="+5.2%" icon={<SpeedIcon />} bar="w-[81%] bg-[#76f4ff]" />
      </div>
   )
}

function MetricCard({ title, value, suffix, change, icon, bar, circular = false, negative = false }: { title: string; value: string; suffix: string; change: string; icon: ReactNode; bar?: string; circular?: boolean; negative?: boolean }) {
   return (
      <div className="relative min-h-34 rounded-sm border border-white/10 bg-[#111414] p-5">
         <div className="flex items-start justify-between">
            <h3 className="max-w-37.5 text-[12px] font-bold leading-tight tracking-[1.1px] text-[#aeb7b6]">{title}</h3>

            <span className="text-[#95a6a5]">{icon}</span>
         </div>

         {circular ? (
            <div className="mt-6 flex items-center gap-7">
               <div className="relative flex size-13.5 items-center justify-center rounded-full bg-[conic-gradient(#76f8ff_0deg_330deg,#1f2727_330deg_360deg)]">
                  <div className="absolute size-10.5 rounded-full bg-[#121515]" />
                  <span className="relative text-[15px] font-bold text-[#e7f2f1]">{value}</span>
               </div>

               <div>
                  <p className={`text-[13px] font-bold ${negative ? 'text-[#ee9d9b]' : 'text-[#57f6aa]'}`}>↑{change.replace('+', '')}</p>
                  <p className="mt-1 text-[10px] font-medium text-[#818b8a]">geçen döneme göre</p>
               </div>
            </div>
         ) : (
            <>
               <div className="mt-8 flex items-end justify-between">
                  <div>
                     <span className="text-[28px] font-bold tracking-[-0.8px] text-[#edf4f3]">{value}</span>
                     <span className="text-[14px] font-bold text-[#899392]">{suffix}</span>
                  </div>

                  <p className={`text-[12px] font-bold ${negative ? 'text-[#ee9d9b]' : 'text-[#57f6aa]'}`}>
                     {negative ? '↓' : '↑'}
                     {change.replace('+', '').replace('-', '')}
                  </p>
               </div>

               <div className="mt-5 h-1 w-full rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${bar}`} />
               </div>
            </>
         )}
      </div>
   )
}

function TrendCard() {
   return (
      <Panel className="h-77.5">
         <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[13px] font-bold tracking-[1px] text-[#c2cbca]">DENETİM PUANI TRENDLERİ</h2>

            <div className="flex items-center gap-2 text-[11px] font-bold text-[#737e7d]">
               <span className="size-2 rounded-full bg-[#77f4ff]" />
               Küresel Ortalama
            </div>
         </div>

         <div className="relative h-57.5 border-t border-white/5">
            <div className="absolute left-0 top-[25%] h-px w-full border-t border-dashed border-white/10" />
            <div className="absolute left-0 top-[50%] h-px w-full border-t border-dashed border-white/10" />
            <div className="absolute left-0 top-[75%] h-px w-full border-t border-dashed border-white/10" />

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 230" preserveAspectRatio="none">
               <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#16e5ee" stopOpacity="0.18" />
                     <stop offset="100%" stopColor="#16e5ee" stopOpacity="0" />
                  </linearGradient>
               </defs>

               <path d="M0 175 L75 148 L150 158 L225 120 L300 128 L375 82 L450 104 L525 44 L600 65" fill="none" stroke="#14e7f0" strokeWidth="2.5" />

               <path d="M0 175 L75 148 L150 158 L225 120 L300 128 L375 82 L450 104 L525 44 L600 65 L600 230 L0 230 Z" fill="url(#trendFill)" />
            </svg>
         </div>
      </Panel>
   )
}

function WebVitalsCard() {
   return (
      <Panel className="h-47.5">
         <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[13px] font-bold tracking-[1px] text-[#c2cbca]">TEMEL WEB VERİLERİ</h2>
            <span className="text-[#8a9493]">...</span>
         </div>

         <div className="h-px w-full bg-white/5" />

         <div className="grid h-30 grid-cols-3 items-end text-center font-mono text-[11px] font-bold text-[#6f7a79]">
            <span>LCP</span>
            <span>FID</span>
            <span>CLS</span>
         </div>
      </Panel>
   )
}

function AiFlowCard() {
   return (
      <Panel className="min-h-130.5">
         <div className="mb-7 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-[13px] font-bold tracking-[0.8px] text-[#d8e1e0]">
               <span className="text-[#6b28ff]">
                  <AiIcon />
               </span>
               AI ANALİZ AKIŞI
            </h2>

            <span className="rounded-xs border border-[#7d51bb] bg-[#3a2459] px-2 py-1 text-[10px] font-bold text-[#d9c7ff]">CANLI</span>
         </div>

         <div className="space-y-4">
            {flowItems.map((item) => (
               <div key={item.title} className="bg-[#1e2020] p-4">
                  <div className="mb-2 flex items-start gap-3">
                     <span className={`mt-1 size-2 shrink-0 rounded-full ${item.dot} shadow-[0_0_14px_currentColor]`} />
                     <h3 className="text-[13px] font-bold leading-[1.35] text-[#dfe8e7]">{item.title}</h3>
                  </div>

                  <p className="pl-5 text-[11px] font-medium leading-[1.45] text-[#a5afae]">{item.desc}</p>

                  <p className="mt-3 pl-5 font-mono text-[10px] font-bold text-[#737d7c]">{item.meta}</p>
               </div>
            ))}
         </div>

         <button className="mt-5 h-8.5 w-full border border-white/10 text-[12px] font-bold tracking-[0.4px] text-[#bfc9c8] transition hover:bg-white/4 hover:text-white">TÜM ANALİZLERİ GÖR</button>
      </Panel>
   )
}

function CompetitorCard() {
   return (
      <Panel className="h-75">
         <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[13px] font-bold tracking-[1px] text-[#c2cbca]">RAKİP KARŞILAŞTIRMASI</h2>

            <a href="#" className="text-[12px] font-bold tracking-[0.3px] text-[#75f8ff]">
               Detaylı Görünüm →
            </a>
         </div>

         <table className="w-full text-left font-mono text-[12px] font-bold">
            <thead className="text-[10px] text-[#596463]">
               <tr className="border-b border-white/5">
                  <th className="pb-4">VARLIK</th>
                  <th className="pb-4">PAZAR PAYI</th>
                  <th className="pb-4">ÖZELLİK HIZI</th>
                  <th className="pb-4">AVANTAJIMIZ</th>
               </tr>
            </thead>

            <tbody>
               {competitors.map((row, index) => (
                  <tr key={row[0]} className="border-b border-white/3">
                     <td className={`py-4 ${index === 0 ? 'text-[#77f8ff]' : 'text-[#8e9998]'}`}>
                        {index === 0 && <span className="mr-2 inline-block size-1.75 rounded-full bg-[#77f8ff]" />}
                        {row[0]}
                     </td>
                     <td className="py-4 text-[#a8b2b1]">{row[1]}</td>
                     <td className="py-4 text-[#8d9897]">{row[2]}</td>
                     <td className={`py-4 ${row[3].includes('-4') ? 'text-[#df8d8b]' : row[3] === '-' ? 'text-[#63f2a8]' : 'text-[#63f2a8]'}`}>{row[3]}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </Panel>
   )
}

function AuditHistoryCard() {
   return (
      <Panel className="h-75">
         <div className="mb-7 flex items-center justify-between">
            <h2 className="text-[13px] font-bold tracking-[1px] text-[#c2cbca]">SON DENETİM GEÇMİŞİ</h2>

            <span className="text-[#8c9796]">
               <RefreshIcon />
            </span>
         </div>

         <div className="space-y-6">
            {auditHistory.map((item) => (
               <div key={item.title} className="flex items-start gap-4">
                  <span className={`mt-1 flex size-3.75 shrink-0 items-center justify-center rounded-full border ${item.status === 'success' ? 'border-[#5af6ad] text-[#5af6ad]' : item.status === 'danger' ? 'border-[#ef9c99] text-[#ef9c99]' : 'border-[#b997ff] text-[#b997ff]'}`}>
                     <span className="size-1.25 rounded-full bg-current" />
                  </span>

                  <div className="min-w-0 flex-1">
                     <h3 className="truncate text-[13px] font-bold text-[#bfc9c8]">{item.title}</h3>
                     <p className="mt-1 font-mono text-[10px] font-bold text-[#76807f]">{item.desc}</p>
                  </div>

                  <span className="shrink-0 font-mono text-[10px] font-bold text-[#717b7a]">{item.time}</span>
               </div>
            ))}
         </div>
      </Panel>
   )
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
   return <div className={`rounded-sm border border-white/10 bg-[#0f1111] p-5 ${className}`}>{children}</div>
}

/* Icons */

function BellIcon() {
   return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
         <path d="M18 9A6 6 0 0 0 6 9C6 16 3 17 3 17H21S18 16 18 9Z" stroke="currentColor" strokeWidth="2" />
         <path d="M10 21H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function GearIcon() {
   return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
         <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z" stroke="currentColor" strokeWidth="2" />
         <path d="M19 13.5V10.5L16.8 10C16.6 9.4 16.4 8.9 16 8.4L17.2 6.4L15.1 4.3L13.1 5.5C12.6 5.3 12.1 5.1 11.5 5L11 3H8L7.5 5.2C6.9 5.4 6.4 5.6 5.9 6L3.9 4.8L1.8 6.9L3 8.9C2.8 9.4 2.6 9.9 2.5 10.5L0.5 11V14L2.7 14.5C2.9 15.1 3.1 15.6 3.5 16.1L2.3 18.1L4.4 20.2L6.4 19C6.9 19.2 7.4 19.4 8 19.5L8.5 21.5H11.5L12 19.3C12.6 19.1 13.1 18.9 13.6 18.5L15.6 19.7L17.7 17.6L16.5 15.6C16.7 15.1 16.9 14.6 17 14L19 13.5Z" stroke="currentColor" strokeWidth="1.4" transform="translate(2.25 0)" />
      </svg>
   )
}

function HexIcon() {
   return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
         <path d="M8 3H16L21 12L16 21H8L3 12L8 3Z" stroke="currentColor" strokeWidth="2" />
      </svg>
   )
}

function GridIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="2" />
         <rect x="14" y="4" width="6" height="6" stroke="currentColor" strokeWidth="2" />
         <rect x="4" y="14" width="6" height="6" stroke="currentColor" strokeWidth="2" />
         <rect x="14" y="14" width="6" height="6" stroke="currentColor" strokeWidth="2" />
      </svg>
   )
}

function BrainIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <path d="M9 4C6.8 4 5 5.8 5 8C3.8 8.7 3 10 3 11.5C3 13 3.8 14.3 5 15C5 17.2 6.8 19 9 19M15 4C17.2 4 19 5.8 19 8C20.2 8.7 21 10 21 11.5C21 13 20.2 14.3 19 15C19 17.2 17.2 19 15 19M9 4V19M15 4V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function ChartBoxIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" />
         <path d="M8 16V12M12 16V8M16 16V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function TruckIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <path d="M3 7H15V17H3V7ZM15 10H19L21 13V17H15V10Z" stroke="currentColor" strokeWidth="2" />
         <circle cx="7" cy="18" r="1.5" fill="currentColor" />
         <circle cx="18" cy="18" r="1.5" fill="currentColor" />
      </svg>
   )
}

function ShieldIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <path d="M12 3L20 6V11C20 16 16.8 20 12 21C7.2 20 4 16 4 11V6L12 3Z" stroke="currentColor" strokeWidth="2" />
      </svg>
   )
}

function UploadIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <path d="M12 19V5M12 5L7 10M12 5L17 10M5 21H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function HelpIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
         <path d="M9.8 9A2.3 2.3 0 0 1 12 7.5C13.4 7.5 14.5 8.4 14.5 9.8C14.5 11.6 12 11.8 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
         <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
   )
}

function LogoutIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <path d="M10 5H5V19H10M14 8L18 12L14 16M18 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function CalendarIcon() {
   return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
         <rect x="4" y="5" width="16" height="15" stroke="currentColor" strokeWidth="2" />
         <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="2" />
      </svg>
   )
}

function ChevronDownIcon() {
   return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
         <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function DownloadIcon() {
   return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
         <path d="M12 4V15M12 15L8 11M12 15L16 11M5 20H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function PulseIcon() {
   return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
         <path d="M3 12H8L10 6L14 18L16 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function TouchIcon() {
   return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
         <path d="M9 11V5A2 2 0 0 1 13 5V13M13 13L14 10A2 2 0 0 1 18 11L16 18C15.5 20 14 21 12 21H10C8 21 6.5 20 5.5 18L3 13A1.8 1.8 0 0 1 6.2 11.5L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function SearchIcon() {
   return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
         <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
         <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function SpeedIcon() {
   return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
         <path d="M5 16A7 7 0 0 1 19 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
         <path d="M12 16L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}

function AiIcon() {
   return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
         <path d="M12 3L19 7V17L12 21L5 17V7L12 3Z" fill="currentColor" opacity="0.85" />
      </svg>
   )
}

function RefreshIcon() {
   return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
         <path d="M20 12A8 8 0 1 1 17.7 6.4M20 4V10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
   )
}
