import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getContent} from '@/lib/content';
import {Msg,type SP} from '@/components/admin/Bits';
import PostForm from '@/components/admin/PostForm';

export const metadata={title:'Edit post'};

export default async function EditPost({params,searchParams}:{params:Promise<{id:string}>;searchParams:SP}){
  const {id}=await params;
  const post=id==='new'?undefined:getContent().posts.find(p=>p.id===id);
  if(id!=='new'&&!post) notFound();
  return <>
    <div className="adm-top"><div><Link href="/admin/posts" className="adm-help">← All posts</Link><h1>{post?'Edit post':'New post'}</h1></div></div>
    <Msg searchParams={searchParams}/>
    <PostForm key={post?.updatedAt||'new'} post={post}/>
  </>;
}
