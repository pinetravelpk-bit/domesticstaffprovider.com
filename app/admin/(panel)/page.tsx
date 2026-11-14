import Link from 'next/link';
import {Plus} from 'lucide-react';
import {getContent} from '@/lib/content';

export const metadata={title:'Dashboard'};

export default function Dashboard(){
  const c=getContent();
  const published=c.posts.filter(p=>p.status==='published').length;
  const recent=[...c.posts].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,5);
  return <>
    <div className="adm-top"><div><h1>Welcome back</h1><p>Manage the blog and the main content of your website.</p></div><Link className="adm-btn" href="/admin/posts/new"><Plus size={16}/>New blog post</Link></div>
    <div className="adm-grid">
      <Link className="adm-stat" href="/admin/posts"><strong>{published}</strong><span>Published posts{c.posts.length>published?` · ${c.posts.length-published} draft`:''}</span></Link>
      <Link className="adm-stat" href="/admin/services"><strong>{c.services.length}</strong><span>Services</span></Link>
      <Link className="adm-stat" href="/admin/cities"><strong>{c.cities.length}</strong><span>Cities</span></Link>
      <Link className="adm-stat" href="/admin/faqs"><strong>{c.faqs.length}</strong><span>FAQs</span></Link>
    </div>
    <div className="adm-card"><h2>Recently edited posts</h2>
      {recent.length?<table className="adm-table"><tbody>{recent.map(p=><tr key={p.id}><td><Link href={`/admin/posts/${p.id}`}><b>{p.title}</b></Link></td><td><span className={`adm-tag ${p.status==='draft'?'draft':''}`}>{p.status==='draft'?'Draft':'Published'}</span></td><td className="hide-sm">{new Date(p.updatedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</td></tr>)}</tbody></table>
      :<p className="adm-empty">No posts yet. <Link href="/admin/posts/new">Write your first post</Link>.</p>}
    </div>
    <div className="adm-card"><h2>Tips</h2><p className="adm-help">Changes go live as soon as you press Save. Drafts are only visible here. Every save keeps a backup copy on the server, so mistakes can be undone if needed.</p></div>
  </>;
}
