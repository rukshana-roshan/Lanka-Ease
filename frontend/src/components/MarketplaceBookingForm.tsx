import { useState } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { useMutation,useQuery } from '@tanstack/react-query';
import { api,marketplaceApi } from '../services/api';
import { fieldClass,primaryClass,panelClass,money } from './MarketplaceUI';
import { localToday } from '../services/session';
export function MarketplaceBookingForm({providerId}:{providerId:number}){
 const [params]=useSearchParams();const navigate=useNavigate();
 const provider=useQuery({queryKey:['marketplace-profile',String(providerId)],queryFn:()=>marketplaceApi.profile(providerId),retry:false});
 const [serviceId,setServiceId]=useState(Number(params.get('serviceId'))||0);const [categoryId,setCategoryId]=useState(Number(params.get('categoryId'))||0);
 const [description,setDescription]=useState('');const [date,setDate]=useState(localToday());const [time,setTime]=useState('');const [address,setAddress]=useState('');const [urgency,setUrgency]=useState<'NORMAL'|'TODAY'|'URGENT'>('NORMAL');
 const selected=provider.data?.services.find(s=>s.id===serviceId);
 const booking=useMutation({mutationFn:()=>api.createServiceRequest({providerId,serviceId:serviceId||undefined,categoryId:selected?.categoryId||categoryId||provider.data?.categories[0]?.id,problemDescription:description,address,preferredDate:date,preferredTime:time,urgency}),onSuccess:request=>navigate(`/app/requests/${request.id}`)});
 if(provider.error)return <p role="alert">{provider.error.message}</p>;
 if(!provider.data)return <p>Loading provider services…</p>;
 const p=provider.data;
 return <form className={`${panelClass} mx-auto max-w-2xl`} onSubmit={e=>{e.preventDefault();booking.mutate();}}><h1 className="text-3xl font-semibold">Request a service</h1><p>Booking with {p.businessName||p.fullName}. The provider will confirm your request.</p>
 {p.services.length>0?<label className="block text-sm">Service<select className={fieldClass} required value={serviceId||''} onChange={e=>setServiceId(Number(e.target.value))}><option value="">Select a service</option>{p.services.map(s=><option key={s.id} value={s.id}>{s.title} — from {money(s.priceMin)}</option>)}</select></label>:<label className="block text-sm">Category<select className={fieldClass} required value={categoryId||p.categories[0]?.id||''} onChange={e=>setCategoryId(Number(e.target.value))}><option value="">Select a category</option>{p.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}
 <label className="block text-sm">Describe the problem<textarea className={fieldClass} required maxLength={5000} value={description} onChange={e=>setDescription(e.target.value)}/></label>
 <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Preferred date<input className={fieldClass} type="date" min={localToday()} required value={date} onChange={e=>setDate(e.target.value)}/></label><label className="text-sm">Preferred time (Sri Lanka time)<input className={fieldClass} type="time" required value={time} onChange={e=>setTime(e.target.value)}/></label></div>
 <label className="block text-sm">Service address<textarea className={fieldClass} required maxLength={3000} value={address} onChange={e=>setAddress(e.target.value)}/></label><label className="block text-sm">Urgency<select className={fieldClass} value={urgency} onChange={e=>setUrgency(e.target.value as typeof urgency)}><option value="NORMAL">Normal</option><option value="TODAY">Today</option>{p.details.emergency&&<option value="URGENT">Emergency</option>}</select></label>
 {p.details.hours?.length>0&&<p className="text-sm">Working days: {p.details.hours.map(h=>h.day.toLowerCase()).join(', ')}.</p>}{p.details.blockedDates?.length>0&&<p className="text-sm">Unavailable dates: {p.details.blockedDates.join(', ')}.</p>}
 {booking.error&&<p role="alert" className="text-red-700">{booking.error.message}</p>}<button className={primaryClass} disabled={booking.isPending||(!p.services.length&&!p.categories.length)}>{booking.isPending?'Submitting…':'Submit request'}</button>
 </form>;
}
