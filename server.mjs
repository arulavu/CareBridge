import http from 'node:http';
import {topicForConcern,safetyScreen} from './triage.js';
import {medicationReaction} from './reaction.js';
const PORT=Number(process.env.PORT||8787);
const KEY=process.env.OPENAI_API_KEY;
const MODEL=process.env.OPENAI_MODEL||'gpt-4o-mini';
const ORIGIN=process.env.ALLOWED_ORIGIN||'http://localhost:8080';
const max=48_000;
const prompt=`You are CareBridge, an educational health-information conversation assistant, not a doctor or diagnostic service. You must respond to the user's MOST RECENT question, using prior conversation only when relevant. When the user switches topics, explicitly acknowledge the new topic and do not repeat old advice. If they ask about diarrhea and constipation after a hand injury, discuss digestive concerns, not the hand, unless the earlier injury is medically relevant. If the user is greeting or correcting you, respond conversationally without unsolicited symptom advice. Ask at most 1–2 clinically relevant clarifying questions at a time; don't force a questionnaire. Explain uncertainty and avoid diagnosis, medication dosing or asserting self-care is safe without appropriate assessment. For concerning symptoms recommend timely in-person evaluation; for possible emergencies direct the user to local emergency services immediately. Never say a negative safety screen rules out danger. Do not invent citations, medical sources, clinician availability, photo findings, or live referrals. You have no verified medical retrieval and no image analysis. For routine checkups, explain what to discuss with a primary-care professional. Respond in the user's language where possible. Keep replies concise, empathetic, and practical. This is a fictional demonstration: remind users not to enter identifiable health data.`;
function respond(res,status,body,origin){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':origin,'Vary':'Origin','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store'});res.end(JSON.stringify(body));}
const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin||'';const allowed=origin===ORIGIN||(ORIGIN==='*'&&!origin);
 if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,configured:!!KEY}));return;}
 if(req.url!=='/api/chat'||!['POST','OPTIONS'].includes(req.method)){res.writeHead(404);res.end();return;}
 if(!allowed){res.writeHead(403);res.end('Origin not allowed');return;}
 if(req.method==='OPTIONS'){respond(res,200,{ok:true},origin);return;}
 let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>max){respond(res,413,{error:'Message too large'},origin);return;}}
 try{
  const data=JSON.parse(raw);if(!Array.isArray(data.messages)||data.messages.length>40)throw Error('Invalid conversation');
  const messages=data.messages.slice(-24).map(m=>({role:m.role,content:String(m.content||'').slice(0,2000)})).filter(m=>['user','assistant'].includes(m.role)&&m.content);
  if(!messages.length||messages.at(-1).role!=='user')throw Error('Missing user message');
  const current=messages.at(-1).content;
  const history=messages.slice(0,-1).filter(m=>m.role==='user').map(m=>m.content);
  const reaction=medicationReaction(current,history);
  if(reaction){respond(res,200,{reply:reaction.message,urgent:true,source:'safety-rule'},origin);return;}
  const screened=safetyScreen(current,topicForConcern(current));
  if(screened.level==='emergency'||screened.level==='urgent'){respond(res,200,{reply:screened.message,urgent:true,source:'safety-rule'},origin);return;}
  if(!KEY){respond(res,503,{error:'OPENAI_API_KEY not configured'},origin);return;}
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
  let response;try{response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,temperature:0.2,max_tokens:420,messages:[{role:'system',content:prompt},...messages]}),signal:controller.signal});}finally{clearTimeout(timeout);}
  if(!response.ok){respond(res,502,{error:'AI provider unavailable'},origin);return;}
  const result=await response.json();const reply=result.choices?.[0]?.message?.content;
  if(typeof reply!=='string'||!reply.trim())throw Error('Empty model response');
  const safetyPrefix=screened.level==='prompt'?screened.message+'\\n\\n':'';
  respond(res,200,{reply:safetyPrefix+reply,source:'ai-model',urgent:screened.level==='prompt'},origin);
 }catch(e){respond(res,400,{error:'Could not process this request'},origin);}
});server.listen(PORT,()=>console.log('CareBridge AI backend listening on '+PORT));
