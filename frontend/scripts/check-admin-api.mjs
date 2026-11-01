import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real API client with controlled HTTP responses; no live data changes.
const calls = [];
let response = () => Response.json({ id: 7 });
const context = vm.createContext({
  URLSearchParams, AbortController, structuredClone,
  window: { setTimeout, clearTimeout },
  fetch: async (url, options) => { calls.push({ url, ...options }); return response(); },
});
const source = ts.transpileModule(fs.readFileSync(new URL('../src/services/api.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const mod = new vm.SourceTextModule(source, {
  context, initializeImportMeta: meta => { meta.env = { VITE_API_BASE_URL: 'https://api.example.test' }; },
});
await mod.link(specifier => {
  const values = specifier.includes('session') ? {
    demoStorageKey: () => '', isDemoSession: () => false,
    sessionValue: () => 'test-admin-token', localToday: () => '',
  } : { MOCK_CATEGORIES: [], MOCK_PROVIDERS: [] };
  return new vm.SyntheticModule(Object.keys(values), function () {
    for (const [key, value] of Object.entries(values)) this.setExport(key, value);
  }, { context });
});
await mod.evaluate();
const { adminApi, providerApi, marketplaceApi } = mod.namespace;
await marketplaceApi.directory({q:'A & B',province:'Western',city:'Dehiwala',minPrice:'1500',verifiedOnly:'true',page:'1'});
let directoryURL=new URL(calls.at(-1).url);
assert.equal(directoryURL.searchParams.get('q'),'A & B');
assert.equal(directoryURL.searchParams.get('city'),'Dehiwala');
assert.equal(directoryURL.searchParams.get('verifiedOnly'),'true');
await marketplaceApi.saveService({id:4,categoryId:2,title:'Repair',description:'Socket',priceMin:1500,priceMax:2500,durationMinutes:60,active:true});
assert.equal(calls.at(-1).url,'https://api.example.test/api/marketplace/me/services/4');
assert.equal(calls.at(-1).method,'PUT');
await marketplaceApi.startConversation(45,7);
assert.equal(new URL(calls.at(-1).url).searchParams.get('providerUserId'),'45');
await assert.rejects(marketplaceApi.privateImage('https://untrusted.invalid/document'),error=>error.message==='Invalid document location.');
await assert.rejects(marketplaceApi.upload({type:'image/svg+xml',size:10},'PROFILE'),error=>error.message.includes('JPEG, PNG or GIF'));
await providerApi.getProfile();
assert.equal(calls.at(-1).url, 'https://api.example.test/api/providers/me');
await providerApi.getRequests();
assert.equal(calls.at(-1).url, 'https://api.example.test/api/requests/provider');
await providerApi.setAvailability(false);
assert.equal(calls.at(-1).method, 'PATCH');
assert.equal(new URL(calls.at(-1).url).searchParams.get('isAvailable'), 'false');
await providerApi.updateRequest(9, { newStatus: 'COMPLETED', labourFee: 1500, partsFee: 0, finalPrice: 1700 });
assert.equal(calls.at(-1).url, 'https://api.example.test/api/requests/9/status');
assert.equal(calls.at(-1).method, 'PATCH');
assert.deepEqual(JSON.parse(calls.at(-1).body), { newStatus: 'COMPLETED', labourFee: 1500, partsFee: 0, finalPrice: 1700 });
assert.equal(calls.at(-1).headers.Authorization, 'Bearer test-admin-token');
await adminApi.getContactMessages(2);
assert.equal(calls.at(-1).url, 'https://api.example.test/api/admin/contact-messages?page=2&size=20');
assert.equal(calls.at(-1).headers.Authorization, 'Bearer test-admin-token');
await adminApi.getStats();
assert.equal(calls.at(-1).url, 'https://api.example.test/api/admin/stats');
assert.equal(calls.at(-1).headers.Authorization, 'Bearer test-admin-token');
await adminApi.updateUser({ id: 7, fullName: 'Name & Surname', phone: '+94770000000', role: 'ADMIN' });
let url = new URL(calls.at(-1).url);
assert.equal(calls.at(-1).method, 'PUT');
assert.equal(url.searchParams.get('fullName'), 'Name & Surname');
assert.equal(url.searchParams.get('phone'), '+94770000000');
await adminApi.verifyProvider(5, 'APPROVED');
assert.equal(calls.at(-1).method, 'PATCH');
assert.match(calls.at(-1).url, /\/admin\/providers\/5\/verify\?status=APPROVED$/);
await adminApi.saveCategory({ name: 'New service', slug: 'new-service', description: 'A & B', iconName: 'Wrench', isActive: true });
assert.equal(calls.at(-1).method, 'POST');
assert.equal(new URL(calls.at(-1).url).searchParams.get('description'), 'A & B');
response = () => new Response(null, { status: 204 });
assert.equal(await adminApi.deleteCategory(7), undefined);
assert.equal(calls.at(-1).method, 'DELETE');
response = () => Response.json({ message: 'Access denied' }, { status: 403 });
await assert.rejects(adminApi.getUsers(), error => error.status === 403 && error.message === 'Access denied');
console.log('Admin and provider API checks passed: authentication, routes, encoding, availability, completion fees, empty delete responses, and authorization errors.');
