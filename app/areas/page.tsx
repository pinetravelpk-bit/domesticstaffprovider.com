import type {Metadata} from 'next';
import Link from 'next/link';
import {cities,services} from '@/data/site';
import {MapPin,ArrowRight} from '@/components/UI';
import {InnerHero,InnerCTA} from '@/components/InnerLayout';
export const metadata:Metadata={title:'Domestic Staff Hiring Areas Across Pakistan',description:'Request household staff in Islamabad, Rawalpindi, Lahore, Karachi, Faisalabad, Multan and other cities across Pakistan.',alternates:{canonical:'/areas'}};
export default function Page(){return <main><InnerHero eyebrow="AREAS WE SERVE" title="Staffing for homes across Pakistan." description="From Islamabad and Rawalpindi to Lahore, Karachi and beyond, share your area so the team can discuss a suitable candidate search." image="/images/islamabad.jpg" alt="Islamabad skyline with Faisal Mosque"/><section className="container inner-content"><div className="center-heading"><h2>Choose your city.</h2><p>We accept enquiries nationwide. Availability is confirmed for each role and location.</p></div><div className="city-card-grid">{cities.map(c=><Link href={`/areas/${c.slug}`} key={c.slug} className="city-card"><MapPin size={26}/><h3>{c.name}</h3><p>{c.intro}</p><span>Explore {c.name} <ArrowRight size={15}/></span></Link>)}</div></section><InnerCTA/></main>}
