import Link from 'next/link';
import {Plus,MessageCircle,Phone,FileText,Users} from 'lucide-react';
import {getContent,isLive} from '@/lib/content';
import {getLeads,getStats,statusLabel,dayKey} from '@/lib/leads';
import {fmtDateTime,fmtDate} from '@/components/admin/format';

export const metadata={title:'Dashboard'};

function top(values:string[],n=5){
  const m=new Map<string,number>();for(const v of values){const k=v.trim();if(k)m.set(k,(m.get(k)||0)+1)}
  return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,n);
}

// 30-day bar chart: enquiry forms, WhatsApp clicks and calls per day.
function Chart({data}:{data:{day:string;form:number;whatsapp:number;call:number}[]}){
  const W=720,H=180,pad=24,bw=(W-pad)/data.length;
  const max=Math.max(4,...data.map(d=>d.form+d.whatsapp+d.call));
  const y=(v:number)=>(H-20)*v/max;
  return <svg viewBox={`0 0 ${W} ${H+18}`} className="adm-chart" role="img" aria-label="Enquiries, WhatsApp clicks and calls per day for the last 30 days">
    {[0,.5,1].map(t=><g key={t}><line x1={pad} x2={W} y1={H-y(max*t)} y2={H-y(max*t)} className="grid"/><text x={0} y={H-y(max*t)+4} className="lbl">{Math.round(max*t)}</text></g>)}
    {data.map((d,i)=>{const x=pad+i*bw+2,w=Math.max(2,bw-4);let base=H;
      const seg=(v:number,cls:string)=>{if(!v)return null;const h=y(v);base-=h;return <rect key={cls} x={x} y={base} width={w} height={h} rx={2} className={cls}><title>{`${fmtDate(d.day+'T12:00:00Z')}: ${d.form} forms, ${d.whatsapp} WhatsApp, ${d.call} calls`}</title></rect>};
      return <g key={d.day}>{seg(d.form,'s-form')}{seg(d.whatsapp,'s-wa')}{seg(d.call,'s-call')}{i%5===0&&<text x={x} y={H+14} className="lbl">{d.day.slice(8)}/{d.day.slice(5,7)}</text>}</g>})}
  </svg>;
}

export default function Dashboard(){
  const c=getContent();
  const leads=getLeads();
  const stats=getStats(30);
  const today=dayKey();
  const since=(days:number)=>Date.now()-days*86400_000;
  const lead7=leads.filter(l=>Date.parse(l.createdAt)>since(7)).length;
  const lead30=leads.filter(l=>Date.parse(l.createdAt)>since(30));
  const leadToday=leads.filter(l=>dayKey(new Date(l.createdAt))===today).length;
  const newCount=leads.filter(l=>l.status==='new').length;
  const hired=leads.filter(l=>l.status==='hired').length;
  const wa30=stats.reduce((s,d)=>s+d.whatsapp,0),call30=stats.reduce((s,d)=>s+d.call,0);
  const published=c.posts.filter(isLive).length;
  const topServices=top(lead30.map(l=>l.service)),topCities=top(lead30.map(l=>l.city.split(',').pop()||''));
  const bars=(rows:[string,number][])=>{const m=Math.max(1,...rows.map(r=>r[1]));return rows.length?<div className="adm-bars">{rows.map(([k,v])=><div key={k}><span>{k}</span><i style={{width:`${(v/m)*100}%`}}/><b>{v}</b></div>)}</div>:<p className="adm-empty" style={{padding:16}}>No leads in the last 30 days yet.</p>};
  return <>
    <div className="adm-top"><div><h1>Dashboard</h1><p>Enquiries, contact clicks and website content at a glance.</p></div><div className="adm-actions"><Link className="adm-btn ghost" href="/admin/leads/new"><Users size={15}/>Add contact</Link><Link className="adm-btn" href="/admin/posts/new"><Plus size={16}/>New blog post</Link></div></div>
    <div className="adm-grid adm-grid-6">
      <Link className={`adm-stat ${newCount?'hot':''}`} href="/admin/leads?status=new"><strong>{newCount}</strong><span>New leads to answer</span></Link>
      <Link className="adm-stat" href="/admin/leads"><strong>{leadToday}</strong><span>Leads today</span></Link>
      <Link className="adm-stat" href="/admin/leads"><strong>{lead7}</strong><span>Leads, last 7 days</span></Link>
      <Link className="adm-stat" href="/admin/leads"><strong>{lead30.length}</strong><span>Leads, last 30 days</span></Link>
      <div className="adm-stat"><strong><MessageCircle size={18}/> {wa30}</strong><span>WhatsApp clicks, 30 days</span></div>
      <div className="adm-stat"><strong><Phone size={18}/> {call30}</strong><span>Call clicks, 30 days</span></div>
    </div>
    <div className="adm-card"><div className="adm-card-head"><h2>Last 30 days</h2><div className="adm-legend"><span className="s-form">Enquiry forms</span><span className="s-wa">WhatsApp clicks</span><span className="s-call">Call clicks</span></div></div><Chart data={stats}/></div>
    <div className="adm-two">
      <div className="adm-card"><h2>Most requested staff (30 days)</h2>{bars(topServices)}</div>
      <div className="adm-card"><h2>Top cities (30 days)</h2>{bars(topCities)}</div>
    </div>
    <div className="adm-card"><div className="adm-card-head"><h2>Latest leads</h2><Link href="/admin/leads" className="adm-help">See all {leads.length} →</Link></div>
      {leads.length?<table className="adm-table"><tbody>{leads.slice(0,6).map(l=><tr key={l.id} className={l.status==='new'?'adm-row-new':''}><td className="adm-nowrap">{fmtDateTime(l.createdAt)}</td><td><Link href={`/admin/leads/${l.id}`}><b>{l.name||l.phone}</b></Link><div className="adm-help" style={{margin:0}}>{[l.service,l.city].filter(Boolean).join(' · ')}</div></td><td><span className={`adm-tag st-${l.status}`}>{statusLabel[l.status]}</span></td></tr>)}</tbody></table>
      :<p className="adm-empty">No leads yet. Enquiries sent from the website form will appear here.</p>}
    </div>
    <div className="adm-grid">
      <Link className="adm-stat" href="/admin/posts"><strong><FileText size={18}/> {published}</strong><span>Published posts{c.posts.length>published?` · ${c.posts.length-published} draft`:''}</span></Link>
      <Link className="adm-stat" href="/admin/services"><strong>{c.services.length}</strong><span>Services</span></Link>
      <Link className="adm-stat" href="/admin/cities"><strong>{c.cities.length}</strong><span>Cities</span></Link>
      <div className="adm-stat"><strong>{hired}</strong><span>Leads marked hired (all time)</span></div>
    </div>
  </>;
}
