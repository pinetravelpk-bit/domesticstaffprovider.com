'use client';
// Meta tags for a blog post: Google preview, title/description with counters, focus keyword,
// keywords, canonical, robots, social share (Open Graph / WhatsApp / Facebook) and an SEO checklist.
import {useState} from 'react';
import type {Post} from '@/data/site';

const SITE='https://domesticstaffprovider.com';

function Count({n,min,max}:{n:number;min:number;max:number}){
  const cls=n===0?'':n<min||n>max?'warn':'good';
  return <small className={`adm-count ${cls}`}>{n} / {max} characters{n>0&&n<min?' (a bit short)':n>max?' (too long, Google will cut it)':''}</small>;
}

export function SeoPanel({post,title,slug,body,excerpt,coverAlt,coverUrl}:{post?:Post;title:string;slug:string;body:string;excerpt:string;coverAlt:string;coverUrl:string}){
  const [seoTitle,setSeoTitle]=useState(post?.seoTitle||'');
  const [seoDesc,setSeoDesc]=useState(post?.seoDescription||'');
  const [kw,setKw]=useState(post?.focusKeyword||'');
  const [ogTitle,setOgTitle]=useState(post?.ogTitle||'');
  const [ogDesc,setOgDesc]=useState(post?.ogDescription||'');
  const [ogUrl,setOgUrl]=useState(post?.ogImage||'');

  const fullTitle=`${seoTitle||title||'Post title'} | Domestic Staff Provider`;
  const desc=seoDesc||excerpt||body.replace(/[#*>\[\]()!_`-]/g,'').replace(/\s+/g,' ').trim().slice(0,155);
  const k=kw.trim().toLowerCase();
  const plain=body.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/[#*>_`]/g,'');
  const firstPara=plain.split(/\n\s*\n/).find(p=>p.trim())||'';
  const words=plain.split(/\s+/).filter(Boolean).length;
  const has=(s:string)=>!!k&&s.toLowerCase().includes(k);
  const checks:[boolean,string][]=[
    [!!k,'A focus keyword is set'],
    [has(seoTitle||title),'Focus keyword is in the SEO title'],
    [has(desc),'Focus keyword is in the meta description'],
    [has(slug.replace(/-/g,' ')),'Focus keyword is in the web address'],
    [has(firstPara),'Focus keyword is in the first paragraph'],
    [(seoTitle||title).length>=30&&(seoTitle||title).length<=60,'SEO title is 30–60 characters'],
    [desc.length>=120&&desc.length<=160,'Meta description is 120–160 characters'],
    [words>=300,`Post has at least 300 words (now ${words})`],
    [/^##\s/m.test(body),'Post uses headings (## Heading)'],
    [/\]\(\/(services|areas|contact|blog)/.test(body),'Post links to another page on this site'],
    [!!coverUrl,'Cover photo is set'],
    [!coverUrl||!!coverAlt.trim(),'Cover photo has a description'],
  ];
  const score=checks.filter(c=>c[0]).length;

  return <div className="adm-card adm-form adm-seo" style={{gridColumn:'1 / -1'}}>
    <div className="adm-card-head"><h2>SEO & meta tags</h2><span className={`adm-score ${score>=10?'good':score>=7?'ok':'low'}`}>SEO score {score}/{checks.length}</span></div>

    <div className="adm-gpreview" aria-label="Google search preview">
      <small>Google preview</small>
      <div className="g-url">domesticstaffprovider.com › blog › {slug||'…'}</div>
      <div className="g-title">{fullTitle.length>62?fullTitle.slice(0,60)+'…':fullTitle}</div>
      <div className="g-desc">{desc.length>162?desc.slice(0,158)+'…':desc||'Your meta description will show here.'}</div>
    </div>

    <div className="adm-row">
      <label className="adm-field"><span>Focus keyword</span><input type="text" name="focusKeyword" maxLength={100} value={kw} onChange={e=>setKw(e.target.value)} placeholder="e.g. maid in Islamabad"/><small>The main phrase people search for. Used for the checklist below.</small></label>
      <label className="adm-field"><span>Meta keywords</span><input type="text" name="keywords" maxLength={400} defaultValue={post?.keywords||''} placeholder="hire maid Islamabad, house maid salary"/><small>Separate with commas.</small></label>
    </div>
    <label className="adm-field"><span>SEO title (meta title)</span><input type="text" name="seoTitle" maxLength={120} value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} placeholder={title||'Leave empty to use the post title'}/><Count n={(seoTitle||title).length} min={30} max={60}/></label>
    <label className="adm-field"><span>Meta description</span><textarea name="seoDescription" rows={3} maxLength={300} value={seoDesc} onChange={e=>setSeoDesc(e.target.value)} placeholder="Leave empty to use the short summary."/><Count n={desc.length} min={120} max={160}/></label>
    <div className="adm-row">
      <label className="adm-field"><span>Canonical URL</span><input type="text" name="canonical" maxLength={300} defaultValue={post?.canonical||''} placeholder={`${SITE}/blog/${slug||'…'}`}/><small>Leave empty (recommended). Only set it if this post was first published on another site.</small></label>
      <div className="adm-field"><span>Search engines</span>
        <label className="adm-check"><input type="checkbox" name="noindex" defaultChecked={!!post?.noindex}/> Hide this post from Google (noindex)</label>
        <label className="adm-check"><input type="checkbox" name="nofollow" defaultChecked={!!post?.nofollow}/> Don’t follow links in this post (nofollow)</label>
      </div>
    </div>

    <h3 className="adm-sub">Social sharing (WhatsApp, Facebook, LinkedIn, X)</h3>
    <div className="adm-row">
      <div className="adm-form">
        <label className="adm-field"><span>Share title (og:title)</span><input type="text" name="ogTitle" maxLength={120} value={ogTitle} onChange={e=>setOgTitle(e.target.value)} placeholder={seoTitle||title||'Leave empty to use the SEO title'}/></label>
        <label className="adm-field"><span>Share description (og:description)</span><textarea name="ogDescription" rows={3} maxLength={300} value={ogDesc} onChange={e=>setOgDesc(e.target.value)} placeholder="Leave empty to use the meta description."/></label>
        <div className="adm-field"><span>Share image (og:image)</span>
          <input type="file" name="ogFile" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)setOgUrl(URL.createObjectURL(f))}}/>
          {post?.ogImage&&<label className="adm-check"><input type="checkbox" name="removeOg"/> Remove share image</label>}
          <small>Leave empty to use the cover photo. Best size 1200 × 630.</small>
        </div>
      </div>
      <div className="adm-sharecard" aria-label="Share preview">
        <small>Share preview</small>
        <div className="sc-img">{(ogUrl||coverUrl)?<img src={ogUrl||coverUrl} alt=""/>:<span>No image</span>}</div>
        <div className="sc-body"><div className="sc-site">DOMESTICSTAFFPROVIDER.COM</div><div className="sc-title">{ogTitle||seoTitle||title||'Post title'}</div><div className="sc-desc">{ogDesc||desc}</div></div>
      </div>
    </div>

    <h3 className="adm-sub">SEO checklist</h3>
    <ul className="adm-checklist">{checks.map(([ok,label])=><li key={label} className={ok?'ok':''}>{ok?'✓':'○'} {label}</li>)}</ul>
  </div>;
}
