import {Header,Footer,FloatingContact} from '@/components/UI';
import {ContentProvider} from '@/components/ContentProvider';
import {ClickTracker} from '@/components/ClickTracker';
import {getPublicContent} from '@/lib/content';

export default function SiteLayout({children}:{children:React.ReactNode}){
  return <ContentProvider value={getPublicContent()}><ClickTracker/><Header/>{children}<Footer/><FloatingContact/></ContentProvider>;
}
