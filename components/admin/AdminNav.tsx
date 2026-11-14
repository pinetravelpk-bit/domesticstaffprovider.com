'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutDashboard,FileText,BriefcaseBusiness,MapPin,CircleHelp,Settings,ExternalLink,LogOut} from 'lucide-react';
import {logoutAction} from '@/app/admin/actions';

const items=[
  {href:'/admin',label:'Dashboard',I:LayoutDashboard},
  {href:'/admin/posts',label:'Blog posts',I:FileText},
  {href:'/admin/services',label:'Services',I:BriefcaseBusiness},
  {href:'/admin/cities',label:'Cities',I:MapPin},
  {href:'/admin/faqs',label:'FAQs & steps',I:CircleHelp},
  {href:'/admin/settings',label:'Contact & password',I:Settings},
];

export function AdminNav(){
  const path=usePathname();
  const on=(h:string)=>h==='/admin'?path==='/admin':path.startsWith(h);
  return <aside className="adm-side">
    <div className="adm-logo">DomesticStaffProvider<small>Admin panel</small></div>
    {items.map(({href,label,I})=><Link key={href} href={href} className={on(href)?'on':''}><I size={17}/>{label}</Link>)}
    <div className="adm-grow"/>
    <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={17}/>View website</a>
    <form action={logoutAction}><button type="submit"><LogOut size={17}/>Log out</button></form>
  </aside>;
}
