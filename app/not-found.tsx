import Link from 'next/link';
import {ArrowRight,Home} from 'lucide-react';
export default function NotFound(){return <main className="not-found-screen"><Home size={44} aria-hidden="true"/><p className="eyebrow green">PAGE NOT FOUND</p><h1>Let&apos;s get you back home.</h1><p>The page you requested isn&apos;t available. Explore our domestic staffing services or return to the homepage.</p><div><Link href="/" className="pill pill-green">Back to Homepage <ArrowRight size={18}/></Link><Link href="/services" className="pill pill-outline">View Services <ArrowRight size={18}/></Link></div></main>}
