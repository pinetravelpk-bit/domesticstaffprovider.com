import type {Metadata} from 'next';
import {getContent} from '@/lib/content';
export const metadata:Metadata={title:'Privacy Policy',robots:{index:true,follow:true}};
export default function Page(){const {site:SITE}=getContent();return <main className="container legal-page"><h1>Privacy Policy</h1>
<h2>What we collect</h2>
<p>When you send the enquiry form, we keep the details you enter: your name, phone or WhatsApp number, the staff you need, your city or area, the working arrangement and any message. We also note which page of the website you sent it from. The form then opens WhatsApp with the same message, and WhatsApp’s own privacy policy applies to anything you send there.</p>
<p>We also count how many times the WhatsApp and Call buttons are clicked each day. These are totals only; we do not record who clicked.</p>
<h2>Why we keep it</h2>
<p>We use your enquiry only to reply to you, discuss your staffing requirement and follow up on your request. We do not sell your details or share them for marketing. Candidate details are shared with you only as part of a placement discussion.</p>
<h2>Who can see it and how long we keep it</h2>
<p>Enquiries are stored on our own web server and can only be viewed by our staffing team through a password-protected admin area. We keep them while we are handling your request and for our business records afterwards. You can ask us at any time to see, correct or delete your details.</p>
<h2>What not to send</h2>
<p>Please only share details relevant to your staffing requirement. Do not send bank, identity document or medical records in your first enquiry.</p>
<h2>Contact</h2>
<p>For any privacy question or a deletion request, call or WhatsApp <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>{SITE.email&&<> or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a></>}.</p>
</main>}
