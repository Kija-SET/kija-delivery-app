import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
  customSchema?: any[];
}

export const SEOHead = ({
  title: propTitle,
  description: propDescription,
  keywords: propKeywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  customSchema = []
}: SEOHeadProps) => {
  const [seoSettings, setSeoSettings] = useState({
    site_title: 'E-commerce Moderno',
    site_description: 'Loja online com os melhores produtos',
    site_keywords: 'ecommerce, loja, produtos, online'
  });

  useEffect(() => {
    const fetchSEOSettings = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('key, value')
          .eq('category', 'seo')
          .eq('is_public', true);

        if (data) {
          const settings: any = {};
          data.forEach(({ key, value }) => {
            settings[key] = typeof value === 'string' ? JSON.parse(value) : value;
          });
          setSeoSettings(prev => ({ ...prev, ...settings }));
        }
      } catch (error) {
        console.error('Erro ao buscar configurações SEO:', error);
      }
    };

    fetchSEOSettings();
  }, []);

  const currentUrl = url || window.location.href;
  const title = propTitle ? `${propTitle} | ${seoSettings.site_title}` : seoSettings.site_title;
  const description = propDescription || seoSettings.site_description;
  const keywords = propKeywords || seoSettings.site_keywords;
  const ogImage = image || '/favicon.ico';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoSettings.site_title,
    "description": seoSettings.site_description,
    "url": currentUrl,
    ...customSchema.length > 0 && { additionalType: customSchema }
  };

  return (
    <Helmet>
      {/* Title e Meta básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Meta para robôs */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={seoSettings.site_title} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};