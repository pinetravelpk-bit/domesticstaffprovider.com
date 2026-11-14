import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getContent,publishedPosts} from '@/lib/content';
import {renderMarkdown,readingMinutes} from '@/lib/markdown';
import {ArrowRight} from '@/components/UI';
import {InnerCTA,RelatedServices} from '@/components/InnerLayout';
import EnquiryForm from '@/components/EnquiryForm';

const fmt=(d:string)=>new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const find=(slug:string)=>publishedPosts().find(p=>p.slug===slug);

export function generateStaticParams(){return publishedPosts().map(p=>({slug:p.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const p=find(slug);if(!p) return {};
  const description=p.seoDescription||p.excerpt||p.body.replace(/[#*>\[\]()!_`-]/g,'').replace(/\s+/g,' ').trim().slice(0,155);
  const title=p.seoTitle||p.title;
  const shareTitle=p.ogTitle||title,shareDesc=p.ogDescription||description,shareImg=p.ogImage||p.cover;
  const tags=(p.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
  return {
    title,description,
    keywords:[...(p.focusKeyword?[p.focusKeyword]:[]),...(p.keywords||'').split(',').map(k=>k.trim()).filter(Boolean)],
    authors:[{name:p.author||'Domestic Staff Provider'}],
    category:p.category,
    alternates:{canonical:p.canonical||`/blog/${p.slug}`},
    robots:{index:!p.noindex,follow:!p.nofollow,googleBot:{index:!p.noindex,follow:!p.nofollow,'max-image-preview':'large'}},
    openGraph:{type:'article',title:shareTitle,description:shareDesc,url:`/blog/${p.slug}`,siteName:'Domestic Staff Provider',locale:'en_PK',publishedTime:p.publishedAt,modifiedTime:p.updatedAt,authors:[p.author||'Domestic Staff Provider'],section:p.category,tags,images:shareImg?[{url:shareImg,alt:p.coverAlt||p.title}]:undefined},
    twitter:{card:'summary_large_image',title:shareTitle,description:shareDesc,images:shareImg?[shareImg]:undefined},
  };
}

export default async function BlogPost({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const p=find(slug);if(!p) notFound();
  const {site:SITE}=getContent();
  const more=publishedPosts().filter(x=>x.id!==p.id).slice(0,3);
  const jsonld={'@context':'https://schema.org','@type':'BlogPosting',headline:p.title,description:p.excerpt||undefined,image:p.cover?SITE.url+p.cover:undefined,datePublished:p.publishedAt,dateModified:p.updatedAt,mainEntityOfPage:`${SITE.url}/blog/${p.slug}`,keywords:[p.focusKeyword,p.keywords,p.tags].filter(Boolean).join(', ')||undefined,articleSection:p.category,author:p.author?{'@type':'Person',name:p.author}:{'@type':'Organization',name:SITE.brand,url:SITE.url},publisher:{'@type':'Organization',name:SITE.brand,url:SITE.url}};
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonld).replace(/</g,'\\u003c')}}/>
    <article className="blog-article">
      <header className="container blog-article-head"><Link href="/blog" className="blog-back">← All articles</Link>{p.category&&<span className="blog-cat">{p.category}</span>}<h1>{p.title}</h1><small>{fmt(p.publishedAt)} · {readingMinutes(p.body)} min read{p.author?` · By ${p.author}`:''}</small></header>
      {p.cover&&<div className="container"><img className="blog-cover" src={p.cover} alt={p.coverAlt||p.title} width={1600} height={900} fetchPriority="high"/></div>}
      <div className="container detail-grid blog-article-grid">
        <div><div className={`blog-prose${p.nofollow?' nofollow':''}`} dangerouslySetInnerHTML={{__html:renderMarkdown(p.body,{nofollow:!!p.nofollow})}}/>{p.tags&&<div className="blog-tags">{p.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=><span key={t}>#{t}</span>)}</div>}</div>
        <aside className="detail-sidebar"><div className="sidebar-form"><span className="eyebrow green">NEED STAFF?</span><h3>Tell us who you need</h3><p>Share the details. This will prepare a WhatsApp enquiry.</p><EnquiryForm/></div></aside>
      </div>
    </article>
    {more.length>0&&<section className="container blog-more"><h2>More articles</h2><div className="blog-list">{more.map(m=><Link key={m.id} href={`/blog/${m.slug}`} className="blog-card"><div className="blog-card-img"><img src={m.cover||'/images/hero-family.jpg'} alt={m.coverAlt||''} loading="lazy" width={800} height={450}/></div><div className="blog-card-body"><small>{fmt(m.publishedAt)}</small><h2>{m.title}</h2><span className="link-arrow">Read more <ArrowRight size={15}/></span></div></Link>)}</div></section>}
    <section className="container blog-more"><RelatedServices/></section>
    <InnerCTA/>
  </main>;
}
