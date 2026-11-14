import Link from 'next/link';
import {Plus,ArrowUp,ArrowDown} from 'lucide-react';
import {getContent} from '@/lib/content';
import {moveItem} from '../../actions';
import {Msg,type SP} from '@/components/admin/Bits';

export const metadata={title:'Cities'};

export default function Cities({searchParams}:{searchParams:SP}){
  const cities=getContent().cities;
  return <>
    <div className="adm-top"><div><h1>Cities</h1><p>Each city has its own page under /areas. The first five appear in the footer.</p></div><Link className="adm-btn" href="/admin/cities/new"><Plus size={16}/>Add city</Link></div>
    <Msg searchParams={searchParams}/>
    <div className="adm-card"><table className="adm-table"><thead><tr><th>City</th><th className="hide-sm">Areas</th><th></th></tr></thead><tbody>
      {cities.map((c,i)=><tr key={c.slug}>
        <td><Link href={`/admin/cities/${c.slug}`}><b>{c.name}</b></Link><div className="adm-help" style={{margin:0}}>{c.intro}</div></td>
        <td className="hide-sm">{c.areas.length}</td>
        <td className="act">
          <form action={moveItem}><input type="hidden" name="kind" value="cities"/><input type="hidden" name="slug" value={c.slug}/><input type="hidden" name="dir" value="up"/><button className="adm-btn ghost sm" disabled={i===0} aria-label="Move up"><ArrowUp size={13}/></button></form>
          <form action={moveItem}><input type="hidden" name="kind" value="cities"/><input type="hidden" name="slug" value={c.slug}/><input type="hidden" name="dir" value="down"/><button className="adm-btn ghost sm" disabled={i===cities.length-1} aria-label="Move down"><ArrowDown size={13}/></button></form>
          <Link className="adm-btn ghost sm" href={`/admin/cities/${c.slug}`}>Edit</Link>
        </td>
      </tr>)}
    </tbody></table></div>
  </>;
}
