'use client';
// Gives browser-side components (header, footer, homepage, enquiry form) the content
// that was loaded on the server, so edits made in /admin show up everywhere.
import {createContext,useContext} from 'react';
import type {PublicContent} from '@/lib/content';
import {waLink} from '@/data/site';

const Ctx=createContext<PublicContent|null>(null);

export function ContentProvider({value,children}:{value:PublicContent;children:React.ReactNode}){return <Ctx.Provider value={value}>{children}</Ctx.Provider>}

export function useContent(){const c=useContext(Ctx);if(!c) throw new Error('ContentProvider missing');return c}

export function useWA(){const {site}=useContent();return (role?:string,city?:string)=>waLink(site.whatsapp,role,city)}
