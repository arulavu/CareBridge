// A backend URL is required for real AI. No private API keys belong in browser code.
import {safetyScreen,topicForConcern} from './triage.js';
import {medicationReaction} from './reaction.js';
const url=String(globalThis.CAREBRIDGE_API_URL||'').replace(/\/$/,'');
export const aiConfigured=()=>/^https?:\/\//.test(url);
export async function aiReply(messages,signal){
 const recent=messages.filter(m=>m.role==='user'||m.role==='ai').slice(-24).map(m=>({role:m.role==='ai'?'assistant':'user',content:String(m.text||'').slice(0,2000)}));
 const current=recent.at(-1)?.content||'';
 const history=recent.slice(0,-1).filter(m=>m.role==='user').map(m=>m.content);
 const reaction=medicationReaction(current,history);
 // Immediate client-side safeguard, also independently checked on the server.
 if(reaction)return {reply:reaction.message,urgent:true};
 const screen=safetyScreen(current,topicForConcern(current));
 if(screen.level==='emergency')return {reply:screen.message,urgent:true};
 const res=await fetch(url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:recent}),signal});
 if(!res.ok)throw new Error('AI service unavailable ('+res.status+')');
 const data=await res.json();if(typeof data.reply!=='string'||!data.reply.trim())throw new Error('Empty AI response');
 return data;
}
