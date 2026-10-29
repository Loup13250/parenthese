import { DM_Sans, Cormorant_Garamond } from "next/font/google";
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

export const viewport = {
  themeColor: "#FAF7F2",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata() {
  const siteInfo = await getSiteInfo().catch(() => ({}));
  const iconUrl = siteInfo?.site_icon || "/icon.png";
  const businessName = siteInfo?.business_name || "La Parenthèse Harmonieuse";

  let iconMime = "image/png";
  if (iconUrl.endsWith(".svg")) iconMime = "image/svg+xml";
  else if (iconUrl.endsWith(".webp")) iconMime = "image/webp";
  else if (iconUrl.endsWith(".ico")) iconMime = "image/x-icon";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${businessName} | Massages & Soins à Salon-de-Provence`,
      template: `%s | ${businessName}`,
    },
    description:
      "Un cocon de bien-être et de douceur exclusivement dédié aux femmes à Salon-de-Provence. Massages sur mesure, soins visage bio Nohèm, drainage lymphatique et Kobido.",
    keywords: [
      "institut de beauté Salon-de-Provence",
      "massage Salon-de-Provence",
      "drainage lymphatique Salon-de-Provence",
      "Kobido Salon-de-Provence",
      "soin visage bio Salon-de-Provence",
      "massage sur mesure femme",
      "carte cadeau massage Salon-de-Provence",
      "La Parenthèse Harmonieuse",
    ],
    authors: [{ name: `${siteInfo?.creator_name || "Harmonie"} — ${businessName}` }],
    creator: siteInfo?.creator_name || "Harmonie",
    publisher: businessName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: SITE_URL,
      siteName: businessName,
      title: `${businessName} | Massages & Soins à Salon-de-Provence`,
      description:
        "Offrez-vous une parenthèse de bien-être dans un institut cocon exclusivement dédié aux femmes à Salon-de-Provence.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${businessName} — Institut de beauté & bien-être à Salon-de-Provence`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${businessName} | Institut de beauté & bien-être`,
      description:
        "Massages sur mesure, drainage lymphatique, Kobido & soins visage bio à Salon-de-Provence.",
      images: ["/og-image.jpg"],
    },
    icons: {
      icon: [
        { url: iconUrl, type: iconMime },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      shortcut: iconUrl,
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({ children }) {
  const rootSiteInfo = await getSiteInfo().catch(() => ({}));
  const customTexts = parseCustomTexts(rootSiteInfo?.[CUSTOM_TEXTS_KEY]);
  const rawDigits = (rootSiteInfo?.phone_raw || rootSiteInfo?.phone || "0651652142").replace(/\D+/g, "");
  const intlPhone = rawDigits.startsWith("0") ? `+33${rawDigits.slice(1)}` : `+${rawDigits}`;

  const sameAsLinks = [
    rootSiteInfo?.planity_url || "https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence",
    rootSiteInfo?.instagram || "https://www.instagram.com/laparentheseharmonieuse/",
    rootSiteInfo?.facebook,
    rootSiteInfo?.google_reviews,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["BeautySalon", "DaySpa"],
    name: rootSiteInfo?.business_name || "La Parenthèse Harmonieuse",
    legalName: "Harmonie PERRAULT",
    description:
      "Institut de beauté et de bien-être holistique exclusivement dédié aux femmes à Salon-de-Provence : massages sur mesure, drainage lymphatique, madérothérapie, Kobido et soins visage bio.",
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}${rootSiteInfo?.logo || "/images/logo.png"}`,
    "@id": SITE_URL,
    url: SITE_URL,
    telephone: intlPhone,
    email: rootSiteInfo?.contact_email || "laparentheseharmonieuse@gmail.com",
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card",
    taxID: "FR76980474340",
    identifier: [
      { "@type": "PropertyValue", "name": "SIREN", "value": "980474340" },
      { "@type": "PropertyValue", "name": "SIRET", "value": "98047434000018" },
      { "@type": "PropertyValue", "name": "NAF", "value": "9602B" },
    ],
    founder: {
      "@type": "Person",
      name: "Harmonie PERRAULT",
      jobTitle: "Fondatrice & Praticienne Bien-Être Certifiée",
    },
    knowsAbout: [
      "Massages sur mesure",
      "Drainage lymphatique bien-être",
      "Madérothérapie",
      "Massage liftant ancestral Kobido",
      "Soins du visage bio certifiés",
      "Soins douceur future maman",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Carte des Soins & Rituels Bien-Être",
      url: `${SITE_URL}/carte-des-soins`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: rootSiteInfo?.address || "418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer",
      addressLocality: rootSiteInfo?.city || "Salon-de-Provence",
      postalCode: rootSiteInfo?.postal_code || "13300",
      addressRegion: "Bouches-du-Rhône",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.628201,
      longitude: 5.104028,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Tuesday",
        opens: "10:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Tuesday",
        opens: "14:30",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Wednesday",
        opens: "14:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Thursday",
        opens: "10:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Thursday",
        opens: "14:30",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "10:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "14:30",
        closes: "17:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:30",
        closes: "14:00",
      },
    ],
    sameAs: sameAsLinks,
  };

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      data-theme="light"
      data-scroll-behavior="smooth"
      style={{ colorScheme: "light" }}
      className={`${dmSans.variable} ${cormorant.variable}`}
    >
      <head>
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
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
