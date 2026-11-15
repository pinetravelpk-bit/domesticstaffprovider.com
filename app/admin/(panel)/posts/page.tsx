import Link from 'next/link';
import {Plus,ExternalLink} from 'lucide-react';
import {getContent,isScheduled} from '@/lib/content';
import {Msg,type SP} from '@/components/admin/Bits';

export const metadata={title:'Blog posts'};

export default function Posts({searchParams}:{searchParams:SP}){
  const posts=[...getContent().posts].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  return <>
    <div className="adm-top"><div><h1>Blog posts</h1><p>{posts.length} post{posts.length===1?'':'s'}{posts.some(isScheduled)?` · ${posts.filter(isScheduled).length} scheduled`:''}</p></div><Link className="adm-btn" href="/admin/posts/new"><Plus size={16}/>New post</Link></div>
    <Msg searchParams={searchParams}/>
    <div className="adm-card">
      {posts.length?<table className="adm-table"><thead><tr><th></th><th>Title</th><th>Status</th><th className="hide-sm">Date</th><th></th></tr></thead><tbody>
        {posts.map(p=><tr key={p.id}>
          <td>{p.cover?<img className="adm-thumb" src={p.cover} alt=""/>:<span className="adm-thumb"/>}</td>
          <td><Link href={`/admin/posts/${p.id}`}><b>{p.title}</b></Link><div className="adm-help" style={{margin:0}}>/blog/{p.slug}</div></td>
          <td><span className={`adm-tag ${p.status==='draft'?'draft':isScheduled(p)?'sched':''}`}>{p.status==='draft'?'Draft':isScheduled(p)?'Scheduled':'Published'}</span></td>
          <td className="hide-sm">{new Date(p.publishedAt).toLocaleString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',timeZone:'Asia/Karachi'})}</td>
          <td className="act"><Link className="adm-btn ghost sm" href={`/admin/posts/${p.id}`}>Edit</Link>{p.status==='published'&&!isScheduled(p)&&<a className="adm-btn ghost sm" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" aria-label="View post"><ExternalLink size={13}/></a>}</td>
        </tr>)}
      </tbody></table>:<p className="adm-empty">No posts yet. <Link href="/admin/posts/new">Write your first post</Link>.</p>}
    </div>
  </>;
}
