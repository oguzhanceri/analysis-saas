'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const navItems = [
   { title: 'Platform', href: '/' },
   { title: 'Çözümler', href: '/scanner' },
   { title: 'Kaynaklar', href: '/report' },
   { title: 'Fiyatlandırma', href: '/dashboard' },
]

export default function Header() {
   const [menuOpen, setMenuOpen] = useState(false)

   useEffect(() => {
      if (menuOpen) {
         document.body.classList.add('overflow-hidden')
      } else {
         document.body.classList.remove('overflow-hidden')
      }

      return () => {
         document.body.classList.remove('overflow-hidden')
      }
   }, [menuOpen])

   return (
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050707]/90 backdrop-blur-xl">
         <div className="mx-auto flex h-21 w-full max-w-375 items-center justify-between px-8 max-md:h-18 max-md:px-5">
            <Link href="/" className="flex items-center gap-4">
               <LogoIcon />

               <span className="text-[27px] font-bold tracking-[0.5px] text-[#d7e6e5] max-lg:text-[20px]">AetherAnalytics</span>
            </Link>

            <nav className={`header-menu ${menuOpen ? 'active max-lg:pointer-events-auto max-lg:opacity-100' : 'max-lg:pointer-events-none max-lg:opacity-0'} flex items-center gap-9 max-lg:h-[calc(100svh-84px)] max-md:h-[calc(100svh-72px)] transition-all duration-500 max-lg:absolute max-lg:left-0 max-lg:top-full max-lg:w-full max-lg:flex-col max-lg:items-start max-lg:gap-0 max-lg:bg-white`}>
               {navItems.map((item, index) => (
                  <Link key={item.title} href={item.href} onClick={() => setMenuOpen(false)} className={`relative text-[15px] font-semibold tracking-[1.2px] text-[#a7adad] transition-colors duration-300 lg:hover:text-white max-lg:block max-lg:w-full max-lg:border-b max-lg:border-black/20 max-lg:p-[10px_30px] max-lg:text-black ${index === 0 ? 'text-white max-lg:text-black' : ''}`}>
                     {item.title}

                     {index === 0 && <span className="absolute -bottom-2 left-0 h-px w-full bg-white max-lg:hidden" />}
                  </Link>
               ))}
            </nav>

            <div className="flex items-center gap-5 max-md:gap-3">
               <a href="#" className="text-[14px] font-semibold tracking-[1.1px] text-[#d9dfdf] transition-colors duration-300 hover:text-white ">
                  Giriş Yap
               </a>

               <Link href="/scanner" className="flex h-9.5 items-center gap-3 rounded-sm bg-[#dffafa] px-8 text-[14px] font-bold tracking-[1.1px] text-[#173333] transition duration-300 hover:bg-white max-xl:px-3">
                  Analiz Et
                  <ArrowIcon />
               </Link>

               <button type="button" aria-label="Mobil menüyü aç/kapat" aria-expanded={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} className={`hamburger-menu ${menuOpen ? 'active' : ''} group/mms relative z-30 hidden cursor-pointer items-center justify-center gap-2.5 max-lg:flex`}>
                  <div className="line-field flex h-5 flex-col items-end justify-between">
                     <div className={`line h-0.5 w-6.25 bg-white duration-500 max-sm:w-5 ${menuOpen ? 'translate-y-[9px] rotate-45' : ''}`} />

                     <div className={`line h-0.5 w-6.25 bg-white duration-500 max-sm:w-5 ${menuOpen ? 'translate-x-6 opacity-0' : ''}`} />

                     <div className={`line h-0.5 w-6.25 bg-white duration-500 max-sm:w-5 ${menuOpen ? '-translate-y-[9px] -rotate-45' : ''}`} />
                  </div>
               </button>
            </div>
         </div>
      </header>
   )
}

function LogoIcon() {
   return (
      <span className="flex size-5.75 items-center justify-center rounded-[3px] bg-[#dffafa] text-[#173333]">
         <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="2" y="6" width="2" height="5" rx="0.7" fill="currentColor" />
            <rect x="5.5" y="3" width="2" height="8" rx="0.7" fill="currentColor" />
            <rect x="9" y="1.5" width="2" height="9.5" rx="0.7" fill="currentColor" />
         </svg>
      </span>
   )
}

function ArrowIcon() {
   return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
         <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
   )
}
