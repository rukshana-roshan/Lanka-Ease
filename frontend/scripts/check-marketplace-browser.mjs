import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
// Local-only end-to-end test: refuses hosted databases/services.
const backend='http://127.0.0.1:18081', frontend='http://127.0.0.1:5177';
for(const value of [backend,frontend])assert.equal(new URL(value).hostname,'127.0.0.1');
const unique=randomUUID().slice(0,8), password=randomUUID()+'-Aa1!';
const http=async(path,options={},token)=>{const r=await fetch(backend+'/api'+path,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...options.headers}});const text=await r.text();if(!r.ok)throw Error(`${path}: ${r.status} ${text}`);return text?JSON.parse(text):null;};
const provider=await http('/auth/register/provider',{method:'POST',body:JSON.stringify({fullName:'Browser QA Provider',businessName:'QA Electrician '+unique,email:`provider-${unique}@example.test`,phone:'07'+String(Date.now()).slice(-8),password})});
const customer=await http('/auth/register',{method:'POST',body:JSON.stringify({fullName:'Browser QA Customer',email:`customer-${unique}@example.test`,phone:'06'+String(Date.now()).slice(-8),password})});
const categories=await http('/services');const category=categories.find(c=>c.slug==='electrical');assert.ok(category);
await http('/marketplace/me',{method:'PUT',body:JSON.stringify({fullName:'Browser QA Provider',businessName:'QA Electrician '+unique,email:provider.user.email,phone:provider.user.phone,description:'Local test professional for browser verification',experienceYears:7,priceMin:1500,priceMax:3000,categoryIds:[category.id],serviceCities:['Dehiwala'],details:{whatsapp:'',subcategory:'Wiring',qualifications:'Test certificate',province:'Western',district:'Colombo',city:'Dehiwala',portfolio:[],hours:[],blockedDates:[],emergency:false,availabilityStatus:'AVAILABLE'}})},provider.token);
const service=await http('/marketplace/me/services',{method:'POST',body:JSON.stringify({categoryId:category.id,title:'QA socket repair',description:'Repair a household socket',priceMin:1500,priceMax:3000,durationMinutes:60,active:true})},provider.token);
const own=await http('/marketplace/me',{},provider.token);
const tab=await(await fetch('http://127.0.0.1:9225/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let id=0;const pending=new Map(), errors=[], checks=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.reject(m.error):p?.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+m.params.exceptionDetails.exception?.description);};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(pending.has(n)){pending.delete(n);reject(Error('CDP timeout: '+method));}},20000).unref();});
const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const until=async(expression)=>{for(let i=0;i<50;i++){if(await evaluate(expression))return;await wait(200);}throw Error('UI condition timed out: '+expression);};
const visit=async(path)=>{await cdp('Page.navigate',{url:frontend+path});await until('document.readyState==="complete"');await wait(400);};
const fill=async(selector,value)=>evaluate(`(()=>{const input=document.querySelector(${JSON.stringify(selector)});if(!input)throw Error('Input missing: '+${JSON.stringify(selector)});const prototype=input.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:input.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(prototype,'value').set.call(input,${JSON.stringify(value)});input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const click=async(text)=>{await until(`[...document.querySelectorAll('button,a')].some(b=>b.textContent.trim()===${JSON.stringify(text)}&&!b.disabled)`);return evaluate(`(()=>{const button=[...document.querySelectorAll('button,a')].find(b=>b.textContent.trim()===${JSON.stringify(text)});button.click();})()`);};
const screenshot=async(name)=>{const r=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await fs.writeFile('.design-qa/'+name+'.png',Buffer.from(r.data,'base64'));};
const check=(name,passed)=>{assert.ok(passed,name);checks.push({name,passed:true});console.log(name+': passed');};
const login=async(account,redirect)=>{await visit('/login');await evaluate('localStorage.clear();sessionStorage.clear()');await visit('/login?redirect='+encodeURIComponent(redirect));await fill('input[type=email]',account.user.email);await fill('input[type=password]',password);await evaluate('document.querySelector("form").requestSubmit()');await until(`location.pathname===${JSON.stringify(redirect.split('?')[0])}`);};
try{
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await visit('/providers');await until('document.querySelector("input[type=search]")!==null');await fill('input[type=search]','QA Electrician '+unique);await until('document.body.innerText.includes("1 professionals found")');
 check('Directory search filters database results',await evaluate('document.querySelectorAll("article").length===1'));await screenshot('marketplace-directory-desktop');
 await visit('/providers/'+own.id);await until('document.body.innerText.includes("QA socket repair")');check('Public profile renders saved services and real review state',await evaluate('document.body.innerText.includes("No customer reviews yet")'));
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await screenshot('marketplace-profile-mobile');check('Mobile profile fits viewport',await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'));
 await login(customer,'/providers/'+own.id);await until('document.body.innerText.includes("QA socket repair")');await evaluate('document.querySelector("a[href*=serviceId]").click()');await until('document.querySelector("form select")!==null');
 await fill('select',String(service.id));const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);
 await fill('textarea','Please repair the socket');await fill('input[type=date]',tomorrow);await fill('input[type=time]','10:00');
 await evaluate(`(()=>{const input=document.querySelectorAll('textarea')[1];Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,'QA house, Dehiwala');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
 await click('Submit request');await until('location.pathname.startsWith("/app/requests/")');const bookings=await http('/requests/customer',{},customer.token);assert.equal(bookings.length,1);const booking=bookings[0];check('Customer booking persists through frontend submission',booking.serviceId===service.id);
 await login(provider,'/provider');await until('document.body.innerText.includes("Accept request")');await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await screenshot('marketplace-provider-desktop');
 await evaluate(`([...document.querySelectorAll('summary')].find(s=>s.textContent.includes('Profile, portfolio'))).click()`);
 await evaluate(`(()=>{const form=[...document.querySelectorAll('form')].find(f=>f.innerText.includes('Professional description'));const input=form.querySelector('textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,'Updated through the browser profile form');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
 await click('Save profile and availability');await until('document.body.innerText.includes("Profile and availability saved.")');check('Provider profile edits persist from UI',(await http('/marketplace/me',{},provider.token)).description==='Updated through the browser profile form');
 await click('Available — set unavailable');await until('document.body.innerText.includes("Unavailable — set available")');check('Availability change persists',!(await http('/marketplace/me',{},provider.token)).isAvailable);
 await click('Unavailable — set available');await until('document.body.innerText.includes("Available — set unavailable")');
 for(const [button,status] of [['Accept request','ACCEPTED'],['On my way','ON_THE_WAY'],['Mark arrived','ARRIVED'],['Start work','WORKING']]){await click(button);await until(`document.body.innerText.includes(${JSON.stringify(status==='WORKING'?'Complete work':status==='ARRIVED'?'Start work':status==='ON_THE_WAY'?'Mark arrived':'On my way')})`);}
 await click('Complete work');await until('document.body.innerText.includes("Confirm completion")');
 // Fill the two completion inputs by their form, because profile editors also contain numeric fields.
 await evaluate(`(()=>{const form=[...document.querySelectorAll('form')].find(f=>f.innerText.includes('Labour fee (LKR)'));const inputs=form.querySelectorAll('input');for(const [i,value] of ['1500','300'].entries()){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(inputs[i],value);inputs[i].dispatchEvent(new Event('input',{bubbles:true}));}})()`);
 await click('Confirm completion');await until('!document.body.innerText.includes("Confirm completion")');const complete=await http('/requests/'+booking.id,{},customer.token);check('Provider completion saves actual charges',complete.status==='COMPLETED'&&complete.finalPrice===2000);
 await login(customer,'/providers/'+own.id);await click('Chat');await until('location.pathname==="/app/messages"&&document.body.innerText.includes("Your message")');await fill('textarea','Thank you for the repair');await click('Send');await until('document.body.innerText.includes("Thank you for the repair")');
 const conversations=await http('/conversations',{},customer.token);const messages=await http('/conversations/'+conversations[0].id+'/messages',{},customer.token);check('Customer chat message persists',messages.some(m=>m.textContent==='Thank you for the repair'));
 await screenshot('marketplace-chat-desktop');check('No browser runtime errors',errors.length===0);
 await fs.writeFile('.design-qa/marketplace-browser-results.json',JSON.stringify({checks,errors},null,2));
}catch(error){await fs.writeFile('.design-qa/marketplace-browser-results.json',JSON.stringify({checks,errors,failure:error.message},null,2));throw error;}finally{ws.close();}
