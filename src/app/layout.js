import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { getSiteInfo } from "@/lib/data";
import { LanguageProvider } from "@/context/LanguageContext";
import { SITE_URL } from "@/lib/site";
import { parseCustomTexts, CUSTOM_TEXTS_KEY } from "@/lib/siteTexts";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const momerkz = localFont({
  src: [
    {
      path: "./fonts/Momerkz-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Momerkz-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Momerkz-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-momerkz",
  display: "swap",
});

export const viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata() {
  const siteInfo = await getSiteInfo();
  const iconUrl = siteInfo?.site_icon || '/icon.svg';
  const isSvg = iconUrl.endsWith('.svg') || iconUrl.includes('.svg') || iconUrl.includes('image%2Fsvg');

  return {
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: SITE_URL,
    },
    title: {
      default: "La Parenthèse Harmonieuse | Massages & Soins à Salon-de-Provence",
      template: "%s | La Parenthèse Harmonieuse"
    },
    description: "Un cocon de bien-être et de douceur exclusivement dédié aux femmes à Salon-de-Provence. Massages sur mesure, soins visage bio, drainage lymphatique et Kobido.",
    keywords: [
      "institut de beauté Salon de Provence",
      "massage Salon de Provence",
      "drainage lymphatique Salon de Provence",
      "Kobido Salon de Provence",
      "soin visage bio Salon de Provence",
      "massage sur mesure",
      "institut bien-être femme Salon de Provence",
      "La Parenthèse Harmonieuse"
    ],
    authors: [{ name: "Harmonie - La Parenthèse Harmonieuse" }],
    creator: "Harmonie",
    publisher: "La Parenthèse Harmonieuse",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: SITE_URL,
      siteName: "La Parenthèse Harmonieuse",
      title: "La Parenthèse Harmonieuse | Massages & Soins à Salon-de-Provence",
      description: "Offrez-vous une parenthèse de bien-être dans un institut cocon dédié aux femmes à Salon-de-Provence.",
      images: [
        {
          url: "/images/hero-poster.jpg",
          width: 1200,
          height: 630,
          alt: "La Parenthèse Harmonieuse - Institut de beauté à Salon-de-Provence",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "La Parenthèse Harmonieuse | Institut de beauté",
      description: "Massages sur mesure, drainage lymphatique, Kobido & soins visage bio à Salon-de-Provence.",
      images: ["/images/hero-poster.jpg"],
    },
    icons: {
      icon: [
        { url: '/images/logo.png', type: 'image/png' },
        { url: '/favicon.ico', sizes: '32x32' },
      ],
      shortcut: '/images/logo.png',
      apple: '/images/logo.png',
    },
  };
}

export default async function RootLayout({ children }) {
  const rootSiteInfo = await getSiteInfo().catch(() => ({}));
  const customTexts = parseCustomTexts(rootSiteInfo?.[CUSTOM_TEXTS_KEY]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'La Parenthèse Harmonieuse',
    image: `${SITE_URL}/images/hero-poster.jpg`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '+33651652142',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer',
      addressLocality: 'Salon-de-Provence',
      postalCode: '13300',
      addressRegion: 'Bouches-du-Rhône',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.628201,
      longitude: 5.104028,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Tuesday',
        opens: '10:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Wednesday',
        opens: '14:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:30',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence',
      'https://www.instagram.com/laparentheseharmonieuse/'
    ]
  };

  return (
    <html lang="fr" suppressHydrationWarning data-theme="light" data-scroll-behavior="smooth" style={{ colorScheme: 'light' }} className={`${dmSans.variable} ${cormorant.variable} ${momerkz.variable}`}>
      <head>
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="theme-cleanup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem('mamefricoto-theme');
                  localStorage.removeItem('mamefricoto-da');
                  localStorage.removeItem('mamefricoto-lang');
                  document.documentElement.removeAttribute('data-da');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script
          id="language-detect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('laparenthese-lang');
                  var lang = saved;
                  if (!lang || (lang !== 'fr' && lang !== 'en')) {
                    var navLangs = navigator.languages || [navigator.language || ''];
                    var firstLang = (navLangs[0] || '').toLowerCase();
                    lang = firstLang.indexOf('fr') === 0 ? 'fr' : 'en';
                  }
                  document.documentElement.lang = lang;
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script
          id="dev-console-signature"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  console.log(
                    "%c  La Parenthèse Harmonieuse  %c\\n\\n%cInstitut de Beauté & Bien-être holistique\\n418 Avenue Georges Guynemer, 13300 Salon-de-Provence\\n",
                    "background: #8B632E; color: #FFFFFF; font-size: 13px; font-weight: bold; padding: 4px 10px; border-radius: 4px;",
                    "",
                    "font-size: 12px; color: #3A322D; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif;"
                  );
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Aller au contenu principal
        </a>
        <LanguageProvider overrides={customTexts}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
