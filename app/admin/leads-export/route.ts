// Downloads all leads as a CSV file that opens in Excel or Google Sheets. Admin only.
import {isAdmin} from '@/lib/auth';
import {getLeads,statusLabel} from '@/lib/leads';

// Quote every cell, and stop spreadsheet apps treating text as a formula.
const cell=(v:string)=>{const s=/^[=+\-@\t\r]/.test(v)?`'${v}`:v;return `"${s.replace(/"/g,'""')}"`};

export async function GET(){
  if(!(await isAdmin())) return new Response('Please log in.',{status:401});
  const rows=[['Date','Name','Phone','Service','City/Area','Arrangement','Details','Status','Notes','Source','Page']];
  for(const l of getLeads()) rows.push([new Date(l.createdAt).toLocaleString('en-GB',{timeZone:'Asia/Karachi'}),l.name,l.phone,l.service,l.city,l.arrangement,l.details,statusLabel[l.status],l.notes,l.source,l.page]);
  const csv='﻿'+rows.map(r=>r.map(cell).join(',')).join('\r\n');
  return new Response(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="leads-${new Date().toISOString().slice(0,10)}.csv"`,'Cache-Control':'no-store'}});
}
