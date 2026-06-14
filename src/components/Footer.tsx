import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-[#050707]">
      <div className="mx-auto grid w-full max-w-375 grid-cols-[1.2fr_1fr_1fr_1fr] gap-20 px-8 py-14.5 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-10 max-md:px-5 max-md:py-10">
        <div>
          <Link href="/" className="flex items-center gap-4">
            <LogoIcon />
            <span className="text-[26px] font-bold tracking-[0.4px] text-[#d7e6e5]">
              AetherAnalytics
            </span>
          </Link>

          <p className="mt-7 max-w-67.5 text-[17px] font-medium leading-[1.45] tracking-[0.4px] text-[#b4bbbb]">
            Yeni nesil AI odaklı web analiz platformu.
          </p>

          <p className="mt-8 max-w-75 text-[17px] font-medium leading-[1.45] tracking-[0.4px] text-[#b4bbbb]">
            © 2024 AetherAnalytics AI. Tüm hakları saklıdır.
          </p>
        </div>

        <FooterColumn
          title="Ürün"
          links={["Özellikler", "Fiyatlandırma", "Değişim Günlüğü"]}
        />

        <FooterColumn
          title="Kaynaklar"
          links={["API Dokümanları", "Rehberler", "Blog"]}
        />

        <FooterColumn
          title="Yasal"
          links={[
            "Gizlilik Politikası",
            "Kullanım Koşulları",
            "Güvenlik",
            "Durum",
          ]}
        />
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <h3 className="mb-6 text-[14px] font-bold tracking-[1.3px] text-white">
        {title}
      </h3>

      <ul className="space-y-5">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-[18px] font-medium tracking-[0.3px] text-[#aeb6b6] transition-colors duration-300 hover:text-white"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
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
  );
}