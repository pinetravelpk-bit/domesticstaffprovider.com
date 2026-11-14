import {redirect} from 'next/navigation';
import {isAdmin,adminConfigured} from '@/lib/auth';
import {loginAction} from '../actions';

export const metadata={title:'Log in'};
const errors:Record<string,string>={wrong:'Wrong password. Please try again.',locked:'Too many wrong attempts. Please wait 15 minutes and try again.',unset:'The admin password has not been set up on the server yet.'};

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
  if(await isAdmin()) redirect('/admin');
  const {error}=await searchParams;
  return <div className="adm-login"><div className="adm-card">
    <h1>Admin log in</h1>
    <p>DomesticStaffProvider.com</p>
    {error&&errors[error]&&<div className="adm-msg err" role="alert">{errors[error]}</div>}
    {!adminConfigured()&&!error&&<div className="adm-msg err">{errors.unset}</div>}
    <form action={loginAction} className="adm-form">
      <label className="adm-field"><span>Password</span><input type="password" name="password" autoComplete="current-password" required autoFocus/></label>
      <button className="adm-btn" type="submit">Log in</button>
    </form>
  </div></div>;
}
