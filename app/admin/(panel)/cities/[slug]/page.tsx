import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getContent} from '@/lib/content';
import {saveCity,deleteCity} from '../../../actions';
import {Msg,Field,type SP} from '@/components/admin/Bits';
import {ConfirmButton} from '@/components/admin/ConfirmButton';

export const metadata={title:'Edit city'};

export default async function EditCity({params,searchParams}:{params:Promise<{slug:string}>;searchParams:SP}){
  const {slug}=await params;
  const c=slug==='new'?undefined:getContent().cities.find(x=>x.slug===slug);
  if(slug!=='new'&&!c) notFound();
  return <>
    <div className="adm-top"><div><Link href="/admin/cities" className="adm-help">← All cities</Link><h1>{c?c.name:'New city'}</h1>{c&&<p>domesticstaffprovider.com/areas/{c.slug}</p>}</div>{c&&<a className="adm-btn ghost" href={`/areas/${c.slug}`} target="_blank" rel="noreferrer">View on website</a>}</div>
    <Msg searchParams={searchParams}/>
    <form action={saveCity} className="adm-card adm-form">
      <input type="hidden" name="slug" value={c?.slug||''}/>
      <Field label="City name"><input type="text" name="name" required maxLength={80} defaultValue={c?.name}/></Field>
      <Field label="Introduction" hint="Shown at the top of the city page and on the Areas page."><textarea name="intro" rows={3} maxLength={600} defaultValue={c?.intro}/></Field>
      <Field label="Neighborhoods" hint="One area per line, e.g. DHA Phase 2."><textarea name="areas" rows={8} defaultValue={c?.areas.join('\n')}/></Field>
      <div className="adm-actions"><button className="adm-btn" type="submit">Save city</button></div>
    </form>
    {c&&<form action={deleteCity}><input type="hidden" name="slug" value={c.slug}/><ConfirmButton message={`Delete ${c.name}? Its page will stop working.`}>Delete city</ConfirmButton></form>}
  </>;
}
