// Single-admin login. The password is stored only as a scrypt hash in admin.json
// (outside the code folder). Sessions are signed cookies; changing the password
// rotates the signing secret, which logs out every other session.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {cookies, headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {CONTENT_DIR} from './content';

const ADMIN_FILE = path.join(CONTENT_DIR, 'admin.json');
const COOKIE = 'dsp_admin';
const SESSION_DAYS = 7;

type AdminFile = {passwordHash:string;secret:string};

function readAdmin():AdminFile|null{
  try{return JSON.parse(fs.readFileSync(ADMIN_FILE,'utf8'))}catch{return null}
}

export function hashPassword(pw:string){
  const salt=crypto.randomBytes(16);
  const hash=crypto.scryptSync(pw,salt,64,{N:16384,r:8,p:1});
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function checkPassword(pw:string,stored:string){
  const [kind,saltHex,hashHex]=stored.split('$');
  if(kind!=='scrypt'||!saltHex||!hashHex) return false;
  const expected=Buffer.from(hashHex,'hex');
  const got=crypto.scryptSync(pw,Buffer.from(saltHex,'hex'),expected.length,{N:16384,r:8,p:1});
  return crypto.timingSafeEqual(got,expected);
}

export function setPassword(pw:string){
  fs.mkdirSync(CONTENT_DIR,{recursive:true});
  const data:AdminFile={passwordHash:hashPassword(pw),secret:crypto.randomBytes(32).toString('hex')};
  fs.writeFileSync(ADMIN_FILE,JSON.stringify(data),{mode:0o600});
}

export const adminConfigured=()=>!!readAdmin();

const sign=(value:string,secret:string)=>crypto.createHmac('sha256',secret).update(value).digest('base64url');

// Wrong-password limit: 8 failures per address per 15 minutes.
const failures=new Map<string,{n:number;until:number}>();
async function clientIp(){const h=await headers();return h.get('x-real-ip')||h.get('x-forwarded-for')?.split(',')[0].trim()||'local'}

export async function login(pw:string):Promise<'ok'|'wrong'|'locked'|'unset'>{
  const admin=readAdmin();
  if(!admin) return 'unset';
  const ip=await clientIp();
  const f=failures.get(ip);
  if(f&&f.until>Date.now()&&f.n>=8) return 'locked';
  if(!checkPassword(pw,admin.passwordHash)){
    const cur=f&&f.until>Date.now()?f:{n:0,until:Date.now()+15*60_000};
    cur.n++;failures.set(ip,cur);
    return cur.n>=8?'locked':'wrong';
  }
  failures.delete(ip);
  const exp=String(Date.now()+SESSION_DAYS*86400_000);
  (await cookies()).set(COOKIE,`${exp}.${sign(exp,admin.secret)}`,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:SESSION_DAYS*86400});
  return 'ok';
}

export async function logout(){(await cookies()).delete(COOKIE)}

export async function isAdmin(){
  const admin=readAdmin();
  const v=(await cookies()).get(COOKIE)?.value;
  if(!admin||!v) return false;
  const [exp,sig]=v.split('.');
  if(!exp||!sig||Number(exp)<Date.now()) return false;
  const good=sign(exp,admin.secret);
  return good.length===sig.length&&crypto.timingSafeEqual(Buffer.from(good),Buffer.from(sig));
}

// Call at the top of every admin page and action.
export async function requireAdmin(){if(!(await isAdmin())) redirect('/admin/login')}

export async function changePassword(current:string,next:string):Promise<string|null>{
  const admin=readAdmin();
  if(!admin||!checkPassword(current,admin.passwordHash)) return 'Current password is wrong.';
  if(next.length<10) return 'New password must be at least 10 characters.';
  setPassword(next);
  await login(next);
  return null;
}
