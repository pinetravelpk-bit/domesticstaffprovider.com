// Photo upload used by the blog editor's "Add photo" button. Admin only.
import {isAdmin} from '@/lib/auth';
import {saveImage} from '@/lib/uploads';

export async function POST(req:Request){
  if(!(await isAdmin())) return Response.json({error:'Please log in again.'},{status:401});
  const origin=req.headers.get('origin'),host=req.headers.get('host');
  if(origin&&host&&new URL(origin).host!==host) return Response.json({error:'Bad origin'},{status:403});
  try{
    const form=await req.formData();
    const url=await saveImage(form.get('file'),String(form.get('label')||'photo'));
    if(!url) return Response.json({error:'No file chosen.'},{status:400});
    return Response.json({url});
  }catch(e){return Response.json({error:(e as Error).message||'Upload failed.'},{status:400})}
}
