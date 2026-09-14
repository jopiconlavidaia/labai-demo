const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(upstream=async()=>new Response('{"choices":[]}')) {
  let calls=0;
  const context=vm.createContext({Response,TextEncoder,AbortSignal,fetch:async(...args)=>{calls++;return upstream(...args);}});
  vm.runInContext(fs.readFileSync('worker/labai-ia-worker.js','utf8').replace('export default','globalThis.worker ='),context);
  return {worker:context.worker,calls:()=>calls};
}
function req(body={messages:[{role:'user',content:'QA'}]},origin='https://jopiconlavidaia.github.io',method='POST') {return new Request('https://worker.test/',{method,headers:{Origin:origin},...(method==='POST'?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});}
test('worker rejects unapproved origins before upstream call',async()=>{const a=setup();assert.equal((await a.worker.fetch(req({},'https://other.test'),{})).status,403);assert.equal(a.calls(),0);});
test('worker handles preflight without using provider',async()=>{const a=setup();const r=await a.worker.fetch(req({},undefined,'OPTIONS'),{});assert.equal(r.status,204);assert.equal(r.headers.get('Access-Control-Allow-Origin'),'https://jopiconlavidaia.github.io');assert.equal(r.headers.get('Vary'),'Origin');assert.equal(a.calls(),0);});
test('worker rejects missing credentials',async()=>assert.equal((await setup().worker.fetch(req(),{})).status,503));
test('worker rejects malformed, excessive or invalid requests',async()=>{for(const body of ['bad','null',{messages:[]},{messages:[null]},{messages:[{role:'unknown',content:'QA'}]},{messages:[{role:'user',content:'QA'}],max_tokens:-1},{messages:[{role:'user',content:'QA'}],temperature:9}]){const a=setup();assert.equal((await a.worker.fetch(req(body),{GROQ_API_KEY:'test'})).status,400);assert.equal(a.calls(),0);}assert.equal((await setup().worker.fetch(req('x'.repeat(64001)),{GROQ_API_KEY:'test'})).status,413);});
test('worker forwards valid requests with server credentials',async()=>{const a=setup(async(url,options)=>{assert.equal(options.headers.Authorization,'Bearer test');assert.ok(options.signal);assert.equal(JSON.parse(options.body).messages[0].content,'QA');return new Response('{"ok":true}');});const r=await a.worker.fetch(req(),{GROQ_API_KEY:'test'});assert.equal(r.status,200);assert.equal(a.calls(),1);});
test('worker translates network errors into controlled 502',async()=>{const a=setup(async()=>{throw new Error('private upstream detail');});const r=await a.worker.fetch(req(),{GROQ_API_KEY:'test'});assert.equal(r.status,502);assert.ok(!(await r.text()).includes('private'));});
