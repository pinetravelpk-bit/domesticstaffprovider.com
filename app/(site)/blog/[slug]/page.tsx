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
  const description=p.seoDescription||p.excerpt||p.body.replace(/[#*>\[\]()!_`-]/g,'').slice(0,155);
  return {title:p.seoTitle||p.title,description,alternates:{canonical:`/blog/${p.slug}`},openGraph:{type:'article',title:p.seoTitle||p.title,description,publishedTime:p.publishedAt,modifiedTime:p.updatedAt,images:p.cover?[{url:p.cover}]:undefined}};
}

export default async function BlogPost({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const p=find(slug);if(!p) notFound();
  const {site:SITE}=getContent();
  const more=publishedPosts().filter(x=>x.id!==p.id).slice(0,3);
  const jsonld={'@context':'https://schema.org','@type':'BlogPosting',headline:p.title,description:p.excerpt||undefined,image:p.cover?SITE.url+p.cover:undefined,datePublished:p.publishedAt,dateModified:p.updatedAt,mainEntityOfPage:`${SITE.url}/blog/${p.slug}`,author:{'@type':'Organization',name:SITE.brand,url:SITE.url},publisher:{'@type':'Organization',name:SITE.brand,url:SITE.url}};
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonld).replace(/</g,'\\u003c')}}/>
    <article className="blog-article">
      <header className="container blog-article-head"><Link href="/blog" className="blog-back">← All articles</Link><h1>{p.title}</h1><small>{fmt(p.publishedAt)} · {readingMinutes(p.body)} min read</small></header>
      {p.cover&&<div className="container"><img className="blog-cover" src={p.cover} alt={p.coverAlt||p.title} width={1600} height={900} fetchPriority="high"/></div>}
      <div className="container detail-grid blog-article-grid">
        <div className="blog-prose" dangerouslySetInnerHTML={{__html:renderMarkdown(p.body)}}/>
        <aside className="detail-sidebar"><div className="sidebar-form"><span className="eyebrow green">NEED STAFF?</span><h3>Tell us who you need</h3><p>Share the details. This will prepare a WhatsApp enquiry.</p><EnquiryForm/></div></aside>
      </div>
    </article>
    {more.length>0&&<section className="container blog-more"><h2>More articles</h2><div className="blog-list">{more.map(m=><Link key={m.id} href={`/blog/${m.slug}`} className="blog-card"><div className="blog-card-img"><img src={m.cover||'/images/hero-family.jpg'} alt={m.coverAlt||''} loading="lazy" width={800} height={450}/></div><div className="blog-card-body"><small>{fmt(m.publishedAt)}</small><h2>{m.title}</h2><span className="link-arrow">Read more <ArrowRight size={15}/></span></div></Link>)}</div></section>}
    <section className="container blog-more"><RelatedServices/></section>
    <InnerCTA/>
  </main>;
}
