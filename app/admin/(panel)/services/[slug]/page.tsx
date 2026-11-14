import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getContent} from '@/lib/content';
import {serviceIcons} from '@/data/site';
import {saveService,deleteService} from '../../../actions';
import {Msg,Field,ImagePick,type SP} from '@/components/admin/Bits';
import {ConfirmButton} from '@/components/admin/ConfirmButton';

export const metadata={title:'Edit service'};
const iconNames:Record<string,string>={maid:'Sparkle (maids)',chef:'Cooking pot',driver:'Car',nurse:'Stethoscope',baby:'Baby',heart:'Heart & hands',clean:'Spray bottle',couple:'Two people',helper:'Helping hand',shield:'Shield',garden:'Tree',briefcase:'Briefcase'};

export default async function EditService({params,searchParams}:{params:Promise<{slug:string}>;searchParams:SP}){
  const {slug}=await params;
  const s=slug==='new'?undefined:getContent().services.find(x=>x.slug===slug);
  if(slug!=='new'&&!s) notFound();
  return <>
    <div className="adm-top"><div><Link href="/admin/services" className="adm-help">← All services</Link><h1>{s?s.title:'New service'}</h1>{s&&<p>domesticstaffprovider.com/services/{s.slug}</p>}</div>{s&&<a className="adm-btn ghost" href={`/services/${s.slug}`} target="_blank" rel="noreferrer">View on website</a>}</div>
    <Msg searchParams={searchParams}/>
    <form action={saveService} className="adm-card adm-form">
      <input type="hidden" name="slug" value={s?.slug||''}/>
      <div className="adm-row">
        <Field label="Service name"><input type="text" name="title" required maxLength={120} defaultValue={s?.title}/></Field>
        <Field label="Starting price" hint="Optional, e.g. From Rs. 40,000/mo. Leave empty to show “Request a quote”."><input type="text" name="price" maxLength={80} defaultValue={s?.price}/></Field>
      </div>
      <Field label="One-line summary" hint="Shown on cards and in the menu."><input type="text" name="short" maxLength={160} defaultValue={s?.short}/></Field>
      <Field label="Description" hint="Shown at the top of the service page."><textarea name="description" rows={4} maxLength={1500} defaultValue={s?.description}/></Field>
      <div className="adm-row">
        <Field label="What we help with" hint="One point per line."><textarea name="features" rows={5} defaultValue={s?.features.join('\n')}/></Field>
        <Field label="Search keywords" hint="One per line. Used for Google, not shown on the page."><textarea name="keywords" rows={5} defaultValue={s?.keywords.join('\n')}/></Field>
      </div>
      <div className="adm-row">
        <ImagePick name="imageFile" removeName="removeImage" current={s?.image}/>
        <Field label="Icon"><select name="icon" defaultValue={s?.icon||'helper'}>{serviceIcons.map(i=><option key={i} value={i}>{iconNames[i]||i}</option>)}</select></Field>
      </div>
      <div className="adm-actions"><button className="adm-btn" type="submit">Save service</button></div>
    </form>
    {s&&<form action={deleteService}><input type="hidden" name="slug" value={s.slug}/><ConfirmButton message={`Delete “${s.title}”? Its page will stop working.`}>Delete service</ConfirmButton></form>}
  </>;
}
