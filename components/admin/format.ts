// Formatting helpers for admin pages (Pakistan time).
export const fmtDateTime=(iso:string)=>new Date(iso).toLocaleString('en-GB',{timeZone:'Asia/Karachi',day:'numeric',month:'short',hour:'numeric',minute:'2-digit',hour12:true});
export const fmtDate=(iso:string)=>new Date(iso).toLocaleDateString('en-GB',{timeZone:'Asia/Karachi',day:'numeric',month:'short',year:'numeric'});
// 0300 1234567 -> 923001234567 for wa.me links
export const waNumber=(phone:string)=>{const d=phone.replace(/\D/g,'');return d.startsWith('92')?d:d.startsWith('0')?'92'+d.slice(1):d};
