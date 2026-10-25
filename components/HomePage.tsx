'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {CircleHelp} from 'lucide-react';
import {services,cities,faqs,steps} from '@/data/site';
import {CTA,WhatsAppCTA,ServiceIcon,ArrowRight,CheckCircle2,ChevronLeft,ChevronRight,ChevronDown,Clock3,Headphones,MapPin,ShieldCheck,Users,HeartHandshake,BadgeCheck} from './UI';

const pills=['Popular','Home Staff','Care Staff','Drivers','Support Staff'];
const popular=['house-maids','cooks-chefs','drivers'];
const groupMap:Record<string,string[]>={'Popular':popular,'Home Staff':['house-maids','cooks-chefs','helpers','cleaners','gardeners'],'Care Staff':['home-nurses','babysitters-nannies','caretakers-attendants'],'Drivers':['drivers','personal-attendants','security-guards'],'Support Staff':['office-boys','domestic-couples','chefs']};
const benefit=[{icon:ShieldCheck,title:'Candidate Screening',body:'Discuss references and background checks'},{icon:BadgeCheck,title:'Experienced Options',body:'Skills matched to your requirements'},{icon:Clock3,title:'Coordinated Process',body:'Timeline discussed for each search'},{icon:Headphones,title:'Support after Placement',body:'Written replacement terms'}];
const stories=[
  {src:'/images/family-1.jpg',title:'Support for busy families',body:'Find household help that suits your daily routine.'},
  {src:'/images/family-2.jpg',title:'Care for loved ones',body:'Discuss companionship and practical daily assistance.'},
  {src:'/images/family-3.jpg',title:'A clearer hiring experience',body:'Coordinate your shortlist through one staffing team.'},
  {src:'/images/family-4.jpg',title:'Family-focused arrangements',body:'Agree each duty and schedule before hiring.'},
  {src:'/images/family-5.jpg',title:'Help with little ones',body:'Plan childcare around your family needs.'},
];

export default function HomePage(){
  const[filter,setFilter]=useState('Popular');const[offset,setOffset]=useState(0);const[story,setStory]=useState(2);const[openFaq,setOpenFaq]=useState<number|null>(null);
  const current=useMemo(()=>{const slugs=groupMap[filter]||popular;return slugs.map(slug=>services.find(s=>s.slug===slug)!).filter(Boolean)},[filter]);
  const shown=[0,1,2].map(i=>current[(i+offset)%current.length]);
  function changeFilter(s:string){setFilter(s);setOffset(0)}
  return <main>
  <section className="hero" id="home">
    <div className="container hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">TRUSTED DOMESTIC STAFF PROVIDER</span>
        <h1>Find the<br/><em>Right Staff</em><br/>for Your Home.</h1>
        <p>Reliable, experienced domestic staff in Islamabad, Rawalpindi and major cities of Pakistan. Housemaids, cooks, drivers, babysitters, nurses and more.</p>
        <div className="hero-buttons"><CTA/><WhatsAppCTA/></div>
        <div className="hero-proof">
          <div className="mini-avatars">{stories.slice(0,3).map(s=><img key={s.src} src={s.src} alt="" width={34} height={34}/>)}</div>
          <div><strong>Agency-managed hiring</strong><div className="tiny-rating"><CheckCircle2 size={12}/> <span>Clear terms · Support after hiring</span></div></div>
        </div>
      </div>
      <div className="hero-visual">
        <img src="/images/hero-staff.webp" alt="Uniformed maid, cook and driver helping a Pakistani family at home" width={1993} height={789} fetchPriority="high"/>
        <div className="hero-badge hero-badge-top"><span><ShieldCheck size={18}/></span><div><strong>Screened candidates</strong><small>References discussed</small></div></div>
        <div className="hero-badge hero-badge-bottom"><span><HeartHandshake size={18}/></span><div><strong>6-month replacement</strong><small>On standard placements</small></div></div>
      </div>
    </div>
  </section>

  <section className="trusted-strip"><div className="container"><h2>Everyday support for homes across Pakistan</h2><div className="trust-words"><span>Family Cooks</span><span>Household Helpers</span><span className="heavy">Caregivers</span><span>Drivers</span><span>Home Nurses</span><span>Maids</span></div></div></section>

  <section className="services-showcase section"><div className="container showcase-grid">
    <div className="showcase-intro"><span className="eyebrow green">OUR SERVICES</span><h2>Transparent<br/>Process.<br/><em>No Surprises.</em></h2><p>We coordinate experienced domestic staff with a simple and clear hiring process.</p><Link href="/services" className="link-arrow">View All Services <ArrowRight size={17}/></Link></div>
    <div className="showcase-content">
      <div className="filter-line"><div className="filter-pills">{pills.map(t=><button key={t} className={t===filter?'selected':''} onClick={()=>changeFilter(t)}>{t}</button>)}</div><div className="slider-controls"><button aria-label="Previous service" onClick={()=>setOffset((offset-1+current.length)%current.length)}><ChevronLeft size={18}/></button><button aria-label="Next service" onClick={()=>setOffset((offset+1)%current.length)}><ChevronRight size={18}/></button></div></div>
      <div className="feature-services">{shown.map(s=><Link href={`/services/${s.slug}`} className="feature-card" key={s.slug}><div className="service-photo">{s.image?<img src={s.image} alt={s.title} loading="lazy" width={600} height={400}/>:<div className="photo-placeholder"><ServiceIcon name={s.icon} size={62}/></div>}</div><div className="feature-card-body"><h3>{s.title}</h3><p>{s.short}. Availability confirmed on enquiry.</p><div className="feature-card-bottom"><span className="price">{s.price||'Request a quote'}</span><span className="mini-button">View Details</span></div></div></Link>)}</div>
    </div>
  </div></section>

  <section className="families-section section"><div className="container">
    <div className="center-heading"><h2>The families who<br/><em>let us support their homes.</em></h2><p>From busy professionals to growing families, we coordinate household support for everyday life.</p></div>
    <div className="story-slider">
      <button className="story-arrow" aria-label="Previous family story" onClick={()=>setStory((story+4)%5)}><ChevronLeft size={18}/></button>
      <div className="story-cards">{stories.map((s,i)=><button key={s.src} onClick={()=>setStory(i)} className={`story-photo ${story===i?'active':''}`} aria-label={s.title}><img src={s.src} alt={s.title} loading="lazy" width={600} height={600}/><span className="story-bubble"><b>{s.title}</b><span>{s.body}</span></span></button>)}</div>
      <button className="story-arrow" aria-label="Next family story" onClick={()=>setStory((story+1)%5)}><ChevronRight size={18}/></button>
    </div>
    <div className="story-progress">{stories.map((_,i)=><button key={i} aria-label={`Slide ${i+1}`} onClick={()=>setStory(i)} className={story===i?'active':''}/>)}</div>
  </div></section>

  <section className="value-section"><div className="container"><div className="value-card">
    <div className="value-details"><h2>The right staff<br/><em>makes a happier home.</em></h2><p>Experienced and reliable domestic staffing to make your life easier and more comfortable.</p><div className="value-icons">{[{I:ShieldCheck,t:'Clear Staff\nScreening'},{I:Users,t:'Experienced\nOptions'},{I:Clock3,t:'Coordinated\nHiring'},{I:Headphones,t:'Replacement\nSupport'},{I:HeartHandshake,t:'Dedicated\nService'}].map(({I,t})=><div key={t}><I size={27}/><strong>{t}</strong></div>)}</div></div>
    <div className="value-illustration"><div className="value-house-frame"><img src="/images/happy-home.jpg" alt="Pakistani mother holding her baby" loading="lazy" width={600} height={500}/></div><div className="safe-badge"><ShieldCheck size={20}/><span>A Safer<br/>Happier Home</span></div></div>
  </div></div></section>

  <section className="process-section"><div className="container process-grid">
    <div className="process-image"><img src="/images/process-cleaner.jpg" alt="Housekeeper cleaning a mirror at home" loading="lazy" width={800} height={900}/></div>
    <div className="process-details"><h2>How it works.</h2><p>A simple and transparent process.</p><ol>{steps.map((step,i)=><li key={i}><span className="step-number">{i+1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol><CTA white>Get Started Now</CTA></div>
  </div></section>

  <section className="wide-services section"><div className="container"><div className="center-heading"><h2>Wide Range of Domestic Staff Services.</h2><p>Professional home support for every need.</p></div><div className="service-bubbles">{services.slice(0,8).map(s=><Link href={`/services/${s.slug}`} key={s.slug} className="service-bubble"><div className="bubble-icon"><ServiceIcon name={s.icon} size={22}/></div><span><strong>{s.title}</strong><small>{s.short}</small></span><span className="bubble-arrow"><ArrowRight size={16}/></span></Link>)}</div></div></section>

  <section className="why-section"><div className="why-picture"><img src="/images/why-driver.jpg" alt="Pakistani driver standing beside a white car" loading="lazy" width={1800} height={1200}/></div><div className="why-copy"><h2>Why Choose<br/><em>DomesticStaff<wbr/>Provider.com?</em></h2><div className="why-benefits">{benefit.map(({icon:I,title,body})=><div className="why-benefit" key={title}><span><I size={20}/></span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div></div></section>

  <section className="areas-home section"><div className="container area-grid">
    <div className="area-info"><h2>Supporting Families<br/><em>Across Pakistan.</em></h2><p>We receive domestic staffing enquiries for Islamabad, Rawalpindi and other major cities, with candidate availability confirmed for each request.</p><div className="city-checks">{cities.map(city=><Link href={`/areas/${city.slug}`} key={city.slug}><CheckCircle2 size={15}/>{city.name}</Link>)}</div><Link href="/areas" className="pill pill-green">View All Areas <ArrowRight size={16}/></Link></div>
    <div className="area-art">
      <img className="area-main" src="/images/islamabad.jpg" alt="Islamabad skyline with Faisal Mosque seen from the Margalla Hills" loading="lazy" width={2000} height={1333}/>
      <div className="area-family"><img src="/images/areas-family.jpg" alt="Family sharing a meal together" loading="lazy" width={600} height={400}/></div>
      <div className="area-badge"><MapPin size={18}/><div><strong>{cities.length} major cities</strong><small>Enquiries accepted nationwide</small></div></div>
    </div>
  </div></section>

  <section className="faq-section section"><div className="container faq-grid">
    <div className="faq-intro"><h2>You probably<br/><em>have questions.</em></h2><div className="question-art" aria-hidden="true"><CircleHelp size={46} strokeWidth={1.8}/></div></div>
    <div className="faq-list">{faqs.slice(0,5).map((faq,i)=><div className={`faq-item ${openFaq===i?'expanded':''}`} key={faq.q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}>{faq.q}<ChevronDown size={18}/></button>{openFaq===i&&<p>{faq.a}</p>}</div>)}<Link className="faq-more" href="/faq">More frequently asked questions <ArrowRight size={15}/></Link></div>
  </div></section>

  <section className="bottom-cta"><div className="container bottom-cta-inner"><h2>Let’s find the right staff<br/><em>for your home.</em></h2><p>Reliable. Professional. Coordinated across Pakistan.</p><div className="bottom-cta-buttons"><CTA/><WhatsAppCTA/></div></div></section>
  </main>
}
