import {getContent} from '@/lib/content';
import {saveSettings,changePasswordAction} from '../../actions';
import {Msg,Field,type SP} from '@/components/admin/Bits';

export const metadata={title:'Contact & password'};

export default function Settings({searchParams}:{searchParams:SP}){
  const {site}=getContent();
  const local=(n:string)=>n.replace(/^\+?92/,'0');
  return <>
    <div className="adm-top"><div><h1>Contact & password</h1><p>Contact details are used on every page, in the WhatsApp buttons and in Google’s business info.</p></div></div>
    <Msg searchParams={searchParams}/>
    <form action={saveSettings} className="adm-card adm-form">
      <h2>Contact details</h2>
      <div className="adm-row">
        <Field label="Call number" hint="Used by the “Call Now” buttons."><input type="tel" name="phone" required defaultValue={local(site.phone)}/></Field>
        <Field label="WhatsApp number" hint="All WhatsApp buttons and the enquiry form send here."><input type="tel" name="whatsapp" required defaultValue={local(site.whatsapp)}/></Field>
      </div>
      <div className="adm-row">
        <Field label="Number as shown on the site" hint="e.g. 0322 1223666"><input type="text" name="phoneDisplay" maxLength={30} defaultValue={site.phoneDisplay}/></Field>
        <Field label="Email"><input type="email" name="email" maxLength={120} defaultValue={site.email}/></Field>
      </div>
      <div className="adm-row">
        <Field label="Office address"><input type="text" name="office" maxLength={200} defaultValue={site.office}/></Field>
        <Field label="Company line"><input type="text" name="company" maxLength={120} defaultValue={site.company}/></Field>
      </div>
      <div className="adm-actions"><button className="adm-btn" type="submit">Save contact details</button></div>
    </form>
    <form action={changePasswordAction} className="adm-card adm-form" style={{maxWidth:520}}>
      <h2>Change admin password</h2>
      <Field label="Current password"><input type="password" name="current" required autoComplete="current-password"/></Field>
      <Field label="New password" hint="At least 10 characters."><input type="password" name="next" required minLength={10} autoComplete="new-password"/></Field>
      <Field label="New password again"><input type="password" name="again" required minLength={10} autoComplete="new-password"/></Field>
      <div className="adm-actions"><button className="adm-btn" type="submit">Change password</button></div>
      <p className="adm-help">Changing the password logs out every other device.</p>
    </form>
  </>;
}
