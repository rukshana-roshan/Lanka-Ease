import { useEffect,useState } from 'react';
import { useQuery,keepPreviousData } from '@tanstack/react-query';
import { Link,useSearchParams } from 'react-router-dom';
import { api,marketplaceApi,mediaUrl } from '../services/api';
import { PageIntro } from '../components/PageIntro';
import { SafeImage } from '../components/SafeImage';
import { brandAvatar } from '../components/BrandAvatar';
import { ProviderActions,fieldClass,actionClass,panelClass,regions,money } from '../components/MarketplaceUI';

export function MarketplaceDirectory(){
 const [params]=useSearchParams();
 const [search,setSearch]=useState(params.get('search')||'');
 const [filters,setFilters]=useState<Record<string,string>>({q:params.get('search')||'',categoryId:params.get('categoryId')||'',province:'',district:'',city:params.get('city')||'',verifiedOnly:'false',availableOnly:'false',minPrice:'',maxPrice:'',minRating:'0',experience:'0',sort:'rating',page:'0'});
 const categories=useQuery({queryKey:['categories'],queryFn:api.getCategories});
 useEffect(()=>{const timeout=setTimeout(()=>setFilters(previous=>({...previous,q:search,page:'0'})),300);return()=>clearTimeout(timeout);},[search]);
 useEffect(()=>{if(params.get('category')&&categories.data){const category=categories.data.find(c=>c.slug===params.get('category'));if(category)setFilters(f=>({...f,categoryId:String(category.id)}));}},[params,categories.data]);
 const results=useQuery({queryKey:['marketplace-directory',filters],queryFn:()=>marketplaceApi.directory(filters),placeholderData:keepPreviousData,retry:false});
 const update=(key:string,value:string)=>setFilters(previous=>({...previous,[key]:value,page:'0',...(key==='province'?{district:'',city:''}:key==='district'?{city:''}:{})}));
 const reset=()=>{setSearch('');setFilters({q:'',categoryId:'',province:'',district:'',city:'',verifiedOnly:'false',availableOnly:'false',minPrice:'',maxPrice:'',minRating:'0',experience:'0',sort:'rating',page:'0'});};
 const activeCount=Object.entries(filters).filter(([key,value])=>!['q','sort','page'].includes(key)&&!['','0','false'].includes(value)).length;
 const locations=results.data?.locations||[];
 return <div className="designed-page providers-page space-y-6 pb-20">
 <PageIntro eyebrow="GOOD HELP, CLOSE TO HOME" title="Find your kind of professional." description="Compare local services and choose the right professional for your home." image="/images/ease-repair-v3.png"/>
 <section className={panelClass} aria-label="Search and filter professionals">
  <label className="block text-sm">Search professionals<input type="search" list="provider-search-suggestions" className={fieldClass} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, business, profession, category, city or district"/></label>
  <datalist id="provider-search-suggestions">{[...new Set([...(categories.data||[]).map(c=>c.name),...locations.map(l=>l.city)])].filter(Boolean).map(s=><option key={s} value={s}/>)}</datalist>
  <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Service categories">
   <button aria-pressed={!filters.categoryId} className={`${actionClass} shrink-0 ${!filters.categoryId?'bg-emerald-900 text-white':''}`} onClick={()=>update('categoryId','')}>All categories ({results.data?.allCount??0})</button>
   {categories.data?.filter(c=>c.isActive).map(c=><button key={c.id} aria-pressed={filters.categoryId===String(c.id)} className={`${actionClass} shrink-0 ${filters.categoryId===String(c.id)?'bg-emerald-900 text-white':''}`} onClick={()=>update('categoryId',String(c.id))}>{c.name} ({results.data?.categoryCounts[c.id]??0})</button>)}
  </div>
  <div className="grid gap-3 sm:grid-cols-3">
   <label className="text-sm">Base province<select className={fieldClass} value={filters.province} onChange={e=>update('province',e.target.value)}><option value="">All provinces</option>{Object.keys(regions).map(r=><option key={r}>{r}</option>)}</select></label>
   <label className="text-sm">Base district<select className={fieldClass} value={filters.district} onChange={e=>update('district',e.target.value)}><option value="">All districts</option>{(filters.province?regions[filters.province]:Object.values(regions).flat()).map(r=><option key={r}>{r}</option>)}</select></label>
   <label className="text-sm">Service city<select className={fieldClass} value={filters.city} onChange={e=>update('city',e.target.value)}><option value="">All supported cities</option>{[...new Set(locations.map(l=>l.city).filter(Boolean))].sort().map(r=><option key={r}>{r}</option>)}</select></label>
  </div>
  <details><summary className="cursor-pointer text-sm font-semibold">More filters {activeCount>0&&`(${activeCount} active)`}</summary><div className="mt-4 grid gap-3 sm:grid-cols-3">
   <label className="text-sm">Minimum starting price (LKR)<input className={fieldClass} type="number" min="0" value={filters.minPrice} onChange={e=>update('minPrice',e.target.value)}/></label>
   <label className="text-sm">Maximum starting price (LKR)<input className={fieldClass} type="number" min="0" value={filters.maxPrice} onChange={e=>update('maxPrice',e.target.value)}/></label>
   <label className="text-sm">Minimum rating<select className={fieldClass} value={filters.minRating} onChange={e=>update('minRating',e.target.value)}>{[0,1,2,3,4,5].map(n=><option key={n} value={n}>{n===0?'Any rating':`${n}+ stars`}</option>)}</select></label>
   <label className="text-sm">Minimum experience (years)<input className={fieldClass} type="number" min="0" max="80" value={filters.experience} onChange={e=>update('experience',e.target.value)}/></label>
  </div></details>
  <div className="flex flex-wrap items-center gap-4 text-sm"><label className="flex gap-2"><input type="checkbox" checked={filters.verifiedOnly==='true'} onChange={e=>update('verifiedOnly',String(e.target.checked))}/>Verified professionals only</label>
   <label className="flex gap-2"><input type="checkbox" checked={filters.availableOnly==='true'} onChange={e=>update('availableOnly',String(e.target.checked))}/>Available today only</label>
   <label>Sort by<select className={fieldClass} value={filters.sort} onChange={e=>update('sort',e.target.value)}><option value="rating">Rating</option><option value="price">Starting price</option><option value="experience">Experience</option><option value="newest">Newest</option></select></label>
   <button className={actionClass} onClick={reset}>Clear filters</button>
  </div>
 </section>
 {(results.error||categories.error)&&<div role="alert" className={panelClass}><p>{(results.error||categories.error)?.message}</p><button className={actionClass} onClick={()=>{void results.refetch();void categories.refetch();}}>Retry</button></div>}
 {results.isPending?<div aria-label="Loading professionals" role="status" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(n=><div key={n} className={`${panelClass} h-64 animate-pulse bg-slate-100`}>Loading…</div>)}</div>:<>
 <p role="status" className="text-sm">{results.isFetching?'Updating results…':`${results.data?.totalElements??0} professionals found`}</p>
 {results.data?.content.length===0&&<div className={`${panelClass} text-center`}><h2>No professionals found</h2><p>Try another location, service, or price range.</p><button className={actionClass} onClick={reset}>Clear filters</button></div>}
 <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-busy={results.isFetching}>{results.data?.content.map(p=><article key={p.id} className={`${panelClass} flex flex-col justify-between`}>
  <div className="space-y-3"><Link to={`/providers/${p.id}`} className="flex items-center gap-3"><SafeImage className="h-16 w-16 rounded-2xl object-cover" src={mediaUrl(p.profileImage)} fallbackSrc={brandAvatar(p.fullName)} alt={p.fullName}/><div><h2 className="font-semibold">{p.businessName||p.fullName}</h2><p className="text-sm">{p.fullName} · {p.categories[0]?.name||'Services not configured'}</p></div></Link>
  <div className="flex flex-wrap gap-2 text-xs">{p.isVerified&&<span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-800">Verified professional</span>}<span>{p.isAvailable?'Available today':p.details.availabilityStatus==='OFFLINE'?'Offline':'Busy / unavailable today'}</span></div>
  <p className="line-clamp-2 text-sm">{p.description}</p><p className="text-sm">{[p.details.city,p.details.district].filter(Boolean).join(', ')||p.serviceCities.join(', ')||'Location not provided'}</p>
  <div className="rounded-xl bg-stone-50 p-3 text-sm"><p>{p.reviewCount?`${Number(p.ratingAvg).toFixed(1)} stars · ${p.reviewCount} reviews`:'No reviews yet'} · {p.jobsCompletedCount} completed jobs</p><p className="mt-1 font-semibold">From {money(p.priceMin)}</p></div></div>
  <div className="space-y-3 pt-4"><Link className={`${actionClass} w-full`} to={`/providers/${p.id}`}>View full profile</Link><ProviderActions provider={p}/></div>
 </article>)}</div>
 {results.data&&results.data.totalPages>1&&<div className="flex items-center justify-center gap-3"><button className={actionClass} disabled={Number(filters.page)===0||results.isFetching} onClick={()=>setFilters(f=>({...f,page:String(Number(f.page)-1)}))}>Previous</button><span>Page {Number(filters.page)+1} of {results.data.totalPages}</span><button className={actionClass} disabled={Number(filters.page)+1>=results.data.totalPages||results.isFetching} onClick={()=>setFilters(f=>({...f,page:String(Number(f.page)+1)}))}>Next</button></div>}
 </>}
 </div>;
}
