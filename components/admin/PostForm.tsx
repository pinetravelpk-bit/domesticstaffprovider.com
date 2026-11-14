'use client';
import {useEffect,useRef,useState} from 'react';
import type {Post} from '@/data/site';
import {renderMarkdown} from '@/lib/markdown';
import {savePost,deletePost} from '@/app/admin/actions';
import {SeoPanel} from './SeoPanel';

const slugify=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);

export default function PostForm({post}:{post?:Post}){
  const [title,setTitle]=useState(post?.title||'');
  const [slug,setSlug]=useState(post?.slug||'');
  const [slugTouched,setSlugTouched]=useState(!!post);
  const [body,setBody]=useState(post?.body||'');
  const [excerpt,setExcerpt]=useState(post?.excerpt||'');
  const [coverAlt,setCoverAlt]=useState(post?.coverAlt||'');
  const [preview,setPreview]=useState(false);
  const [coverUrl,setCoverUrl]=useState(post?.cover||'');
  const [uploading,setUploading]=useState(false);
  const [dirty,setDirty]=useState(false);
  const ta=useRef<HTMLTextAreaElement>(null);
  const photo=useRef<HTMLInputElement>(null);
  const saving=useRef(false);

  // Ask before leaving the page with unsaved changes.
  useEffect(()=>{const h=(e:BeforeUnloadEvent)=>{if(dirty&&!saving.current){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',h);return()=>window.removeEventListener('beforeunload',h)},[dirty]);

  function wrap(before:string,after='',placeholder='text'){
    const el=ta.current;if(!el)return;
    const s=el.selectionStart,e=el.selectionEnd,sel=body.slice(s,e)||placeholder;
    const next=body.slice(0,s)+before+sel+after+body.slice(e);
    setBody(next);setDirty(true);
    requestAnimationFrame(()=>{el.focus();el.setSelectionRange(s+before.length,s+before.length+sel.length)});
  }
  function linePrefix(prefix:string){
    const el=ta.current;if(!el)return;
    const s=body.lastIndexOf('\n',el.selectionStart-1)+1;
    setBody(body.slice(0,s)+prefix+body.slice(s));setDirty(true);
    requestAnimationFrame(()=>{el.focus();el.setSelectionRange(s+prefix.length,s+prefix.length)});
  }
  async function addPhoto(file:File){
    setUploading(true);
    const fd=new FormData();fd.append('file',file);fd.append('label',slug||title||'photo');
    try{
      const r=await fetch('/admin/upload',{method:'POST',body:fd});const j=await r.json();
      if(!r.ok) throw new Error(j.error||'Upload failed.');
      const alt=(file.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ')||'photo');
      wrap(`\n![${alt}](${j.url})\n`,'','');
    }catch(e){alert((e as Error).message)}finally{setUploading(false);if(photo.current)photo.current.value=''}
  }

  const today=new Date().toISOString().slice(0,10);
  return <>
    <form action={savePost} className="adm-split" onChange={()=>setDirty(true)} onSubmit={()=>{saving.current=true}}>
      <input type="hidden" name="id" value={post?.id||''}/>
      <div className="adm-form">
        <div className="adm-card adm-form">
          <label className="adm-field"><span>Title</span><input type="text" name="title" value={title} required maxLength={200} placeholder="e.g. How to hire a reliable maid in Islamabad" onChange={e=>{setTitle(e.target.value);if(!slugTouched)setSlug(slugify(e.target.value))}}/></label>
          <label className="adm-field"><span>Web address</span><input type="text" name="slug" value={slug} maxLength={100} onChange={e=>{setSlug(e.target.value);setSlugTouched(true)}}/><small>domesticstaffprovider.com/blog/<b>{slugify(slug)||'…'}</b>{post&&post.status==='published'?' · Changing this breaks links people already shared.':''}</small></label>
          <label className="adm-field"><span>Short summary</span><textarea name="excerpt" rows={2} maxLength={400} value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="One or two sentences shown on the blog list and in Google results."/></label>
          <div className="adm-field"><span>Post text</span>
            <div className="adm-toolbar">
              <button type="button" onClick={()=>linePrefix('## ')}>Heading</button>
              <button type="button" onClick={()=>linePrefix('### ')}>Sub-heading</button>
              <button type="button" onClick={()=>wrap('**','**','bold text')}><b>B</b></button>
              <button type="button" onClick={()=>wrap('*','*','italic text')}><i>I</i></button>
              <button type="button" onClick={()=>linePrefix('- ')}>• List</button>
              <button type="button" onClick={()=>linePrefix('1. ')}>1. List</button>
              <button type="button" onClick={()=>linePrefix('> ')}>Quote</button>
              <button type="button" onClick={()=>{const u=prompt('Link address (https://…)');if(u)wrap('[',`](${u})`,'link text')}}>Link</button>
              <button type="button" disabled={uploading} onClick={()=>photo.current?.click()}>{uploading?'Uploading…':'Add photo'}</button>
              <span className="adm-sp"/>
              <button type="button" onClick={()=>setPreview(!preview)}>{preview?'Back to editing':'Preview'}</button>
            </div>
            <input ref={photo} type="file" accept="image/*" hidden onChange={e=>{const f=e.target.files?.[0];if(f)addPhoto(f)}}/>
            {preview?<div className="adm-preview blog-prose" dangerouslySetInnerHTML={{__html:renderMarkdown(body)||'<p><i>Nothing written yet.</i></p>'}}/>
            :<textarea ref={ta} className="adm-body" name="body" value={body} onChange={e=>{setBody(e.target.value);setDirty(true)}} placeholder={'Write your post here.\n\n## A heading\n\nA paragraph of text. Leave an empty line between paragraphs.\n\n- A list item\n- Another item'}/>}
            {preview&&<input type="hidden" name="body" value={body}/>}
            <p className="adm-help">Use the buttons above, or type: <code>## Heading</code> · <code>**bold**</code> · <code>- list item</code> · <code>[link text](https://…)</code>. Leave an empty line between paragraphs.</p>
          </div>
        </div>
      </div>
      <div className="adm-form">
        <div className="adm-card adm-form">
          <label className="adm-field"><span>Status</span><select name="status" defaultValue={post?.status||'draft'}><option value="draft">Draft (only visible here)</option><option value="published">Published (live on the website)</option></select></label>
          <label className="adm-field"><span>Date</span><input type="date" name="publishedAt" defaultValue={(post?.publishedAt||'').slice(0,10)||today}/></label>
          <button className="adm-btn" type="submit">Save</button>
          {post?.status==='published'&&<a className="adm-btn ghost" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">View on website</a>}
        </div>
        <div className="adm-card adm-form">
          <div className="adm-field"><span>Cover photo</span>
            {coverUrl&&<img src={coverUrl} alt="" style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',borderRadius:10,border:'1px solid #dfe8e3'}}/>}
            <input type="file" name="coverFile" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>{const f=e.target.files?.[0];if(f)setCoverUrl(URL.createObjectURL(f))}}/>
            {post?.cover&&<label className="adm-check"><input type="checkbox" name="removeCover"/> Remove cover photo</label>}
            <small>Wide photos look best. Resized automatically.</small>
          </div>
          <label className="adm-field"><span>Photo description</span><input type="text" name="coverAlt" maxLength={200} value={coverAlt} onChange={e=>setCoverAlt(e.target.value)} placeholder="e.g. Maid folding laundry at home"/><small>Helps Google and blind visitors.</small></label>
        </div>
        <div className="adm-card adm-form">
          <label className="adm-field"><span>Category</span><input type="text" name="category" maxLength={60} defaultValue={post?.category||''} placeholder="e.g. Hiring tips"/></label>
          <label className="adm-field"><span>Tags</span><input type="text" name="tags" maxLength={300} defaultValue={post?.tags||''} placeholder="maids, Islamabad, salary"/><small>Separate with commas.</small></label>
          <label className="adm-field"><span>Author</span><input type="text" name="author" maxLength={80} defaultValue={post?.author||''} placeholder="Domestic Staff Provider"/></label>
        </div>
      </div>
      <SeoPanel post={post} title={title} slug={slugify(slug)} body={body} excerpt={excerpt} coverAlt={coverAlt} coverUrl={coverUrl}/>
    </form>
    {post&&<form action={deletePost} onSubmit={e=>{if(!confirm('Delete this post? This cannot be undone from the panel.'))e.preventDefault();else saving.current=true}} style={{marginTop:6}}><input type="hidden" name="id" value={post.id}/><button className="adm-btn danger" type="submit">Delete post</button></form>}
  </>;
}
