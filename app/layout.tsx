import type {Metadata,Viewport} from 'next';
import {Header,Footer,FloatingContact} from '@/components/UI';
import {SITE} from '@/data/site';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(SITE.url),title:{default:'Hire Domestic Staff in Pakistan | Domestic Staff Provider',template:'%s | Domestic Staff Provider'},description:'Hire house maids, cooks, drivers, babysitters, home nurses and more across Pakistan. Domestic Staff Provider coordinates agency-managed staffing with clear placement terms.',applicationName:SITE.brand,verification:{google:'UPQlWlMpxrv6HBS_huWufGQZ69nkCMjWxHlq2o3QlpA'},openGraph:{type:'website',locale:'en_PK',siteName:SITE.brand,title:'Find the Right Staff for Your Home',description:'Domestic staffing enquiries and agency-managed hiring across Pakistan.',images:[{url:'/images/hero-family.jpg',width:1800,height:1200}]},robots:{index:true,follow:true}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#00784b'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/>{children}<Footer/><FloatingContact/></body></html>}
