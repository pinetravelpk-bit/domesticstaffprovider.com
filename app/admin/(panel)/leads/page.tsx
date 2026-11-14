import Link from 'next/link';
import {Plus,Download,MessageCircle,Phone} from 'lucide-react';
import {getLeads,LEAD_STATUSES,statusLabel,type LeadStatus} from '@/lib/leads';
import {bulkLeads} from '../../actions';
import {Msg,type SP} from '@/components/admin/Bits';
import {waNumber,fmtDateTime} from '@/components/admin/format';

export const metadata={title:'Leads'};

export default async function Leads({searchParams}:{searchParams:SP}){
  const sp=await searchParams;
  const q=typeof sp.q==='string'?sp.q.trim():'';
  const status=typeof sp.status==='string'&&(LEAD_STATUSES as readonly string[]).includes(sp.status)?sp.status as LeadStatus:'';
  const all=getLeads();
  const counts=Object.fromEntries(LEAD_STATUSES.map(s=>[s,all.filter(l=>l.status===s).length]));
  const needle=q.toLowerCase();
  const list=all.filter(l=>(!status||l.status===status)&&(!needle||[l.name,l.phone,l.service,l.city,l.details,l.notes].join(' ').toLowerCase().includes(needle)));
  const qs=new URLSearchParams({...(q?{q}:{}),...(status?{status}:{})}).toString();
  const here=qs?`/admin/leads?${qs}`:'/admin/leads';
  const tab=(s:string,label:string,n:number)=><Link key={s} href={`/admin/leads?${new URLSearchParams({...(q?{q}:{}),...(s?{status:s}:{})})}`} className={`adm-tab ${status===s?'on':''}`}>{label} <b>{n}</b></Link>;
  return <>
    <div className="adm-top"><div><h1>Leads & contacts</h1><p>Every enquiry sent from the website form is saved here. Add phone or walk-in enquiries yourself.</p></div>
      <div className="adm-actions"><a className="adm-btn ghost" href="/admin/leads-export"><Download size={15}/>Download Excel (CSV)</a><Link className="adm-btn" href="/admin/leads/new"><Plus size={16}/>Add contact</Link></div></div>
    <Msg searchParams={searchParams}/>
    <div className="adm-tabs">{tab('','All',all.length)}{LEAD_STATUSES.map(s=>tab(s,statusLabel[s],counts[s]))}</div>
    <form className="adm-search" action="/admin/leads">{status&&<input type="hidden" name="status" value={status}/>}<input type="text" name="q" defaultValue={q} placeholder="Search name, phone, service, city…"/><button className="adm-btn ghost" type="submit">Search</button>{q&&<Link className="adm-btn ghost" href={status?`/admin/leads?status=${status}`:'/admin/leads'}>Clear</Link>}</form>
    <form action={bulkLeads} className="adm-card">
      <input type="hidden" name="return" value={here}/>
      {list.length?<>
        <div className="adm-bulk"><span>With ticked leads:</span><select name="op" defaultValue=""><option value="" disabled>Choose…</option>{LEAD_STATUSES.map(s=><option key={s} value={s}>Mark as {statusLabel[s]}</option>)}<option value="delete">Delete</option></select><button className="adm-btn ghost sm" type="submit">Apply</button></div>
        <table className="adm-table"><thead><tr><th></th><th>Date</th><th>Name & phone</th><th className="hide-sm">Service</th><th className="hide-sm">City / area</th><th>Status</th><th></th></tr></thead><tbody>
        {list.map(l=><tr key={l.id} className={l.status==='new'?'adm-row-new':''}>
          <td><input type="checkbox" name="ids" value={l.id} aria-label={`Select ${l.name||l.phone}`}/></td>
          <td className="adm-nowrap">{fmtDateTime(l.createdAt)}{l.source==='manual'&&<div className="adm-help" style={{margin:0}}>Added by you</div>}</td>
          <td><Link href={`/admin/leads/${l.id}`}><b>{l.name||'(no name)'}</b></Link><div className="adm-help" style={{margin:0}}>{l.phone}</div></td>
          <td className="hide-sm">{l.service||'—'}</td>
          <td className="hide-sm">{l.city||'—'}</td>
          <td><span className={`adm-tag st-${l.status}`}>{statusLabel[l.status]}</span></td>
          <td className="act"><a className="adm-btn ghost sm" href={`https://wa.me/${waNumber(l.phone)}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={13}/></a><a className="adm-btn ghost sm" href={`tel:${l.phone.replace(/[^\d+]/g,'')}`} aria-label="Call"><Phone size={13}/></a><Link className="adm-btn ghost sm" href={`/admin/leads/${l.id}`}>Open</Link></td>
        </tr>)}
        </tbody></table></>
      :<p className="adm-empty">{all.length?'No leads match this filter.':'No leads yet. When someone sends the enquiry form on the website, it appears here.'}</p>}
    </form>
  </>;
}
