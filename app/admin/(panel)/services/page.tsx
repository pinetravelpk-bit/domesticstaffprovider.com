import Link from 'next/link';
import {Plus,ArrowUp,ArrowDown} from 'lucide-react';
import {getContent} from '@/lib/content';
import {moveItem} from '../../actions';
import {Msg,type SP} from '@/components/admin/Bits';

export const metadata={title:'Services'};

export default function Services({searchParams}:{searchParams:SP}){
  const services=getContent().services;
  return <>
    <div className="adm-top"><div><h1>Services</h1><p>The order here is the order on the website and in the menu.</p></div><Link className="adm-btn" href="/admin/services/new"><Plus size={16}/>Add service</Link></div>
    <Msg searchParams={searchParams}/>
    <div className="adm-card"><table className="adm-table"><thead><tr><th></th><th>Service</th><th className="hide-sm">Price</th><th></th></tr></thead><tbody>
      {services.map((s,i)=><tr key={s.slug}>
        <td>{s.image?<img className="adm-thumb" src={s.image} alt=""/>:<span className="adm-thumb"/>}</td>
        <td><Link href={`/admin/services/${s.slug}`}><b>{s.title}</b></Link><div className="adm-help" style={{margin:0}}>{s.short}</div></td>
        <td className="hide-sm">{s.price||'—'}</td>
        <td className="act">
          <form action={moveItem}><input type="hidden" name="kind" value="services"/><input type="hidden" name="slug" value={s.slug}/><input type="hidden" name="dir" value="up"/><button className="adm-btn ghost sm" disabled={i===0} aria-label="Move up"><ArrowUp size={13}/></button></form>
          <form action={moveItem}><input type="hidden" name="kind" value="services"/><input type="hidden" name="slug" value={s.slug}/><input type="hidden" name="dir" value="down"/><button className="adm-btn ghost sm" disabled={i===services.length-1} aria-label="Move down"><ArrowDown size={13}/></button></form>
          <Link className="adm-btn ghost sm" href={`/admin/services/${s.slug}`}>Edit</Link>
        </td>
      </tr>)}
    </tbody></table></div>
  </>;
}
