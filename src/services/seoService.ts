export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  keywords: string;
}

export const DEFAULT_SEO_METADATA: SeoMetadata = {
  metaTitle: "RECON Expo 2026 - 8th Real Estate & Construction Expo Abuja",
  metaDescription: "West Africa's flagship 8th Real Estate & Construction Expo 2026 at Shehu Musa Yar'Adua Centre, Abuja. 8,500+ attendees, 150+ exhibitors, ministerial plenaries.",
  ogTitle: "RECON Expo 2026 | Abuja, Nigeria",
  ogDescription: "Register for West Africa's leading Real Estate & Construction Expo (29-30 October 2026). Free Visitor Passes & VIP Access available.",
  ogImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  keywords: "RECON Expo 2026, Abuja real estate exhibition, Nigeria construction expo, Yar'Adua centre events, REDAN, Nigerian Institute of Architects"
};

export const applySeoMetadata = (seo: SeoMetadata) => {
  if (typeof document === 'undefined') return;
  document.title = seo.metaTitle;
  
  const updateMeta = (nameOrProp: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, nameOrProp);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  updateMeta('description', seo.metaDescription);
  updateMeta('keywords', seo.keywords);
  updateMeta('og:title', seo.ogTitle, true);
  updateMeta('og:description', seo.ogDescription, true);
  updateMeta('og:image', seo.ogImageUrl, true);
};
