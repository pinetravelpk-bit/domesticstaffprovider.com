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
const plain=(md:string)=>md.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/[#*>_`|]/g,'').replace(/\s+/g,' ').trim();
// Questions under a "Frequently asked questions" / "FAQ" heading, written as ### Question + answer,
// become FAQ rich-result data for Google and AI answer engines.
function faqsOf(body:string){
  const lines=body.split(/\r?\n/);
  const start=lines.findIndex(l=>/^##\s/.test(l)&&/frequently asked|\bfaqs?\b/i.test(l));
  if(start<0) return [];
  const out:{q:string;a:string}[]=[];
  for(let i=start+1;i<lines.length&&!/^##\s/.test(lines[i]);i++){
    if(/^###\s/.test(lines[i])) out.push({q:plain(lines[i].replace(/^###\s+/,'')),a:''});
    else if(out.length) out[out.length-1].a+=' '+lines[i];
  }
  return out.map(f=>({q:f.q,a:plain(f.a)})).filter(f=>f.q&&f.a);
}
const REGION:Record<string,string>={'punjab':'PK-PB','sindh':'PK-SD','khyber pakhtunkhwa':'PK-KP','balochistan':'PK-BA','islamabad capital territory':'PK-IS','gilgit-baltistan':'PK-GB','azad jammu and kashmir':'PK-JK','azad kashmir':'PK-JK'};

// Pages are rebuilt every 5 minutes, so scheduled posts appear (and stop 404ing) on time.
export const revalidate=300;
export const dynamicParams=true;

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
    other:p.locality?{'geo.placename':[p.locality,p.region,'Pakistan'].filter(Boolean).join(', '),'geo.region':REGION[(p.region||'').toLowerCase()]||'PK'}:undefined,
  };
}

export default async function BlogPost({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const p=find(slug);if(!p) notFound();
  const {site:SITE}=getContent();
  const more=publishedPosts().filter(x=>x.id!==p.id).slice(0,3);
  const url=`${SITE.url}/blog/${p.slug}`;
  const place=p.locality?{'@type':'Place',name:[p.locality,p.region].filter(Boolean).join(', '),address:{'@type':'PostalAddress',addressLocality:p.locality,addressRegion:p.region||undefined,addressCountry:'PK'}}:undefined;
  const org={'@type':'Organization','@id':`${SITE.url}/#organization`,name:SITE.brand,url:SITE.url,telephone:SITE.phone||undefined};
  const faqs=faqsOf(p.body);
  const graph:Record<string,unknown>[]=[
    {'@type':'BlogPosting','@id':`${url}#article`,headline:p.title,description:p.seoDescription||p.excerpt||undefined,image:p.cover?{'@type':'ImageObject',url:SITE.url+p.cover,caption:p.coverAlt||p.title,width:1600,height:900}:undefined,datePublished:p.publishedAt,dateModified:p.updatedAt,inLanguage:'en-PK',wordCount:p.body.split(/\s+/).length,mainEntityOfPage:url,keywords:[p.focusKeyword,p.keywords,p.tags].filter(Boolean).join(', ')||undefined,articleSection:p.category,author:p.author?{'@type':'Person',name:p.author}:org,publisher:org,
      spatialCoverage:place,
      about:p.locality?{'@type':'Service',name:'Domestic staff placement',serviceType:'Domestic staffing agency',provider:org,areaServed:place}:undefined,
      speakable:{'@type':'SpeakableSpecification',cssSelector:['.blog-article-head h1','.blog-prose > blockquote:first-of-type']}},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE.url},{'@type':'ListItem',position:2,name:'Blog',item:`${SITE.url}/blog`},{'@type':'ListItem',position:3,name:p.title,item:url}]},
  ];
  if(faqs.length) graph.push({'@type':'FAQPage','@id':`${url}#faq`,mainEntity:faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))});
  const jsonld={'@context':'https://schema.org','@graph':graph};
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
