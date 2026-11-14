import Link from 'next/link';
import {notFound} from 'next/navigation';
import {MessageCircle,Phone} from 'lucide-react';
import {getLead,LEAD_STATUSES,statusLabel} from '@/lib/leads';
import {getContent} from '@/lib/content';
import {saveLead,deleteLeadAction} from '../../../actions';
import {Msg,Field,type SP} from '@/components/admin/Bits';
import {ConfirmButton} from '@/components/admin/ConfirmButton';
import {waNumber,fmtDateTime} from '@/components/admin/format';

export const metadata={title:'Lead'};

export default async function LeadPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:SP}){
  const {id}=await params;
  const l=id==='new'?undefined:getLead(id);
  if(id!=='new'&&!l) notFound();
  const {services,cities}=getContent();
  return <>
    <div className="adm-top"><div><Link href="/admin/leads" className="adm-help">← All leads</Link><h1>{l?(l.name||l.phone):'Add contact'}</h1>{l&&<p>{l.source==='website'?`Sent from the website${l.page?` (${l.page})`:''}`:'Added by you'} · {fmtDateTime(l.createdAt)}</p>}</div>
      {l&&<div className="adm-actions"><a className="adm-btn" href={`https://wa.me/${waNumber(l.phone)}`} target="_blank" rel="noreferrer"><MessageCircle size={15}/>WhatsApp</a><a className="adm-btn ghost" href={`tel:${l.phone.replace(/[^\d+]/g,'')}`}><Phone size={15}/>Call</a></div>}</div>
    <Msg searchParams={searchParams}/>
    <form action={saveLead} className="adm-split">
      <input type="hidden" name="id" value={l?.id||''}/>
      <div className="adm-card adm-form">
        <div className="adm-row">
          <Field label="Name"><input type="text" name="name" maxLength={100} defaultValue={l?.name}/></Field>
          <Field label="Phone / WhatsApp"><input type="tel" name="phone" required maxLength={30} defaultValue={l?.phone}/></Field>
        </div>
        <div className="adm-row">
          <Field label="Staff required"><input type="text" name="service" maxLength={100} defaultValue={l?.service} list="svc"/><datalist id="svc">{services.map(s=><option key={s.slug} value={s.title}/>)}</datalist></Field>
          <Field label="City / area"><input type="text" name="city" maxLength={120} defaultValue={l?.city} list="cty"/><datalist id="cty">{cities.map(c=><option key={c.slug} value={c.name}/>)}</datalist></Field>
        </div>
        <Field label="Working arrangement"><input type="text" name="arrangement" maxLength={40} defaultValue={l?.arrangement} placeholder="Full-time, part-time, live-in…"/></Field>
        <Field label="Their message / requirements"><textarea name="details" rows={4} maxLength={1000} defaultValue={l?.details}/></Field>
      </div>
      <div className="adm-card adm-form">
        <Field label="Status"><select name="status" defaultValue={l?.status||'new'}>{LEAD_STATUSES.map(s=><option key={s} value={s}>{statusLabel[s]}</option>)}</select></Field>
        <Field label="Your notes" hint="Only visible here. e.g. called on Monday, wants a cook from December."><textarea name="notes" rows={8} maxLength={5000} defaultValue={l?.notes}/></Field>
        <button className="adm-btn" type="submit">{l?'Save':'Add contact'}</button>
      </div>
    </form>
    {l&&<form action={deleteLeadAction} style={{marginTop:6}}><input type="hidden" name="id" value={l.id}/><ConfirmButton message="Delete this lead? This cannot be undone.">Delete lead</ConfirmButton></form>}
  </>;
}
