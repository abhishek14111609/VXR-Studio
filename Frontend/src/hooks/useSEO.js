import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to manage SEO meta tags dynamically per page
 * Usage: useSEO({ title, description, keywords, image, url, type: 'website' })
 */
export const useSEO = (seoData = {}) => {
    const location = useLocation();
    const baseUrl = 'https://vxrmedia.in';

    const defaultMeta = {
        title: 'VXR Media House | Content Creation Agency',
        description: 'Cinematic content creation, strategic branding, and high-performance digital marketing for premium brands in Rajkot.',
        keywords: 'content creation, social media marketing, Meta ads, graphic design, video editing, branding agency Rajkot',
        image: `${baseUrl}/og-image.jpg`,
        url: `${baseUrl}${location.pathname}`,
        type: 'website',
    };

    const meta = { ...defaultMeta, ...seoData };

    useEffect(() => {
        // Update document title
        document.title = meta.title;

        // Update or create meta description
        updateMetaTag('name', 'description', meta.description);

        // Update or create meta keywords
        updateMetaTag('name', 'keywords', meta.keywords);

        // Open Graph tags
        updateMetaTag('property', 'og:title', meta.title);
        updateMetaTag('property', 'og:description', meta.description);
        updateMetaTag('property', 'og:image', meta.image);
        updateMetaTag('property', 'og:url', meta.url);
        updateMetaTag('property', 'og:type', meta.type);
        updateMetaTag('property', 'og:site_name', 'VXR Media House');

        // Twitter Card tags
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', meta.title);
        updateMetaTag('name', 'twitter:description', meta.description);
        updateMetaTag('name', 'twitter:image', meta.image);

        // Canonical URL
        updateCanonicalURL(meta.url);
    }, [meta]);
};

/**
 * Update or create a meta tag
 */
function updateMetaTag(attrName, attrValue, content) {
    let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);

    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);
}

/**
 * Update or create canonical URL
 */
function updateCanonicalURL(url) {
    let link = document.querySelector('link[rel="canonical"]');

    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }

    link.href = url;
}

/**
 * Add JSON-LD structured data
 */
export const useStructuredData = (schema) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(schema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [schema]);
};
