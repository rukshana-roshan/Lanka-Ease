import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { MarketplaceProvider } from '../types/marketplace';
export const fieldClass='mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:bg-slate-900 dark:text-slate-100';
export const actionClass='inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold disabled:opacity-50';
export const primaryClass=`${actionClass} bg-emerald-900 text-white`;
export const panelClass='space-y-4 rounded-3xl border border-slate-200 bg-white p-5 dark:bg-slate-900';
export const money=(n:number)=>new Intl.NumberFormat('en-LK',{style:'currency',currency:'LKR'}).format(n);
export const regions:Record<string,string[]>={
 'Western':['Colombo','Gampaha','Kalutara'],'Central':['Kandy','Matale','Nuwara Eliya'],
 'Southern':['Galle','Matara','Hambantota'],'Northern':['Jaffna','Kilinochchi','Mannar','Mullaitivu','Vavuniya'],
 'Eastern':['Trincomalee','Batticaloa','Ampara'],'North Western':['Kurunegala','Puttalam'],
 'North Central':['Anuradhapura','Polonnaruwa'],'Uva':['Badulla','Monaragala'],'Sabaragamuwa':['Ratnapura','Kegalle'],
};
export function ProviderActions({provider,serviceId,categoryId}:{provider:MarketplaceProvider;serviceId?:number;categoryId?:number}){
 const {user}=useAuth();
 if(user?.id===provider.userId)return <Link className={primaryClass} to="/provider">Edit your profile</Link>;
 if(user&&user.role!=='CUSTOMER')return null;
 return <div className="flex flex-wrap gap-2"><Link className={actionClass} to={`/app/messages?conversationWith=${provider.userId}`}>Chat</Link>
 <Link className={primaryClass} to={`/app/request?providerId=${provider.id}${serviceId?`&serviceId=${serviceId}`:''}${categoryId?`&categoryId=${categoryId}`:''}`}>Request service</Link></div>;
}
