import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
   return (
      <main className="min-h-screen overflow-hidden bg-[#050707] text-white">
         <Header />
         <Hero />
         <Footer />
      </main>
   )
}

function Hero() {
   return (
      <section className="relative flex min-h-185 items-start justify-center border-b border-white/10 pt-21 max-lg:min-h-190 max-md:min-h-175 max-md:pt-35">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[30px_30px] pointer-events-none" />

         <div className="absolute left-1/2 top-55 h-107.5 w-190 -translate-x-1/2 rounded-full bg-[#183f3e]/35 blur-[90px] max-md:w-[90%]" />

         <div className="relative pt-20 z-10 mx-auto flex w-full max-w-245 flex-col items-center px-5 text-center">
            <div className="mb-8 flex h-5.5 items-center gap-2 rounded-full border border-white/20 bg-white/3 px-3 text-[13px] font-bold tracking-[1px] text-[#5ce1ac]">
               <span className="h-2.25 w-2.25 rounded-full bg-[#56a485]" />
               V2.0 Yayında - Yeni AI Motoru
            </div>

            <h1 className="max-w-265 text-[58px] font-bold leading-[1.08] tracking-[-3px] text-[#d5d8d8] max-xl:text-[52px] max-lg:text-[44px] max-md:text-[34px] max-md:tracking-[-1.5px] max-sm:text-[30px]">Web sitenizi AI hassasiyetiyle analiz edin</h1>

            <p className="mt-8 max-w-205 text-[22px] font-medium leading-[1.45] tracking-[0.3px] text-[#aeb7b8] max-lg:text-[19px] max-md:mt-5 max-md:text-[16px]">Dünyanın en gelişmiş yapay zeka analiz platformu ile dönüşüm oranlarınızı artırın, performansı optimize edin ve rakiplerinizin önüne geçin. Saniyeler içinde detaylı içgörüler elde edin.</p>

            <form action="/loading" method="GET" className="mt-14 flex w-full max-w-208.75 items-center rounded-lg border border-white/15 bg-[#171f1f] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] duration-500 focus-within:border-white lg:hover:border-white max-md:h-auto max-md:flex-col max-md:gap-3 max-md:p-3">
               <label className="flex min-w-0 flex-1 items-center gap-4 px-7 max-md:w-full max-md:px-3 cursor-pointer">
                  <GlobeIcon />

                  <input name="url" type="url" required placeholder="https://siteniz.com" className="h-22 w-full cursor-pointer bg-transparent text-[19px] font-semibold tracking-[1.2px] text-white outline-none placeholder:text-[#a3aaaa] max-md:h-13.5 max-md:text-[16px]" />
               </label>

               <button type="submit" className="flex h-[stretch] min-w-63.75 cursor-pointer items-center justify-center gap-3 rounded-sm bg-[#e2fbfb] text-[15px] font-bold tracking-[1px] text-[#173333] transition duration-300 hover:bg-white max-md:h-14 max-md:w-full max-md:min-w-0 lg:hover:bg-primary">
                  Sitemi Analiz Et
                  <BoltIcon />
               </button>
            </form>
         </div>
      </section>
   )
}

function GlobeIcon() {
   return (
      <svg className="shrink-0 text-[#c4cccc]" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
         <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.8" />
         <path d="M3.6 9H20.4M3.6 15H20.4M12 3C14.1 5.3 15.1 8.3 15.1 12C15.1 15.7 14.1 18.7 12 21M12 3C9.9 5.3 8.9 8.3 8.9 12C8.9 15.7 9.9 18.7 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
   )
}

function BoltIcon() {
   return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
         <path d="M13 2L4 14H11L10 22L20 9H13L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
   )
}
