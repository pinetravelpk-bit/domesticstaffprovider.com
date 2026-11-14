// Small shared pieces for admin pages (server components).
export type SP=Promise<Record<string,string|string[]|undefined>>;

export async function Msg({searchParams}:{searchParams:SP}){
  const sp=await searchParams;
  const ok=typeof sp.saved==='string'?sp.saved:'';
  const err=typeof sp.error==='string'?sp.error:'';
  return <>{ok&&<div className="adm-msg ok" role="status">{ok}</div>}{err&&<div className="adm-msg err" role="alert">{err}</div>}</>;
}

export function Field({label,hint,children}:{label:string;hint?:React.ReactNode;children:React.ReactNode}){
  return <label className="adm-field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>;
}

export function ImagePick({name,current,removeName,hint}:{name:string;current?:string;removeName:string;hint?:string}){
  return <div className="adm-field"><span>Photo</span><div className="adm-img-pick">
    {current&&<img src={current} alt=""/>}
    <div style={{display:'grid',gap:8}}>
      <input type="file" name={name} accept="image/jpeg,image/png,image/webp,image/gif"/>
      {current&&<label className="adm-check"><input type="checkbox" name={removeName}/> Remove this photo</label>}
    </div>
  </div><small>{hint||'JPG, PNG or WebP, up to 12 MB. Large photos are resized automatically.'}</small></div>;
}
