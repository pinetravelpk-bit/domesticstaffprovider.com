import fs from 'node:fs';
import path from 'node:path';
import {UPLOADS} from '@/lib/content';
import {UPLOAD_NAME} from '@/lib/uploads';

const TYPES:Record<string,string>={webp:'image/webp',jpg:'image/jpeg',png:'image/png',gif:'image/gif'};

export async function GET(_req:Request,{params}:{params:Promise<{name:string}>}){
  const {name}=await params;
  if(!UPLOAD_NAME.test(name)) return new Response('Not found',{status:404});
  let data:Buffer;
  try{data=fs.readFileSync(path.join(UPLOADS,name))}catch{return new Response('Not found',{status:404})}
  return new Response(new Uint8Array(data),{headers:{'Content-Type':TYPES[name.split('.').pop()!],'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});
}
