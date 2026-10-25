import type {Metadata} from 'next';
import {faqs} from '@/data/site';
import {InnerHero,InnerCTA} from '@/components/InnerLayout';
export const metadata:Metadata={title:'Frequently Asked Questions about Domestic Staff Hiring',description:'Answers about hiring domestic staff, placement charges, screening, availability and replacement terms.',alternates:{canonical:'/faq'}};
export default function Page(){return <main><InnerHero eyebrow="GOOD QUESTIONS, CLEAR ANSWERS" title="You probably have questions." description="Find answers about requesting staff, fees, service areas and the hiring process."/><section className="container inner-content faq-page-items">{faqs.map(f=><details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section><InnerCTA/></main>}
