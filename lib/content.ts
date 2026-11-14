// Server-only content store. Everything the admin panel edits lives in one JSON file
// outside the code folder, so deploying new code never overwrites it.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {SITE, services as defaultServices, cities as defaultCities, faqs as defaultFaqs, steps as defaultSteps} from '@/data/site';
import type {SiteSettings, Service, City, Faq, Step, Post} from '@/data/site';

export type Content = {site:SiteSettings;services:Service[];cities:City[];faqs:Faq[];steps:Step[];posts:Post[]};
// What the browser-side components need (no blog bodies).
export type PostCard = {slug:string;title:string;excerpt:string;cover?:string;coverAlt?:string;publishedAt:string;category?:string};
export type PublicContent = Omit<Content,'posts'> & {hasBlog:boolean;latestPosts:PostCard[]};

// On the server the app runs from /var/www/domesticstaffprovider/current, so this is
// /var/www/domesticstaffprovider/dsp-content. Locally it sits next to the project folder.
export const CONTENT_DIR = process.env.CONTENT_DIR || path.join(process.cwd(), '..', 'dsp-content');
const FILE = path.join(CONTENT_DIR, 'content.json');
const HISTORY = path.join(CONTENT_DIR, 'history');
export const UPLOADS = path.join(CONTENT_DIR, 'uploads');

// Brand and address of the site are fixed in code; contact details are editable.
const FIXED = {brand:SITE.brand, domain:SITE.domain, url:SITE.url};

function defaults():Content{
  return {site:{...SITE}, services:structuredClone(defaultServices), cities:structuredClone(defaultCities), faqs:structuredClone(defaultFaqs), steps:structuredClone(defaultSteps), posts:[]};
}

let cache:{mtime:number;data:Content}|null=null;

export function getContent():Content{
  let stat:fs.Stats|null=null;
  try{stat=fs.statSync(FILE)}catch{}
  if(!stat) return withFixed(defaults());
  if(cache&&cache.mtime===stat.mtimeMs) return cache.data;
  const raw=JSON.parse(fs.readFileSync(FILE,'utf8')) as Partial<Content>;
  const d=defaults();
  const data=withFixed({
    site:{...d.site,...(raw.site||{})},
    services:raw.services??d.services,
    cities:raw.cities??d.cities,
    faqs:raw.faqs??d.faqs,
    steps:raw.steps??d.steps,
    posts:raw.posts??[],
  });
  cache={mtime:stat.mtimeMs,data};
  return data;
}

function withFixed(c:Content):Content{return {...c, site:{...c.site,...FIXED}}}

export function getPublicContent():PublicContent{
  const {posts,...rest}=getContent();
  const live=posts.filter(p=>p.status==='published').sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  return {...rest, hasBlog:live.length>0, latestPosts:live.slice(0,3).map(({slug,title,excerpt,cover,coverAlt,publishedAt,category})=>({slug,title,excerpt,cover,coverAlt,publishedAt,category}))};
}

export function publishedPosts():Post[]{
  return getContent().posts.filter(p=>p.status==='published').sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}

// Save a change. Each save keeps the previous version in history/ (last 50) so mistakes can be undone.
export function updateContent(change:(c:Content)=>void){
  const c=structuredClone(getContent());
  change(c);
  fs.mkdirSync(HISTORY,{recursive:true});
  if(fs.existsSync(FILE)){
    fs.copyFileSync(FILE, path.join(HISTORY, `content-${new Date().toISOString().replace(/[:.]/g,'-')}.json`));
    const old=fs.readdirSync(HISTORY).filter(f=>f.startsWith('content-')).sort();
    for(const f of old.slice(0,Math.max(0,old.length-50))) fs.rmSync(path.join(HISTORY,f),{force:true});
  }
  const {site,...rest}=c;
  const {brand,domain,url,...editable}=site; void brand; void domain; void url;
  const tmp=`${FILE}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({site:editable,...rest},null,1));
  fs.renameSync(tmp, FILE);
  cache=null;
}

export const slugify=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);
export const isSlug=(s:string)=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
