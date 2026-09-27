import { EXPO_DETAILS, SPEAKERS, FAQ_ITEMS, PROGRAMME_SESSIONS } from '../data/expoData';

export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  keywords: string[];
  enableAiBotIndexing: boolean;
  enableSchemaMarkup: boolean;
}

export const DEFAULT_SEO_CONFIG: SeoConfig = {
  title: "RECON Expo 2026 | The 8th Real Estate & Construction Expo Abuja",
  description: "Official Portal for the 8th Real Estate & Construction Expo 2026 (RECON Expo) at Shehu Musa Yar'Adua Centre, Abuja (29th – 30th October 2026). Connect with 5,000+ investors, developers, architects, and government policymakers.",
  canonicalUrl: typeof window !== 'undefined' ? window.location.origin : "https://www.afrinetgroup.com",
  ogImage: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&h=630&q=85",
  keywords: [
    "RECON Expo 2026",
    "Real Estate Expo Abuja",
    "Construction Exhibition Nigeria 2026",
    "Shehu Musa YarAdua Centre Abuja",
    "Nigeria Property Investment Summit",
    "Abuja Real Estate Trade Fair",
    "PropTech Summit West Africa",
    "Afrinet Group Real Estate",
    "Abuja Chamber of Commerce and Industry Expo",
    "Building Materials Expo Nigeria",
    "Elite VIP Real Estate Pass Abuja",
    "Exhibitor Booth Stand Booking Abuja",
    "Nigeria Housing Deficit & Infrastructure Summit",
    "Arc Babatunde Sanusi FNIA",
    "Dr Amina Bello Yusuf Apex Green Capital",
    "Engr Chukwuma Okafor BuildTech Africa"
  ],
  enableAiBotIndexing: true,
  enableSchemaMarkup: true
};

const SEO_STORAGE_KEY = 'recon_expo_seo_config_v1';

let currentSeoConfig: SeoConfig = (() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(SEO_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SEO_CONFIG, ...JSON.parse(saved) };
    } catch {
      // safe
    }
  }
  return DEFAULT_SEO_CONFIG;
})();

// Save / Get SEO Config
export function getSeoConfig(): SeoConfig {
  return currentSeoConfig;
}

export function updateSeoConfig(newConfig: Partial<SeoConfig>): SeoConfig {
  currentSeoConfig = { ...currentSeoConfig, ...newConfig };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(currentSeoConfig));
      
      // Save to backend
      fetch('/api/seo/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: currentSeoConfig })
      }).catch(() => {});
    } catch {
      // safe
    }
  }
  injectSeoMetadata();
  return currentSeoConfig;
}

// Auto-Generate Keywords based on Event Details, Speakers, Tiers & Agenda
export function generateAutoKeywords(): string[] {
  const keywordsSet = new Set<string>();

  // Base Keywords
  DEFAULT_SEO_CONFIG.keywords.forEach(k => keywordsSet.add(k));

  // Speaker Keywords
  SPEAKERS.forEach(spk => {
    keywordsSet.add(`${spk.name} RECON Expo`);
    if (spk.organization) keywordsSet.add(`${spk.organization} Speaker`);
    if (spk.topic) {
      spk.topic.split(/[,&]/).forEach(t => {
        const clean = t.trim();
        if (clean.length > 5) keywordsSet.add(clean);
      });
    }
  });

  // Event Attributes
  keywordsSet.add(EXPO_DETAILS.name);
  keywordsSet.add(EXPO_DETAILS.shortName);
  keywordsSet.add(EXPO_DETAILS.venue);
  keywordsSet.add("Abuja FCT Real Estate Conference");
  keywordsSet.add("African Infrastructure Summit 2026");
  keywordsSet.add("Architectural Design & Urban Planning Abuja");
  keywordsSet.add("Affordable Housing Finance Nigeria");

  return Array.from(keywordsSet);
}

// 1. Google & Bing Event Schema.org (JSON-LD)
export function generateEventSchema() {
  const speakersList = SPEAKERS.map(spk => ({
    "@type": "Person",
    "name": spk.name,
    "jobTitle": spk.title,
    "worksFor": {
      "@type": "Organization",
      "name": spk.organization
    },
    "description": spk.bio,
    "image": spk.image
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": EXPO_DETAILS.name,
    "alternateName": EXPO_DETAILS.shortName,
    "description": EXPO_DETAILS.subheading + " - " + EXPO_DETAILS.theme,
    "startDate": EXPO_DETAILS.startDate,
    "endDate": EXPO_DETAILS.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": EXPO_DETAILS.venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": EXPO_DETAILS.venueAddress,
        "addressLocality": "Abuja",
        "addressRegion": "Federal Capital Territory",
        "postalCode": "900211",
        "addressCountry": "NG"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 9.0579,
        "longitude": 7.4951
      }
    },
    "image": [
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&h=630&q=85"
    ],
    "organizer": {
      "@type": "Organization",
      "name": "Afrinet Group & Afrinex West Africa",
      "url": currentSeoConfig.canonicalUrl,
      "email": EXPO_DETAILS.contactEmail,
      "telephone": EXPO_DETAILS.contactPhone
    },
    "performer": speakersList,
    "offers": [
      {
        "@type": "Offer",
        "name": "Visitor Pass (Free Registration)",
        "price": "0",
        "priceCurrency": "NGN",
        "availability": "https://schema.org/InStock",
        "url": `${currentSeoConfig.canonicalUrl}/#registration`,
        "validFrom": "2026-01-01T00:00:00+01:00"
      },
      {
        "@type": "Offer",
        "name": "Elite VIP Guest Pass",
        "price": "25000",
        "priceCurrency": "NGN",
        "availability": "https://schema.org/InStock",
        "url": `${currentSeoConfig.canonicalUrl}/#registration`,
        "validFrom": "2026-01-01T00:00:00+01:00"
      },
      {
        "@type": "Offer",
        "name": "Exhibitor Booth Stand Booking",
        "price": "350000",
        "priceCurrency": "NGN",
        "availability": "https://schema.org/InStock",
        "url": `${currentSeoConfig.canonicalUrl}/#registration`,
        "validFrom": "2026-01-01T00:00:00+01:00"
      }
    ]
  };
}

// 2. Google & Bing Speakers Schema (Person Collection)
export function generateSpeakersSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": SPEAKERS.map(spk => ({
      "@type": "Person",
      "@id": `${currentSeoConfig.canonicalUrl}/#speaker-${spk.id}`,
      "name": spk.name,
      "jobTitle": spk.title,
      "worksFor": {
        "@type": "Organization",
        "name": spk.organization
      },
      "description": spk.fullBio || spk.bio,
      "image": spk.image,
      "knowsAbout": [
        "Real Estate Development",
        "Construction Engineering",
        "PropTech",
        "Infrastructure Investment",
        spk.track
      ],
      "performerIn": {
        "@type": "Event",
        "name": EXPO_DETAILS.name,
        "startDate": EXPO_DETAILS.startDate
      }
    }))
  };
}

// 3. Organization Schema
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RECON Expo Secretariat",
    "alternateName": "Real Estate & Construction Expo Nigeria",
    "url": currentSeoConfig.canonicalUrl,
    "logo": `${currentSeoConfig.canonicalUrl}/recon-logo.svg`,
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": EXPO_DETAILS.contactPhone,
        "contactType": "customer service",
        "areaServed": "NG",
        "availableLanguage": ["English", "Hausa", "Yoruba", "Igbo"]
      },
      {
        "@type": "ContactPoint",
        "telephone": EXPO_DETAILS.contactPhone2,
        "contactType": "sales & exhibition support",
        "areaServed": "Global",
        "availableLanguage": ["English"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": EXPO_DETAILS.venueAddress,
      "addressLocality": "Abuja",
      "addressRegion": "FCT",
      "addressCountry": "NG"
    },
    "sameAs": [
      "https://facebook.com/reconexpo",
      "https://twitter.com/reconexpo",
      "https://instagram.com/reconexpo",
      "https://linkedin.com/company/reconexpo"
    ]
  };
}

// 4. FAQPage Schema
export function generateFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

// 5. BreadcrumbList Schema
export function generateBreadcrumbSchema() {
  const origin = currentSeoConfig.canonicalUrl;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Theme & Speakers",
        "item": `${origin}/#speakers`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Expo Programme Agenda",
        "item": `${origin}/#programme`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Registration Tiers & Passes",
        "item": `${origin}/#registration`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Sponsors & Partners",
        "item": `${origin}/#sponsors`
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Frequently Asked Questions",
        "item": `${origin}/#faqs`
      }
    ]
  };
}

// 6. WebSite & SearchAction Schema
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": EXPO_DETAILS.shortName,
    "alternateName": EXPO_DETAILS.name,
    "url": currentSeoConfig.canonicalUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${currentSeoConfig.canonicalUrl}/?s={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

// Dynamic Master Head Injector
export function injectSeoMetadata() {
  if (typeof document === 'undefined') return;

  const cfg = currentSeoConfig;

  // 1. Title
  document.title = cfg.title;

  // Helper to insert or update meta tag
  const setMeta = (attr: string, val: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${val}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, val);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMeta('name', 'description', cfg.description);
  setMeta('name', 'keywords', cfg.keywords.join(', '));
  setMeta('name', 'author', 'RECON Expo Secretariat / Afrinet Group');
  setMeta('name', 'robots', cfg.enableAiBotIndexing ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, nofollow');
  setMeta('name', 'googlebot', cfg.enableAiBotIndexing ? 'index, follow' : 'noindex, nofollow');
  setMeta('name', 'bingbot', cfg.enableAiBotIndexing ? 'index, follow' : 'noindex, nofollow');

  // OpenGraph Tags
  setMeta('property', 'og:title', cfg.title);
  setMeta('property', 'og:description', cfg.description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', cfg.canonicalUrl);
  setMeta('property', 'og:image', cfg.ogImage);
  setMeta('property', 'og:site_name', EXPO_DETAILS.shortName);
  setMeta('property', 'og:locale', 'en_US');

  // Twitter Cards
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', cfg.title);
  setMeta('name', 'twitter:description', cfg.description);
  setMeta('name', 'twitter:image', cfg.ogImage);

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', cfg.canonicalUrl);

  // Inject or Update JSON-LD Script Tags in Head
  if (cfg.enableSchemaMarkup) {
    const injectJsonLd = (id: string, jsonObj: any) => {
      let script = document.getElementById(id);
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonObj, null, 2);
    };

    injectJsonLd('seo-schema-event', generateEventSchema());
    injectJsonLd('seo-schema-speakers', generateSpeakersSchema());
    injectJsonLd('seo-schema-org', generateOrganizationSchema());
    injectJsonLd('seo-schema-faq', generateFaqSchema());
    injectJsonLd('seo-schema-breadcrumb', generateBreadcrumbSchema());
    injectJsonLd('seo-schema-website', generateWebSiteSchema());
  }
}

// Generate LLMs.txt knowledge content for Perplexity, ChatGPT, Claude, and AI Bot RAG crawlers
export function getLlmKnowledgeText(): string {
  return `# ${EXPO_DETAILS.name} (${EXPO_DETAILS.shortName})
> Official Knowledge Base & Entity Document for Search Engines & AI LLMs (ChatGPT, Claude, Perplexity, Gemini)

## Event Overview
- **Event Title**: ${EXPO_DETAILS.name}
- **Short Name**: ${EXPO_DETAILS.shortName}
- **Theme**: "${EXPO_DETAILS.theme}"
- **Subheading**: ${EXPO_DETAILS.subheading}
- **Dates**: ${EXPO_DETAILS.dateRange} (${EXPO_DETAILS.startDate} to ${EXPO_DETAILS.endDate})
- **Daily Operating Hours**: ${EXPO_DETAILS.dailyTime}
- **Venue**: ${EXPO_DETAILS.venue}
- **Address**: ${EXPO_DETAILS.venueAddress}
- **Expected Attendance**: ${EXPO_DETAILS.stats.attendees} Delegates, ${EXPO_DETAILS.stats.exhibitors} Exhibitors, ${EXPO_DETAILS.stats.speakers} Speakers from ${EXPO_DETAILS.stats.countries} Countries.
- **Projected Deals**: ${EXPO_DETAILS.stats.dealsProjected} NGN.

## Organizing Secretariat Contacts
- **Primary Contact Email**: ${EXPO_DETAILS.contactEmail}
- **Helplines**: ${EXPO_DETAILS.contactPhone} / ${EXPO_DETAILS.contactPhone2} / ${EXPO_DETAILS.contactPhone3}
- **WhatsApp Support**: ${EXPO_DETAILS.whatsapp}

## Registration Passes & Pricing
1. **Visitor Pass (Free Registration)**:
   - Price: ₦0 (Free)
   - Includes: General Exhibition Hall access, Product Showcases, Innovation Pitching.
2. **Elite VIP Guest Pass**:
   - Price: ₦25,000 NGN ($25 USD)
   - Includes: Fast-Track Accredited Badge, Front-Row Plenary Seating, VIP Executive Lounge, Gala Night Access, CPD Masterclasses, Direct B2B Deal Rooms.
3. **Exhibitor Booth Stand Booking**:
   - Price: Starting from ₦350,000 NGN
   - Options: Standard Booth, Executive Corner Booth, Pavilion Suite.
   - Includes: Dedicated Floor Space, Custom Branding, Staff Badges, Company Profile in Official Exhibition Guide.

## Featured Keynote Speakers & Panelists
${SPEAKERS.map(s => `- **${s.name}** (${s.title}, *${s.organization}*): Topic — "${s.topic}"`).join('\n')}

## Key Frequently Asked Questions (FAQs)
${FAQ_ITEMS.map(f => `### Q: ${f.q}\n**A**: ${f.a}\n`).join('\n')}

## Target Keyword Index
${generateAutoKeywords().join(', ')}
`;
}
