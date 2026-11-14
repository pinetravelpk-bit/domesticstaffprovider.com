// Saves images uploaded in /admin: resized to at most 1800px wide and stored as WebP
// in the content folder, then served from /uploads/<name>.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {UPLOADS} from './content';

export const MAX_UPLOAD = 12 * 1024 * 1024;
export const UPLOAD_NAME = /^[a-z0-9-]+\.(webp|jpg|png|gif)$/;

// Returns the public URL, null when no file was chosen, or throws with a readable message.
export async function saveImage(file:FormDataEntryValue|null, label='image'):Promise<string|null>{
  if(!file||typeof file==='string'||file.size===0) return null;
  if(file.size>MAX_UPLOAD) throw new Error('Image is larger than 12 MB.');
  if(!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) throw new Error('Please upload a JPG, PNG, WebP or GIF image.');
  const input=Buffer.from(await file.arrayBuffer());
  let out:Buffer;
  try{out=await sharp(input,{animated:false}).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toBuffer()}
  catch{throw new Error('That file could not be read as an image.')}
  const base=label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'image';
  const name=`${base}-${crypto.randomBytes(4).toString('hex')}.webp`;
  fs.mkdirSync(UPLOADS,{recursive:true});
  fs.writeFileSync(path.join(UPLOADS,name),out);
  return `/uploads/${name}`;
}
