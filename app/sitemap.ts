import type {MetadataRoute} from 'next';
import {SITE,services,cities} from '@/data/site';
export default function sitemap():MetadataRoute.Sitemap{return [...['','/services','/areas','/how-it-works','/about','/contact','/faq','/privacy','/terms'].map(p=>({url:SITE.url+p,changeFrequency:'monthly' as const,priority:p===''?1:0.6})),...services.map(s=>({url:`${SITE.url}/services/${s.slug}`,changeFrequency:'monthly' as const,priority:0.8})),...cities.map(c=>({url:`${SITE.url}/areas/${c.slug}`,changeFrequency:'monthly' as const,priority:0.8}))]}
