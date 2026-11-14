'use client';
// Counts clicks on any WhatsApp or phone link on the site (header, buttons, footer, contact page).
import {useEffect} from 'react';

export function ClickTracker(){
  useEffect(()=>{
    const onClick=(e:MouseEvent)=>{
      const a=(e.target as HTMLElement).closest?.('a');const href=a?.getAttribute('href')||'';
      const kind=href.startsWith('tel:')?'call':href.includes('wa.me/')?'whatsapp':'';
      if(kind) navigator.sendBeacon?.('/api/track',new Blob([kind],{type:'text/plain'}));
    };
    document.addEventListener('click',onClick,true);
    return()=>document.removeEventListener('click',onClick,true);
  },[]);
  return null;
}
