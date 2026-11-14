'use server';
// Everything the admin panel saves goes through here. Each action checks the login first,
// saves the content file, then refreshes the public pages so changes show immediately.
import crypto from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin,login,logout,changePassword} from '@/lib/auth';
import {getContent,updateContent,slugify,isSlug} from '@/lib/content';
import {saveImage} from '@/lib/uploads';
import {serviceIcons} from '@/data/site';
import type {Post,Service,City} from '@/data/site';
import {addLead,updateLead,deleteLeads,LEAD_STATUSES,statusLabel,type LeadStatus} from '@/lib/leads';

const str=(f:FormData,k:string,max=5000)=>String(f.get(k)??'').trim().slice(0,max);
const lines=(f:FormData,k:string)=>str(f,k,20000).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
const refresh=()=>revalidatePath('/','layout');
const back=(url:string,msg:string,kind:'saved'|'error'='saved'):never=>redirect(`${url}${url.includes('?')?'&':'?'}${kind}=${encodeURIComponent(msg)}`);

async function image(f:FormData,key:string,label:string,url:string){
  try{return await saveImage(f.get(key),label)}catch(e){return back(url,(e as Error).message,'error')}
}

/* ---------- login ---------- */
export async function loginAction(f:FormData){
  const r=await login(String(f.get('password')??''));
  if(r==='ok') redirect('/admin');
  redirect(`/admin/login?error=${r}`);
}
export async function logoutAction(){await logout();redirect('/admin/login')}

/* ---------- blog posts ---------- */
export async function savePost(f:FormData){
  await requireAdmin();
  const id=str(f,'id',40)||crypto.randomUUID().slice(0,8);
  const editUrl=`/admin/posts/${id}`;
  const title=str(f,'title',200)||'Untitled post';
  // Never reject a post after it was typed: fix the address instead of failing.
  let slug=slugify(str(f,'slug',100)||title);
  if(!isSlug(slug)) slug=`post-${id}`;
  const taken=new Set(getContent().posts.filter(p=>p.id!==id).map(p=>p.slug));
  for(let n=2,base=slug;taken.has(slug);n++) slug=`${base}-${n}`;
  let cover:string|null=null,warning='';
  try{cover=await saveImage(f.get('coverFile'),slug)}catch(e){warning=` The cover photo was not saved: ${(e as Error).message}`}
  let og:string|null=null;
  try{og=await saveImage(f.get('ogFile'),`${slug}-share`)}catch(e){warning+=` The social share image was not saved: ${(e as Error).message}`}
  const canonical=str(f,'canonical',300);
  const okCanonical=!canonical||/^(https?:\/\/|\/)/i.test(canonical);
  if(!okCanonical) warning+=' The canonical URL must start with https:// or /, so it was left empty.';
  const status=str(f,'status')==='published'?'published':'draft';
  const date=str(f,'publishedAt',10);
  const now=new Date().toISOString();
  updateContent(c=>{
    const old=c.posts.find(p=>p.id===id);
    const post:Post={
      id,slug,title,status,
      excerpt:str(f,'excerpt',400),
      body:str(f,'body',200000),
      cover:f.get('removeCover')?undefined:(cover||old?.cover),
      coverAlt:str(f,'coverAlt',200)||undefined,
      seoTitle:str(f,'seoTitle',120)||undefined,
      seoDescription:str(f,'seoDescription',300)||undefined,
      focusKeyword:str(f,'focusKeyword',100)||undefined,
      keywords:str(f,'keywords',400)||undefined,
      canonical:okCanonical?(canonical||undefined):undefined,
      noindex:f.get('noindex')?true:undefined,
      nofollow:f.get('nofollow')?true:undefined,
      ogTitle:str(f,'ogTitle',120)||undefined,
      ogDescription:str(f,'ogDescription',300)||undefined,
      ogImage:f.get('removeOg')?undefined:(og||old?.ogImage),
      category:str(f,'category',60)||undefined,
      tags:str(f,'tags',300)||undefined,
      author:str(f,'author',80)||undefined,
      publishedAt:/^\d{4}-\d{2}-\d{2}$/.test(date)?new Date(date+'T09:00:00+05:00').toISOString():(old?.publishedAt||now),
      updatedAt:now,
    };
    if(old) Object.assign(old,post); else c.posts.unshift(post);
  });
  refresh();
  if(warning) back(editUrl,(status==='published'?'Saved and published.':'Saved as draft.')+warning,'error');
  back(editUrl,status==='published'?'Saved and published.':'Saved as draft.');
}

export async function deletePost(f:FormData){
  await requireAdmin();
  const id=str(f,'id');
  updateContent(c=>{c.posts=c.posts.filter(p=>p.id!==id)});
  refresh();
  back('/admin/posts','Post deleted.');
}

/* ---------- services ---------- */
export async function saveService(f:FormData){
  await requireAdmin();
  const existing=str(f,'slug',100);
  const title=str(f,'title',120);
  const url=existing?`/admin/services/${existing}`:'/admin/services/new';
  if(!title) back(url,'Please add a service name.','error');
  const slug=existing||slugify(title)||`service-${crypto.randomBytes(3).toString('hex')}`;
  if(!existing&&getContent().services.some(s=>s.slug===slug)) back(url,`A service with the address /services/${slug} already exists.`,'error');
  const img=await image(f,'imageFile',slug,url);
  const icon=serviceIcons.includes(str(f,'icon'))?str(f,'icon'):'helper';
  updateContent(c=>{
    const old=c.services.find(s=>s.slug===slug);
    const s:Service={slug,title,icon,
      short:str(f,'short',160),description:str(f,'description',1500),
      price:str(f,'price',80)||undefined,
      image:f.get('removeImage')?undefined:(img||old?.image),
      features:lines(f,'features').slice(0,12),keywords:lines(f,'keywords').slice(0,12)};
    if(old) Object.assign(old,s); else c.services.push(s);
  });
  refresh();
  back(`/admin/services/${slug}`,'Service saved.');
}

export async function deleteService(f:FormData){
  await requireAdmin();
  const slug=str(f,'slug');
  updateContent(c=>{c.services=c.services.filter(s=>s.slug!==slug)});
  refresh();
  back('/admin/services','Service deleted.');
}

/* ---------- cities ---------- */
export async function saveCity(f:FormData){
  await requireAdmin();
  const existing=str(f,'slug',100);
  const name=str(f,'name',80);
  const url=existing?`/admin/cities/${existing}`:'/admin/cities/new';
  if(!name) back(url,'Please add a city name.','error');
  const slug=existing||slugify(name)||`city-${crypto.randomBytes(3).toString('hex')}`;
  if(!existing&&getContent().cities.some(c=>c.slug===slug)) back(url,`${name} is already in the list.`,'error');
  updateContent(c=>{
    const old=c.cities.find(x=>x.slug===slug);
    const city:City={slug,name,intro:str(f,'intro',600),areas:lines(f,'areas').slice(0,40)};
    if(old) Object.assign(old,city); else c.cities.push(city);
  });
  refresh();
  back(`/admin/cities/${slug}`,'City saved.');
}

export async function deleteCity(f:FormData){
  await requireAdmin();
  const slug=str(f,'slug');
  updateContent(c=>{c.cities=c.cities.filter(x=>x.slug!==slug)});
  refresh();
  back('/admin/cities','City deleted.');
}

/* ---------- reorder services / cities ---------- */
export async function moveItem(f:FormData){
  await requireAdmin();
  const kind=str(f,'kind')==='cities'?'cities':'services';
  const slug=str(f,'slug');const dir=str(f,'dir')==='up'?-1:1;
  updateContent(c=>{
    const list=c[kind] as {slug:string}[];
    const i=list.findIndex(x=>x.slug===slug);const j=i+dir;
    if(i<0||j<0||j>=list.length) return;
    [list[i],list[j]]=[list[j],list[i]];
  });
  refresh();
  redirect(`/admin/${kind}`);
}

/* ---------- FAQs and how-it-works steps ---------- */
export async function saveFaqs(f:FormData){
  await requireAdmin();
  const q=f.getAll('q').map(String),a=f.getAll('a').map(String),del=new Set(f.getAll('delete').map(String));
  const faqs=q.map((x,i)=>({q:x.trim().slice(0,300),a:(a[i]||'').trim().slice(0,2000)})).filter((x,i)=>x.q&&x.a&&!del.has(String(i)));
  updateContent(c=>{c.faqs=faqs});
  refresh();
  back('/admin/faqs','FAQs saved.');
}

export async function saveSteps(f:FormData){
  await requireAdmin();
  const t=f.getAll('title').map(String),b=f.getAll('body').map(String);
  const steps=t.map((x,i)=>({title:x.trim().slice(0,120),body:(b[i]||'').trim().slice(0,400)})).filter(x=>x.title);
  if(!steps.length) back('/admin/faqs','Keep at least one step.','error');
  updateContent(c=>{c.steps=steps});
  refresh();
  back('/admin/faqs','Steps saved.');
}

/* ---------- contact details and password ---------- */
export async function saveSettings(f:FormData){
  await requireAdmin();
  const digits=(s:string)=>s.replace(/\D/g,'');
  let phone=digits(str(f,'phone',30)),wa=digits(str(f,'whatsapp',30));
  const toIntl=(d:string)=>d.startsWith('92')?d:d.startsWith('0')?'92'+d.slice(1):d;
  phone=toIntl(phone);wa=toIntl(wa||phone);
  if(phone.length<11||wa.length<11) back('/admin/settings','Please enter full phone numbers, for example 0322 1223666.','error');
  const email=str(f,'email',120);
  if(email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) back('/admin/settings','That email address does not look right.','error');
  updateContent(c=>{
    c.site.phone='+'+phone;
    c.site.whatsapp=wa;
    c.site.phoneDisplay=str(f,'phoneDisplay',30)||('0'+phone.slice(2,5)+' '+phone.slice(5));
    c.site.email=email;
    c.site.office=str(f,'office',200);
    c.site.company=str(f,'company',120);
  });
  refresh();
  back('/admin/settings','Contact details saved.');
}

export async function changePasswordAction(f:FormData){
  await requireAdmin();
  const next=String(f.get('next')??''),again=String(f.get('again')??'');
  if(next!==again) back('/admin/settings','The two new passwords do not match.','error');
  const err=await changePassword(String(f.get('current')??''),next);
  if(err) back('/admin/settings',err,'error');
  back('/admin/settings','Password changed.');
}

/* ---------- leads ---------- */
export async function saveLead(f:FormData){
  await requireAdmin();
  const id=str(f,'id',20);
  const status=(LEAD_STATUSES as readonly string[]).includes(str(f,'status'))?str(f,'status') as LeadStatus:'new';
  const fields={name:str(f,'name',100),phone:str(f,'phone',30),service:str(f,'service',100),city:str(f,'city',120),arrangement:str(f,'arrangement',40),details:str(f,'details',1000),notes:str(f,'notes',5000),status};
  if(id){updateLead(id,fields);back(`/admin/leads/${id}`,'Lead saved.')}
  if(fields.phone.replace(/\D/g,'').length<7) back('/admin/leads/new','Please enter a phone number.','error');
  const lead=addLead({...fields,page:'',source:'manual'});
  back(`/admin/leads/${lead.id}`,'Contact added.');
}

export async function deleteLeadAction(f:FormData){
  await requireAdmin();
  deleteLeads([str(f,'id',20)]);
  back('/admin/leads','Lead deleted.');
}

export async function bulkLeads(f:FormData){
  await requireAdmin();
  const ids=f.getAll('ids').map(String).filter(Boolean);
  const op=str(f,'op');const keep=str(f,'return',300)||'/admin/leads';
  const url=keep.startsWith('/admin/leads')?keep:'/admin/leads';
  if(!ids.length) back(url,'Tick at least one lead first.','error');
  if(op==='delete'){deleteLeads(ids);back(url,`${ids.length} lead(s) deleted.`)}
  if((LEAD_STATUSES as readonly string[]).includes(op)){for(const id of ids) updateLead(id,{status:op as LeadStatus});back(url,`${ids.length} lead(s) marked as ${statusLabel[op as LeadStatus]}.`)}
  back(url,'Choose an action.','error');
}
