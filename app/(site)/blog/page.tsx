import type {Metadata} from 'next';
import Link from 'next/link';
import {publishedPosts} from '@/lib/content';
import {readingMinutes} from '@/lib/markdown';
import {ArrowRight} from '@/components/UI';
import {InnerCTA} from '@/components/InnerLayout';

export const metadata:Metadata={title:'Blog: Tips on Hiring Domestic Staff in Pakistan',description:'Practical advice for Pakistani families on hiring maids, cooks, drivers, nannies and other household staff.',alternates:{canonical:'/blog'}};

const fmt=(d:string)=>new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});

export default function Blog(){
  const posts=publishedPosts();
  return <main>
    <section className="blog-head"><div className="container"><span className="eyebrow green">OUR BLOG</span><h1>Hiring tips for Pakistani homes.</h1><p>Practical advice on finding, hiring and working well with household staff.</p></div></section>
    <section className="container blog-list">
      {posts.length?posts.map(p=><Link key={p.id} href={`/blog/${p.slug}`} className="blog-card">
        <div className="blog-card-img">{p.cover?<img src={p.cover} alt={p.coverAlt||p.title} loading="lazy" width={800} height={450}/>:<img src="/images/hero-family.jpg" alt="" loading="lazy" width={800} height={450}/>}</div>
        <div className="blog-card-body"><small>{fmt(p.publishedAt)} · {readingMinutes(p.body)} min read</small><h2>{p.title}</h2>{p.excerpt&&<p>{p.excerpt}</p>}<span className="link-arrow">Read more <ArrowRight size={15}/></span></div>
      </Link>):<p className="blog-empty">New articles are coming soon.</p>}
    </section>
    <InnerCTA/>
  </main>;
}
