// Leads (enquiries) and anonymous click counts. Stored next to the site content,
// in leads.json and stats.json, outside the code folder.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {CONTENT_DIR} from './content';

export const LEAD_STATUSES = ['new','contacted','interview','hired','closed','spam'] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];
export const statusLabel:Record<LeadStatus,string> = {new:'New',contacted:'Contacted',interview:'Interview arranged',hired:'Hired',closed:'Closed',spam:'Spam'};

export type Lead = {
  id:string; createdAt:string; updatedAt:string;
  name:string; phone:string; service:string; city:string; arrangement:string; details:string;
  page:string; source:'website'|'manual'; status:LeadStatus; notes:string;
};

type Day = {form:number;whatsapp:number;call:number};
type Stats = {days:Record<string,Day>};

const LEADS = path.join(CONTENT_DIR,'leads.json');
const STATS = path.join(CONTENT_DIR,'stats.json');

function readJson<T>(file:string,fallback:T):T{try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch{return fallback}}
function writeJson(file:string,data:unknown){
  fs.mkdirSync(CONTENT_DIR,{recursive:true});
  const tmp=`${file}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify(data),{mode:0o600});
  fs.renameSync(tmp,file);
}

// Pakistan time, so "today" matches the owner's day.
export const dayKey=(d=new Date())=>new Date(d.getTime()+5*3600_000).toISOString().slice(0,10);

export function getLeads():Lead[]{return readJson<Lead[]>(LEADS,[]).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
export const getLead=(id:string)=>getLeads().find(l=>l.id===id);

export function addLead(input:Omit<Lead,'id'|'createdAt'|'updatedAt'|'status'|'notes'>&{status?:LeadStatus;notes?:string}){
  const now=new Date().toISOString();
  const lead:Lead={id:crypto.randomBytes(5).toString('hex'),createdAt:now,updatedAt:now,status:'new',notes:'',...input};
  const all=readJson<Lead[]>(LEADS,[]);all.push(lead);writeJson(LEADS,all);
  if(input.source==='website') bump('form');
  return lead;
}

export function updateLead(id:string,change:Partial<Lead>){
  const all=readJson<Lead[]>(LEADS,[]);const l=all.find(x=>x.id===id);if(!l) return;
  Object.assign(l,change,{updatedAt:new Date().toISOString()});writeJson(LEADS,all);
}

export function deleteLeads(ids:string[]){
  const del=new Set(ids);writeJson(LEADS,readJson<Lead[]>(LEADS,[]).filter(l=>!del.has(l.id)));
}

export function bump(kind:keyof Day){
  const s=readJson<Stats>(STATS,{days:{}});const k=dayKey();
  const d=s.days[k]||(s.days[k]={form:0,whatsapp:0,call:0});d[kind]++;
  // keep about two years of daily counts
  const keys=Object.keys(s.days).sort();for(const old of keys.slice(0,Math.max(0,keys.length-730))) delete s.days[old];
  writeJson(STATS,s);
}

export function getStats(days=30){
  const s=readJson<Stats>(STATS,{days:{}});
  const out:{day:string;form:number;whatsapp:number;call:number}[]=[];
  for(let i=days-1;i>=0;i--){const k=dayKey(new Date(Date.now()-i*86400_000));out.push({day:k,...(s.days[k]||{form:0,whatsapp:0,call:0})})}
  return out;
}

// Simple per-address limit for public endpoints.
const hits=new Map<string,{n:number;until:number}>();
export function rateLimited(key:string,max:number,windowMs:number){
  const now=Date.now();const h=hits.get(key);
  if(!h||h.until<now){hits.set(key,{n:1,until:now+windowMs});return false}
  h.n++;return h.n>max;
}
