import type {MetadataRoute} from 'next';
import {getContent,publishedPosts} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{
  const {site:SITE,services,cities}=getContent();
  const posts=publishedPosts();
  return [
    ...['','/services','/areas','/how-it-works','/about','/contact','/faq','/privacy','/terms','/blog'].map(p=>({url:SITE.url+p,changeFrequency:'monthly' as const,priority:p===''?1:0.6})),
    ...services.map(s=>({url:`${SITE.url}/services/${s.slug}`,changeFrequency:'monthly' as const,priority:0.8})),
    ...cities.map(c=>({url:`${SITE.url}/areas/${c.slug}`,changeFrequency:'monthly' as const,priority:0.8})),
    ...posts.filter(p=>!p.noindex&&!p.canonical).map(p=>({url:`${SITE.url}/blog/${p.slug}`,lastModified:p.updatedAt,changeFrequency:'monthly' as const,priority:0.7})),
  ];
}
