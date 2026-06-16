export type FindingLike =
  | string
  | {
      id?: string | null;
      key?: string | null;
      auditId?: string | null;
      title?: string | null;
      message?: string | null;
      description?: string | null;
      category?: string | null;
    };

export type ReportRecommendation = {
  id: string;
  title: string;
  category: "SEO" | "Performance" | "Accessibility" | "UX" | "Security";
  priority: "high" | "medium" | "low";
  description: string;
  actions: string[];
  matchedFindings: string[];
};

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

function normalizeFinding(finding: FindingLike) {
  if (typeof finding === "string") {
    return {
      title: finding,
      text: finding.toLowerCase(),
    };
  }

  const parts = [
    finding.id,
    finding.key,
    finding.auditId,
    finding.title,
    finding.message,
    finding.description,
    finding.category,
  ].filter(Boolean);

  return {
    title:
      finding.title ||
      finding.message ||
      finding.id ||
      finding.key ||
      "Bulgular",
    text: parts.join(" ").toLowerCase(),
  };
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function getReportRecommendations(
  findings: FindingLike[] = [],
): ReportRecommendation[] {
  const normalizedFindings = findings.map(normalizeFinding);

  const recommendations: ReportRecommendation[] = [];

  const addRecommendation = (
    recommendation: Omit<ReportRecommendation, "matchedFindings">,
    keywords: string[],
  ) => {
    const matchedFindings = normalizedFindings
      .filter((finding) => includesAny(finding.text, keywords))
      .map((finding) => finding.title);

    if (!matchedFindings.length) return;

    recommendations.push({
      ...recommendation,
      matchedFindings,
    });
  };

  addRecommendation(
    {
      id: "seo-meta-description",
      title: "SEO meta açıklaması ekle",
      category: "SEO",
      priority: "high",
      description:
        "Sayfada meta açıklama bulunmadığı için arama motorları ve sosyal paylaşım önizlemeleri sayfayı yeterince iyi özetleyemeyebilir.",
      actions: [
        "Her önemli sayfa için benzersiz bir meta description ekle.",
        "Açıklamayı 140-160 karakter aralığında, sayfa içeriğini özetleyecek şekilde yaz.",
        "Next.js metadata yapısında description alanını kullan.",
      ],
    },
    [
      "meta-description",
      "meta description",
      "meta tanım",
      "meta açıklama",
      "document meta",
      "doküman meta",
    ],
  );

  addRecommendation(
    {
      id: "unused-javascript",
      title: "Kullanılmayan JavaScript miktarını azalt",
      category: "Performance",
      priority: "high",
      description:
        "Sayfada kullanılmayan JavaScript yüklenmesi ilk açılış süresini ve ana thread üzerindeki yükü artırabilir.",
      actions: [
        "Ağır componentleri ihtiyaç anında yüklemek için dynamic import kullan.",
        "Sayfa bazlı code splitting yapısını kontrol et.",
        "Kullanılmayan paketleri kaldır veya daha hafif alternatiflerle değiştir.",
        "Client component kullanımını gerçekten gerekli alanlarla sınırla.",
      ],
    },
    [
      "unused-javascript",
      "unused javascript",
      "reduce unused javascript",
      "kullanılmayan javascript",
      "kullanılmayan javascript'i azalt",
      "javascript'i azalt",
    ],
  );

  addRecommendation(
    {
      id: "unused-css",
      title: "Kullanılmayan CSS kurallarını temizle",
      category: "Performance",
      priority: "high",
      description:
        "Kullanılmayan CSS kuralları dosya boyutunu artırır ve sayfanın ilk ekranda daha geç render edilmesine neden olabilir.",
      actions: [
        "Tailwind content path ayarlarının doğru olduğundan emin ol.",
        "Kullanılmayan global CSS ve component stillerini kaldır.",
        "Sayfa bazlı CSS yükleme yaklaşımını güçlendir.",
        "Üçüncü parti kütüphanelerin tüm CSS dosyalarını yüklemek yerine sadece gerekli stilleri dahil et.",
      ],
    },
    [
      "unused-css",
      "unused css",
      "unused-css-rules",
      "reduce unused css",
      "kullanılmayan css",
      "kullanılmayan css'i azalt",
      "css'i azalt",
    ],
  );

  addRecommendation(
    {
      id: "total-byte-weight",
      title: "Sayfa ağırlığını ve ağ yüklerini azalt",
      category: "Performance",
      priority: "medium",
      description:
        "Büyük ağ yükleri özellikle mobil kullanıcılar için yükleme süresini artırır ve veri tüketimini yükseltir.",
      actions: [
        "Büyük görselleri sıkıştır ve modern formatlara dönüştür.",
        "Gereksiz JavaScript ve CSS dosyalarını kaldır.",
        "Font dosyalarını sınırlı ağırlıklarla yükle.",
        "Üçüncü parti scriptleri azalt veya gecikmeli yükle.",
      ],
    },
    [
      "total-byte-weight",
      "large network payloads",
      "avoid enormous network payloads",
      "çok büyük ağ yük",
      "büyük ağ yük",
      "yük boyutları",
      "network payload",
    ],
  );

  addRecommendation(
    {
      id: "largest-contentful-paint",
      title: "Largest Contentful Paint süresini iyileştir",
      category: "Performance",
      priority: "high",
      description:
        "LCP değeri, kullanıcının sayfadaki en büyük içerik öğesini ne kadar sürede gördüğünü gösterir. Bu değer yüksekse sayfa yavaş algılanır.",
      actions: [
        "İlk ekrandaki en büyük görseli veya metin bloğunu tespit et.",
        "Hero görseli varsa WebP/AVIF formatına dönüştür ve doğru boyutlandır.",
        "İlk ekranda kullanılan görseller için gereksiz lazy loading kullanma.",
        "Kritik CSS dışındaki stilleri geciktir.",
        "İlk ekranda gereksiz JavaScript çalıştırmaktan kaçın.",
        "Font yüklemesini next/font veya font-display: swap ile optimize et.",
      ],
    },
    [
      "largest-contentful-paint",
      "largest contentful paint",
      "lcp",
      "en büyük zengin içerikli boyama",
    ],
  );

  addRecommendation(
    {
      id: "render-blocking-resources",
      title: "Render-blocking kaynakları optimize et",
      category: "Performance",
      priority: "high",
      description:
        "Render-blocking CSS veya JavaScript dosyaları sayfanın ilk görünür hale gelmesini geciktirebilir.",
      actions: [
        "Kritik CSS dışındaki stilleri mümkün olduğunca parçala.",
        "Üçüncü parti scriptleri defer veya lazy stratejisiyle yükle.",
        "Font yüklemelerinde next/font kullanarak layout shift ve blocking etkisini azalt.",
        "İlk ekranda gerekli olmayan kaynakları sonraki aşamada yükle.",
      ],
    },
    [
      "render-blocking-resources",
      "render blocking",
      "eliminate render-blocking",
      "kritik css",
      "blocking resources",
    ],
  );

  addRecommendation(
    {
      id: "third-party-scripts",
      title: "Üçüncü parti script yükünü azalt",
      category: "Performance",
      priority: "high",
      description:
        "Üçüncü parti scriptler ana thread üzerinde ekstra yük oluşturabilir ve sayfanın etkileşime hazır hale gelmesini geciktirebilir.",
      actions: [
        "Google Analytics, chat widget, pixel ve benzeri scriptleri gerçekten gerekli sayfalarda yükle.",
        "Üçüncü parti scriptlerde lazy loading veya defer stratejisi kullan.",
        "Kritik olmayan scriptleri kullanıcı etkileşiminden sonra başlat.",
        "Next.js Script componentinde strategy değerini afterInteractive veya lazyOnload olarak düzenle.",
      ],
    },
    [
      "third-party-summary",
      "third-party-facades",
      "third party",
      "3rd party",
      "üçüncü parti",
      "third-party code",
    ],
  );

  addRecommendation(
    {
      id: "main-thread-work",
      title: "Ana thread üzerindeki işlem yükünü azalt",
      category: "Performance",
      priority: "high",
      description:
        "Ana thread üzerinde fazla JavaScript çalışması, kullanıcı etkileşimlerini geciktirebilir ve Total Blocking Time değerini yükseltebilir.",
      actions: [
        "Ağır hesaplama yapan işlemleri component render akışından çıkar.",
        "Client component sayısını azalt ve mümkün olan alanları server component olarak bırak.",
        "Büyük veri işleme işlemlerini parçalara böl veya gerektiğinde Web Worker kullan.",
        "Gereksiz re-render oluşturan state ve effect yapılarını sadeleştir.",
      ],
    },
    [
      "mainthread-work-breakdown",
      "bootup-time",
      "main-thread",
      "ana thread",
      "javascript execution",
      "script evaluation",
    ],
  );

  addRecommendation(
    {
      id: "text-compression",
      title: "Metin tabanlı kaynaklarda sıkıştırma kullan",
      category: "Performance",
      priority: "medium",
      description:
        "HTML, CSS ve JavaScript dosyalarında gzip veya Brotli sıkıştırması kullanılmadığında ağ üzerinden taşınan veri miktarı artar.",
      actions: [
        "Sunucu veya hosting tarafında Brotli/gzip sıkıştırmasını aktif et.",
        "HTML, CSS, JS, JSON ve SVG dosyalarının sıkıştırıldığından emin ol.",
        "Production build çıktısını test ederek response header içinde content-encoding değerini kontrol et.",
      ],
    },
    [
      "uses-text-compression",
      "text compression",
      "enable text compression",
      "gzip",
      "brotli",
      "metin sıkıştırma",
    ],
  );

  addRecommendation(
    {
      id: "minify-assets",
      title: "CSS ve JavaScript dosyalarını küçült",
      category: "Performance",
      priority: "medium",
      description:
        "Minify edilmemiş CSS veya JavaScript dosyaları gereksiz boşluk, yorum ve karakter taşıdığı için dosya boyutunu artırır.",
      actions: [
        "Production build sırasında minify işleminin aktif olduğundan emin ol.",
        "Harici eklenen CSS veya JS dosyalarının minify edilmiş versiyonlarını kullan.",
        "Development dosyalarının production ortamına taşınmadığını kontrol et.",
      ],
    },
    [
      "unminified-css",
      "unminified-javascript",
      "minify css",
      "minify javascript",
      "css minify",
      "javascript minify",
      "küçültülmemiş css",
      "küçültülmemiş javascript",
    ],
  );

  addRecommendation(
    {
      id: "duplicated-javascript",
      title: "Tekrarlanan JavaScript paketlerini temizle",
      category: "Performance",
      priority: "medium",
      description:
        "Aynı kütüphanenin birden fazla kez bundle içine girmesi JavaScript boyutunu gereksiz yere artırır.",
      actions: [
        "Bundle analyzer ile tekrar eden paketleri kontrol et.",
        "Aynı işi yapan farklı kütüphaneleri sadeleştir.",
        "Bağımlılık versiyonlarını tekilleştir.",
        "Gereksiz polyfill veya utility paketlerini kaldır.",
      ],
    },
    [
      "duplicated-javascript",
      "duplicate javascript",
      "duplicated modules",
      "tekrarlanan javascript",
      "yinelenen javascript",
    ],
  );

  addRecommendation(
    {
      id: "legacy-javascript",
      title: "Modern tarayıcılar için daha hafif JavaScript üret",
      category: "Performance",
      priority: "medium",
      description:
        "Eski tarayıcı desteği için üretilen fazla polyfill ve eski JavaScript çıktıları modern tarayıcılarda gereksiz yük oluşturabilir.",
      actions: [
        "Browserslist hedeflerini güncel proje ihtiyacına göre kontrol et.",
        "Gereksiz polyfill kullanımını azalt.",
        "Modern build çıktısının üretildiğinden emin ol.",
        "Eski tarayıcı desteği gerekmiyorsa bundle hedeflerini sadeleştir.",
      ],
    },
    [
      "legacy-javascript",
      "legacy javascript",
      "modern javascript",
      "eski javascript",
      "polyfill",
    ],
  );

  addRecommendation(
    {
      id: "preconnect",
      title: "Kritik üçüncü parti bağlantılar için preconnect kullan",
      category: "Performance",
      priority: "low",
      description:
        "Harici font, CDN veya API kaynaklarına erken bağlantı kurulması, kritik kaynakların daha hızlı yüklenmesine yardımcı olabilir.",
      actions: [
        "Kritik harici domainleri belirle.",
        "Font, CDN veya analytics kaynakları için preconnect ekle.",
        "Gereksiz domainlere preconnect eklemekten kaçın.",
        "Next.js metadata veya head yapısında bağlantı ipuçlarını düzenle.",
      ],
    },
    [
      "uses-rel-preconnect",
      "preconnect",
      "preload key requests",
      "early hints",
      "bağlantı",
    ],
  );

  addRecommendation(
    {
      id: "font-display",
      title: "Font yüklemesini optimize et",
      category: "Performance",
      priority: "medium",
      description:
        "Web fontlarının geç yüklenmesi metnin görünmesini geciktirebilir veya layout değişimine neden olabilir.",
      actions: [
        "Next.js projesinde mümkünse next/font kullan.",
        "Harici fontlarda font-display: swap ayarını kullan.",
        "Gereksiz font ağırlıklarını kaldır.",
        "Sadece kullanılan font family ve weight değerlerini yükle.",
      ],
    },
    [
      "font-display",
      "font display",
      "webfont",
      "font loading",
      "yazı tipi",
      "font yükleme",
    ],
  );

  addRecommendation(
    {
      id: "redirects",
      title: "Yönlendirme zincirlerini azalt",
      category: "Performance",
      priority: "medium",
      description:
        "Birden fazla redirect, sayfanın gerçek içeriğe ulaşmasını geciktirir ve ilk yükleme süresini artırır.",
      actions: [
        "URL’nin doğrudan final adrese gittiğinden emin ol.",
        "HTTP’den HTTPS’e veya www/non-www yönlendirmelerini tek adımda çöz.",
        "Eski kampanya veya takip linklerinden oluşan zincirleri sadeleştir.",
      ],
    },
    [
      "redirects",
      "avoid multiple page redirects",
      "redirect chain",
      "yönlendirme",
      "yönlendirme zinciri",
    ],
  );

  addRecommendation(
    {
      id: "image-optimization",
      title: "Görselleri modern format ve lazy loading ile optimize et",
      category: "Performance",
      priority: "medium",
      description:
        "Optimize edilmemiş görseller sayfa ağırlığını artırabilir ve özellikle mobil bağlantılarda yükleme süresini uzatabilir.",
      actions: [
        "Görsellerde mümkünse WebP veya AVIF formatı kullan.",
        "Next.js Image componenti ile otomatik boyutlandırma ve optimizasyon uygula.",
        "İlk ekranda görünmeyen görsellerde lazy loading kullan.",
        "Görsellere width ve height değerleri ekleyerek layout shift riskini azalt.",
      ],
    },
    [
      "modern-image-formats",
      "properly-size-images",
      "offscreen-images",
      "uses-optimized-images",
      "uses-responsive-images",
      "efficiently-encode-images",
      "efficiently encode images",
      "serve images in next-gen formats",
      "serve images that are appropriately-sized",
      "defer offscreen images",
      "lazy loading",
      "webp",
      "avif",
      "görsel",
      "resim",
    ],
  );

  addRecommendation(
    {
      id: "color-contrast",
      title: "Renk kontrastlarını iyileştir",
      category: "Accessibility",
      priority: "high",
      description:
        "Yetersiz renk kontrastı, özellikle düşük görme yetisine sahip kullanıcıların metinleri okumasını zorlaştırır.",
      actions: [
        "Metin ve arka plan renkleri arasındaki kontrast oranını artır.",
        "Küçük metinlerde minimum 4.5:1 kontrast oranını hedefle.",
        "Buton, link ve açıklama metinlerinde düşük opacity kullanımını azalt.",
        "Tailwind tarafında text-white/40 gibi düşük opaklıkları kritik metinlerde kullanma.",
      ],
    },
    [
      "color-contrast",
      "contrast ratio",
      "kontrast",
      "arka plan ve ön plan",
      "yeterli kontrast",
    ],
  );

  addRecommendation(
    {
      id: "link-name",
      title: "Bağlantılara açıklayıcı erişilebilir adlar ekle",
      category: "Accessibility",
      priority: "high",
      description:
        "Ekran okuyucu kullanan ziyaretçiler için linklerin ne işe yaradığını açıkça belirtmek gerekir.",
      actions: [
        "Sadece ikon içeren linklere aria-label ekle.",
        "Aynı metne sahip ama farklı hedeflere giden linkleri daha açıklayıcı yaz.",
        "'Detaylı Görünüm', 'Devamı' gibi genel linkleri bağlama özel hale getir.",
        "Görsel linklerde anlamlı alt metin kullan.",
      ],
    },
    [
      "link-name",
      "links do not have a discernible name",
      "bağlantıların ayırt edilebilir",
      "ayırt edilebilir ad",
      "erişilebilir ad",
    ],
  );

  addRecommendation(
    {
      id: "button-name",
      title: "Butonlara erişilebilir adlar ekle",
      category: "Accessibility",
      priority: "high",
      description:
        "Ekran okuyucular için butonların amacı anlaşılır olmalıdır. Sadece ikon içeren veya metinsiz butonlar erişilebilirlik sorununa yol açabilir.",
      actions: [
        "Sadece ikon içeren butonlara aria-label ekle.",
        "Buton metinlerini aksiyonu anlatacak şekilde düzenle.",
        "Dekoratif ikonları aria-hidden ile gizle.",
        "Form butonlarında submit, reset ve normal button tiplerini doğru kullan.",
      ],
    },
    [
      "button-name",
      "buttons do not have an accessible name",
      "butonların erişilebilir",
      "erişilebilir buton",
    ],
  );

  addRecommendation(
    {
      id: "accessibility-improvements",
      title: "Erişilebilirlik sorunlarını düzelt",
      category: "Accessibility",
      priority: "medium",
      description:
        "Erişilebilirlik bulguları, klavye kullanıcıları ve ekran okuyucu kullanan ziyaretçiler için deneyimi olumsuz etkileyebilir.",
      actions: [
        "Görsellerde anlamlı alt metinleri kontrol et.",
        "Form alanlarında label ve aria attribute yapılarını kontrol et.",
        "Odaklanma stillerinin klavye kullanıcıları için görünür olduğundan emin ol.",
        "Dokunmatik hedef alanlarını mobil cihazlar için yeterli boyutta tut.",
      ],
    },
    [
      "accessibility",
      "aria-",
      "aria ",
      "image-alt",
      "input-image-alt",
      "form-field-multiple-labels",
      "labels",
      "erişilebilirlik",
      "dokunmatik hedef",
      "tap target",
    ],
  );

  if (!recommendations.length && normalizedFindings.length) {
    recommendations.push({
      id: "general-optimization",
      title: "PageSpeed bulgularını önceliklendir",
      category: "UX",
      priority: "low",
      description:
        "Bu raporda özel bir öneri kuralıyla eşleşmeyen bulgular var. Bu bulgular yine de kullanıcı deneyimini veya teknik kaliteyi etkileyebilir.",
      actions: [
        "PageSpeed bulgularını tek tek incele.",
        "Yüksek etkiye sahip performans ve erişilebilirlik sorunlarından başla.",
        "Her düzeltmeden sonra aynı URL için yeni analiz çalıştır.",
      ],
      matchedFindings: normalizedFindings.map((finding) => finding.title),
    });
  }

  return recommendations.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}