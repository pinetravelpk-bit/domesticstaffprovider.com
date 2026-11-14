// Saves an enquiry from the website form. The form still opens WhatsApp as before;
// this just keeps a copy in the admin panel.
import {addLead,rateLimited} from '@/lib/leads';

const clip=(v:unknown,n:number)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n);

export async function POST(req:Request){
  const origin=req.headers.get('origin'),host=req.headers.get('host');
  if(origin&&host&&new URL(origin).host!==host) return new Response(null,{status:403});
  const ip=req.headers.get('x-real-ip')||req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'local';
  if(rateLimited('lead:'+ip,8,60*60_000)) return new Response(null,{status:429});
  let body:Record<string,unknown>;
  try{body=JSON.parse((await req.text()).slice(0,8000))}catch{return new Response(null,{status:400})}
  if(clip(body.website,10)) return new Response(null,{status:204}); // hidden spam-trap field was filled in
  const phone=clip(body.phone,30);
  if(phone.replace(/\D/g,'').length<7) return new Response(null,{status:400});
  addLead({
    name:clip(body.name,100),phone,service:clip(body.service,100),city:clip(body.city,120),
    arrangement:clip(body.arrangement,40),details:clip(body.details,1000),page:clip(body.page,200),source:'website',
  });
  return new Response(null,{status:204});
}
