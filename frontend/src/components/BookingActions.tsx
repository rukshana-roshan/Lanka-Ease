import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation,useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { marketplaceApi,api } from '../services/api';
import type { ServiceRequest } from '../types';
import { actionClass,primaryClass,fieldClass,panelClass } from './MarketplaceUI';
import { localToday } from '../services/session';
export function BookingActions({request}:{request:ServiceRequest}){
 const {user,isDemo}=useAuth();const client=useQueryClient();const [date,setDate]=useState('');const [time,setTime]=useState('');
 const [showProposal,setShowProposal]=useState(false);const [showReview,setShowReview]=useState(false);const [rating,setRating]=useState(5);const [text,setText]=useState('');
 const mutation=useMutation({mutationFn:(operation:()=>Promise<unknown>)=>operation(),onSuccess:async()=>{setShowProposal(false);setShowReview(false);await Promise.all(['request','requests','live-provider','provider-performance','marketplace-profile','marketplace-reviews','marketplace-directory'].map(key=>client.invalidateQueries({queryKey:[key]})));}});
 if(isDemo)return null;
 const provider=user?.role==='PROVIDER';const customer=user?.role==='CUSTOMER'&&request.customerId===user.id;
 const canCancel=['DRAFT','CREATED','PROVIDER_FOUND','ACCEPTED','ON_THE_WAY','ARRIVED'].includes(request.status);
 return <div className="space-y-3">
 {request.serviceTitle&&<p className="text-sm">Service: {request.serviceTitle}</p>}
 {request.proposedDate&&<div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><p>Proposed appointment: {request.proposedDate} at {request.proposedTime}</p>{customer&&<button className={actionClass} disabled={mutation.isPending} onClick={()=>mutation.mutate(()=>marketplaceApi.acceptProposal(request.id))}>Accept new appointment</button>}</div>}
 <div className="flex flex-wrap gap-2">{provider&&<Link className={actionClass} to="/app/messages">Customer conversations</Link>}
 {provider&&['CREATED','PROVIDER_FOUND','ACCEPTED'].includes(request.status)&&<button className={actionClass} onClick={()=>setShowProposal(!showProposal)}>Propose another time</button>}
 {(provider||customer)&&canCancel&&<button className={actionClass} disabled={mutation.isPending} onClick={()=>{if(window.confirm(provider?'Reject / cancel this booking? The customer will see the cancelled status.':'Cancel this service request?'))mutation.mutate(()=>api.updateRequestStatus(request.id,'CANCELLED',provider?'Provider declined this booking':'Customer cancelled this booking'));}}>{provider?'Reject / cancel request':'Cancel request'}</button>}
 {customer&&request.status==='COMPLETED'&&<button className={primaryClass} onClick={()=>setShowReview(!showReview)}>Leave a review</button>}</div>
 {showProposal&&<form className={panelClass} onSubmit={e=>{e.preventDefault();mutation.mutate(()=>marketplaceApi.propose(request.id,date,time));}}><h3 className="font-semibold">Propose a new appointment</h3><label className="block text-sm">Date<input className={fieldClass} type="date" min={localToday()} required value={date} onChange={e=>setDate(e.target.value)}/></label><label className="block text-sm">Time<input className={fieldClass} type="time" required value={time} onChange={e=>setTime(e.target.value)}/></label><button className={primaryClass} disabled={mutation.isPending}>Send proposal to customer</button></form>}
 {showReview&&<form className={panelClass} onSubmit={e=>{e.preventDefault();mutation.mutate(()=>marketplaceApi.review(request.id,rating,text));}}><h3 className="font-semibold">Review the completed service</h3><label className="block text-sm">Rating<select className={fieldClass} value={rating} onChange={e=>setRating(Number(e.target.value))}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} stars</option>)}</select></label><label className="block text-sm">Your review<textarea className={fieldClass} maxLength={3000} required value={text} onChange={e=>setText(e.target.value)}/></label><button className={primaryClass} disabled={mutation.isPending}>Submit review</button></form>}
 {mutation.error&&<p role="alert" className="text-sm text-red-700">{mutation.error.message}</p>}{mutation.isSuccess&&<p role="status" className="text-sm text-emerald-800">Booking updated.</p>}
 </div>;
}
