// Counts clicks on WhatsApp and Call buttons. Only a daily total is stored, nothing about the visitor.
import {bump,rateLimited} from '@/lib/leads';

export async function POST(req:Request){
  const ip=req.headers.get('x-real-ip')||req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'local';
  if(rateLimited('track:'+ip,60,60*60_000)) return new Response(null,{status:204});
  const kind=(await req.text()).slice(0,20);
  if(kind==='whatsapp'||kind==='call') bump(kind);
  return new Response(null,{status:204});
}
