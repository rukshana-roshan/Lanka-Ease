import { useEffect,useRef,useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { marketplaceApi } from '../services/api';
import { actionClass,primaryClass,fieldClass,panelClass } from '../components/MarketplaceUI';
export function LiveMessagesPage(){
 const {user}=useAuth();const [params]=useSearchParams();const client=useQueryClient();const [selected,setSelected]=useState(Number(params.get('conversationId'))||0);const [text,setText]=useState('');
 const started=useRef('');const listKey=['conversations',user?.id];
 const conversations=useQuery({queryKey:listKey,queryFn:marketplaceApi.conversations,refetchInterval:10000,retry:false});
 const start=useMutation({mutationFn:()=>marketplaceApi.startConversation(Number(params.get('conversationWith')),Number(params.get('requestId'))||undefined),onSuccess:async c=>{setSelected(c.id);await client.invalidateQueries({queryKey:listKey});}});
 useEffect(()=>{const target=params.get('conversationWith');if(target&&user?.role==='CUSTOMER'&&started.current!==target){started.current=target;start.mutate();}},[params,user?.role]);
 useEffect(()=>{if(!selected&&!params.get('conversationWith')&&conversations.data?.length)setSelected(conversations.data[0].id);},[conversations.data,params,selected]);
 const messages=useQuery({queryKey:['conversation-messages',user?.id,selected],queryFn:()=>marketplaceApi.messages(selected),enabled:selected>0,refetchInterval:4000,retry:false});
 const send=useMutation({mutationFn:(message:string)=>marketplaceApi.send(selected,message),onSuccess:async()=>{setText('');await Promise.all([client.invalidateQueries({queryKey:['conversation-messages',user?.id,selected]}),client.invalidateQueries({queryKey:listKey})]);}});
 const error=conversations.error||messages.error||start.error||send.error;
 const current=conversations.data?.find(c=>c.id===selected);const unread=conversations.data?.reduce((sum,c)=>sum+c.unreadCount,0)||0;
 return <section className="space-y-4 pb-16"><header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">Messages {unread>0&&`(${unread} unread)`}</h1><button className={actionClass} onClick={()=>{void conversations.refetch();if(selected)void messages.refetch();}}>Refresh</button></header>
 {error&&<div role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error.message}{start.error&&<button className={actionClass} onClick={()=>start.mutate()}>Retry conversation</button>}</div>}
 <div className="grid gap-4 md:grid-cols-[280px_1fr]"><aside className={panelClass} aria-label="Conversations">{conversations.isPending&&<p>Loading conversations…</p>}{conversations.data?.length===0&&<p>No conversations yet. Customers can start a chat from a professional’s profile.</p>}{conversations.data?.map(c=><button key={c.id} aria-pressed={selected===c.id} className={`w-full rounded-xl border p-3 text-left ${selected===c.id?'border-emerald-800 bg-emerald-50 text-emerald-900':'border-slate-200'}`} onClick={()=>{setSelected(c.id);send.reset();}}><span className="block font-semibold">{c.otherUserName}{c.unreadCount>0&&` (${c.unreadCount} unread)`}</span><span className="block truncate text-xs">{c.lastMessage}</span></button>)}</aside>
 <div className={panelClass}>{selected?<><h2 className="text-xl font-semibold">{current?.otherUserName||'Conversation'}</h2>{messages.isPending&&<p>Loading messages…</p>}<div role="log" aria-label="Conversation messages" className="max-h-[480px] min-h-40 space-y-3 overflow-y-auto">{messages.data?.length===0&&<p>No messages yet.</p>}{messages.data?.map(m=><article key={m.id} className={`max-w-[90%] rounded-2xl p-3 ${m.senderId===user?.id?'ml-auto bg-emerald-50 text-emerald-950':'bg-stone-100 text-slate-900'}`}><p className="text-xs font-semibold">{m.senderId===user?.id?'You':m.senderName}</p><p className="whitespace-pre-wrap break-words text-sm">{m.textContent}</p><time className="text-xs text-slate-500">{m.createdAt?.replace('T',' ').slice(0,16)} (server time)</time></article>)}</div>
 <form className="flex items-end gap-2" onSubmit={e=>{e.preventDefault();if(text.trim())send.mutate(text.trim());}}><label className="flex-1 text-sm">Your message<textarea className={fieldClass} required maxLength={5000} value={text} onChange={e=>setText(e.target.value)} disabled={send.isPending}/></label><button className={primaryClass} disabled={send.isPending||!text.trim()||!!messages.error}>Send</button></form></>:<p>{start.isPending?'Starting conversation…':'Select a conversation to read and reply.'}</p>}</div></div>
 </section>;
}
