import {Header,Footer,FloatingContact} from '@/components/UI';
import {ContentProvider} from '@/components/ContentProvider';
import {getPublicContent} from '@/lib/content';

export default function SiteLayout({children}:{children:React.ReactNode}){
  return <ContentProvider value={getPublicContent()}><Header/>{children}<Footer/><FloatingContact/></ContentProvider>;
}
