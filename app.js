import {assess} from './guidance.js';
const $=id=>document.getElementById(id);const KEY='ai_clinic_worldbank_demo_v7';
let state={messages:[],answers:{},followups:[],stage:0,report:null,booking:null,handed:false};let selectedDoctor=null,selectedDate=null,selectedTime=null;
// Questions are selected by the patient's stated concern, not a single injury script.
const questionSets={
 respiratory:[
  {q:'Which symptoms are you experiencing?',key:'symptoms',choices:['Runny nose or congestion','Cough or sore throat','Fever or chills','Several symptoms','Other / unsure']},
  {q:'When did these symptoms begin?',key:'onset',choices:['Today','Yesterday','A few days ago','More than a week ago']},
  {q:'Do you have trouble breathing, chest pain, or difficulty swallowing?',key:'flags',choices:['None of these','Trouble breathing','Chest pain','Difficulty swallowing','Not sure']},
  {q:'What would you like to know?',key:'goal',choices:['Self-care information','What to avoid','When to contact a clinician','Find a doctor']}
 ],
 mental:[
  {q:'What would you like support with?',key:'symptoms',choices:['Stress or anxiety','Low mood','Sleep difficulties','Feeling overwhelmed','Other / prefer not to say']},
  {q:'How long have you been feeling this way?',key:'onset',choices:['Today','Several days','Several weeks','Longer','Prefer not to say']},
  {q:'Are you safe right now? You can skip details. If you may hurt yourself or someone else, seek immediate local crisis or emergency support.',key:'flags',choices:['I am safe','I am unsure','I need urgent help','Prefer not to say']},
  {q:'What kind of support would help?',key:'goal',choices:['Grounding and general self-care','Prepare to talk to someone','Find a professional','Not sure']}
 ],
 checkup:[
  {q:'What type of visit are you planning?',key:'symptoms',choices:['Routine annual check-up','Preventive screening','Follow-up on previous results','Vaccination discussion','Other']},
  {q:'Do you have any current symptoms you want to mention?',key:'onset',choices:['No current symptoms','Yes, I will describe them','Not sure']},
  {q:'Is there anything time-sensitive or concerning that you want to discuss?',key:'flags',choices:['No','New or worsening symptoms','A specific test or medication question','Prefer not to say']},
  {q:'What would you like help with?',key:'goal',choices:['Prepare questions for a clinician','Understand screening discussions','Book a demo appointment','All three']}
 ],
 injury:[
  {q:'Where is the injury, and what happened?',key:'symptoms',choices:['Hand or wrist after impact','Other limb injury','Cut or wound','Other / unsure']},
  {q:'When did the injury happen?',key:'onset',choices:['Today','Yesterday','A few days ago','Not sure']},
  {q:'Are there any concerning signs?',key:'flags',choices:['None reported','Numbness','Severe pain or major swelling','Change in shape or color','Cannot move normally','Open wound']},
  {q:'What information would be useful?',key:'goal',choices:['General first-aid information','Activities to avoid','When to seek assessment','Find a clinician']}
 ],
 general:[
  {q:'What symptoms or concerns would you like to discuss?',key:'symptoms',choices:['Pain or discomfort','Digestive symptoms','Skin concern','Medication or results question','Other / unsure']},
  {q:'When did this concern begin?',key:'onset',choices:['Today','Yesterday','A few days ago','Longer','Not sure']},
  {q:'Do you have any severe or rapidly worsening symptoms, chest pain, trouble breathing, or other urgent concerns?',key:'flags',choices:['None reported','Severe or worsening symptoms','Chest pain','Trouble breathing','Not sure']},
  {q:'How can I help you prepare?',key:'goal',choices:['General information','Questions for my clinician','Find a specialist','All three']}
 ]
};
function topicFor(text){
 const t=(text||'').toLowerCase();
 if(/suicid|self.harm|anxie|stress|depress|mental|panic|mood|therapy|psycholog|ұйқы|стресс|тревог|депресс/.test(t))return 'mental';
 if(/check.up|checkup|annual|routine|screening|preventive|vaccin|physical exam|профосмотр|тексеру/.test(t))return 'checkup';
 if(/cold|cough|flu|fever|sore throat|runny nose|congest|простуд|кашель|тұмау/.test(t))return 'respiratory';
 if(/injur|hit|hurt my hand|fell|fractur|broken|broke|sprain|wound|cut my|swoll|травм|ушиб/.test(t))return 'injury';
 if(/stomach|abdomen|abdominal|diarrh|nausea|vomit|digest|constipat/.test(t))return 'digestive';
 if(/skin|rash|itch|eczema|acne/.test(t))return 'skin';
 if(/\b(leg|calf|knee|ankle|foot|feet|thigh)\b/.test(t)&&/pain|ache|hurt|sore|swoll|broken|fractur/.test(t))return 'leg';
 if(/\b(back|spine)\b/.test(t)&&/pain|ache|hurt|sore/.test(t))return 'back';
 if(/headache|migraine|head hurts/.test(t))return 'headache';
 if(/pain|ache|sore|hurts/.test(t))return 'pain';
 return 'general';
}
questionSets.pain=[
 {q:'Where is the pain, and did it follow an injury? Please describe the exact location.',key:'symptoms',choices:['Leg or knee','Back','Head','Arm or hand','Other location']},
 {q:'When did it start?',key:'onset',choices:['Today','Yesterday','A few days ago','More than a week ago']},
 {q:'Do you have severe pain, numbness, swelling, difficulty walking or another worrying change?',key:'flags',choices:['None reported','Severe pain','Numbness','Swelling or redness','Difficulty walking','Not sure']},
 {q:'What would you like to know? You can ask more questions after the report.',key:'goal',choices:['What I can do now','What to avoid','When to seek care','All three']}
];
questionSets.leg=[
 {q:'Which part of your leg hurts, and was there an injury? You can describe it in your own words.',key:'symptoms',choices:['Knee','Calf','Ankle or foot','Whole leg','After a fall or impact']},
 {q:'When did the pain start?',key:'onset',choices:['Today','Yesterday','A few days ago','Longer']},
 {q:'Can you walk normally? Any one-sided swelling, redness, warmth, numbness or severe pain?',key:'flags',choices:['None of these','Difficulty walking or bearing weight','One-sided calf swelling, redness or warmth','Numbness','Severe pain','Not sure']},
 {q:'What would you like help with?',key:'goal',choices:['General self-care','What to avoid','When to seek assessment','All three']}
];
questionSets.back=questionSets.pain;questionSets.headache=questionSets.pain;
questionSets.digestive=questionSets.general;questionSets.skin=questionSets.general;
function activeQuestions(){return questionSets[state.topic||'general'];}
function critical(text){const t=String(text||'').toLowerCase();if(/^(none|none of these|none reported|no|i am safe|not applicable)$/.test(t.trim()))return false;return /(?:^|[.!?;]\s*)(?:i have |i am experiencing |experiencing |i need )?(?:chest pain|trouble breathing|difficulty breathing|severe bleeding|urgent help)|can't breathe|cannot breathe|i need urgent help|want to die|hurt myself|suicid|self.harm/i.test(t)&&!/^(?:no|not|without|deny|denies)\s+(?:chest pain|trouble breathing|difficulty breathing|severe bleeding)/i.test(t.trim());}
function concernGuidance(){const a=state.answers;const all=[a.concern,a.symptoms,a.flags,...(state.followups||[])].join(' ');return assess(all,extractFlags(all,a),state.topic)}
const doctors=[{id:0,name:'Dr. Amina Sadykova',initials:'AS',role:'General practitioner',specialty:'General practice',languages:'English · Kazakh',format:'Video · In-person',slots:['09:30','11:00','14:30']},{id:1,name:'Dr. Daniel Lee',initials:'DL',role:'Orthopedic specialist',specialty:'Orthopedics',languages:'English',format:'Video · In-person',slots:['10:00','13:00','16:00']},{id:2,name:'Dr. Maya Karim',initials:'MK',role:'Primary care clinician',specialty:'General practice',languages:'Kazakh · English',format:'Video · In-person',slots:['09:00','12:30','15:00']}];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function bubble(role,message){state.messages.push({role,message});renderMessages();persist()}
function renderMessages(){const area=$('messages');area.replaceChildren();state.messages.forEach(m=>{const d=document.createElement('div');d.className='bubble '+m.role;d.textContent=m.message;area.append(d)});area.scrollTop=area.scrollHeight;const quick=$('quickChoices');if(quick)quick.remove();if(state.stage>0&&state.stage<=activeQuestions().length){const row=document.createElement('div');row.className='quick';row.id='quickChoices';activeQuestions()[state.stage-1].choices.forEach(c=>{const b=document.createElement('button');b.textContent=c;b.type='button';b.onclick=()=>receive(c);row.append(b)});area.after(row)}}
function ask(){if(state.stage<=activeQuestions().length){bubble('ai',activeQuestions()[state.stage-1].q)}else{bubble('ai','Thank you. Your preliminary report is ready. Select “Analyse consultation” to view general guidance, source references and demonstration specialists.')}}
function receive(value){const v=value.trim();if(!v)return;if(state.stage===0){state.answers.concern=v;state.topic=topicFor(v);state.stage=1;bubble('user',v);const isEmergency=critical(v);if(isEmergency)bubble('ai','Your description may include an emergency warning sign. Seek immediate local emergency assistance now; do not wait for this demonstration.');const early=assess(v,{},state.topic);if(early.urgent&&!isEmergency)bubble('ai',early.guidance);else if(early.recognized)bubble('ai','I understand you mentioned '+early.topic+' symptoms. I will ask a few related questions. This cannot rule out serious causes.');ask()}else if(state.stage<=activeQuestions().length){state.answers[activeQuestions()[state.stage-1].key]=v;state.stage++;bubble('user',v);if(state.topic==='pain'&&state.stage===2){const updated=topicFor(v+' pain');if(['leg','back','headache'].includes(updated))state.topic=updated;}if(critical(v))bubble('ai','You may have reported an urgent concern. If you are in immediate danger, contact local emergency or crisis services. This demo cannot assess urgency.');if(state.stage>activeQuestions().length){const preview=concernGuidance();bubble('ai',preview.guidance+'\n\nYour report can be refreshed at any time. You may also ask more questions.');}ask()}else handleFollowup(v);$('messageInput').value='';updateProgress();persist()}
// After the initial intake, accept multiple additional symptoms and questions in the same session.
// Answers are from a narrow reviewed educational library, never generated diagnoses.
function handleFollowup(v){
 state.followups=state.followups||[];
 state.followups.push(v);
 bubble('user',v);
 const context=[state.answers.concern,state.answers.symptoms,state.answers.flags,...state.followups].join(' ');
 const followTopic=topicFor(v);const guide=assess(context,extractFlags(context,state.answers),followTopic==='general'?state.topic:followTopic);
 const q=v.toLowerCase();
 const asksCare=/what|how|should|recommend|suggest|avoid|do now|help|cold|ice|compress|move|rest|care|treat|advice|не істе|болмай|можно|делать|нельзя/.test(q);
 if(critical(v)){bubble('ai','You may have described an urgent concern. If you are in immediate danger, have chest pain, difficulty breathing, or risk of harming yourself, contact local emergency or crisis services now. This demo cannot assess urgency.');}
 else if(guide.urgent){bubble('ai',guide.guidance+'\n\nPlease arrange professional assessment; a demo booking is not medical care.');}
 else if(guide.recognized && asksCare){bubble('ai',guide.guidance+'\n\nRelevant sources are linked in your report. These are general educational steps, not a personal treatment plan.');}
 else if(guide.recognized){bubble('ai',guide.guidance+'\n\nYou can ask follow-up questions or select Analyse consultation to refresh your report.');}
 else{bubble('ai',guide.guidance+'\n\nI saved your question for a clinician. You can keep adding details or refresh your report.');}
 if(state.report)makeReport(false);
 bubble('ai','You can keep asking questions or add new symptoms. I will update the report; this is not a diagnosis.');
 updateProgress();persist();
}
function extractFlags(context,answers){
 const n=context.toLowerCase(), s=(answers.flags||'').toLowerCase(), sev=(answers.severity||'').toLowerCase();const noFlags=/^(none|none of these|none reported|no|i am safe|not applicable)$/.test(s.trim());
 return {'numbness':(!noFlags&&s.includes('numb'))||/\bnumb(ness)?\b|loss of sensation/.test(n),
 'cannot move':(!noFlags&&sev.includes('difficulty moving'))||/can(?:not|'t) move|unable to move/.test(n),
 'severe pain':(!noFlags&&sev.includes('severe'))||/severe pain|unbearable pain/.test(n),
 'changed shape':(!noFlags&&s.includes('shape'))||/deform|changed shape|looks crooked/.test(n),
 'blue or pale':(!noFlags&&s.includes('color'))||/turned blue|turned pale|blue fingers/.test(n),
 'open wound':(!noFlags&&s.includes('wound'))||/open wound|deep cut/.test(n),
 'fever':/\b(?:have|with|high) fever\b/.test(n)&&!/no fever/.test(n)};
}
function updateProgress(){$('step').textContent='STEP '+Math.min(3,Math.max(1,Math.ceil(state.stage*3/(activeQuestions().length+1))))+' OF 3';$('progressFill').style.width=(10+Math.min(90,state.stage*19))+'%';$('summaryBits').textContent=(state.answers.concern?'Concern: '+state.answers.concern+'\n':'')+(state.answers.onset?'Onset: '+state.answers.onset+'\n':'')+(state.answers.symptoms?'Details: '+state.answers.symptoms+'\n':'')+(state.answers.flags?'Reported warning signs: '+state.answers.flags:'')||'Your consultation summary will appear here as you chat.'}
function makeReport(scroll=true){if(!state.answers.concern){bubble('ai','Please describe your concern first.');return}const a=state.answers;const all=[a.concern,a.symptoms,a.flags,...(state.followups||[])].join(' ');const guide=assess(all,extractFlags(all,a),state.topic);const emergency=guide.emergency||critical(a.flags)||critical(a.concern)||critical(a.symptoms)||state.followups.some(critical);const warning=emergency||guide.urgent;const hand=guide.topic==='hand';state.report={guide,emergency,warning,hand,answers:{...a},followups:[...(state.followups||[])],created:new Date().toISOString()};persist();renderReport();renderDoctors();$('reportSection').classList.remove('hidden');$('handover').disabled=!$('consent').checked;if(scroll)$('reportSection').scrollIntoView({behavior:'smooth',block:'start'});}
function card(title,body,warning=false){const d=document.createElement('article');d.className='reportCard'+(warning?' warning':'');const h=document.createElement('h3');h.textContent=title;d.append(h);const p=document.createElement('p');p.textContent=body;d.append(p);return d}
function renderReport(){const r=state.report;if(!r)return;const area=$('report');area.replaceChildren();area.append(card('01 · Patient-reported information',`Concern: ${r.answers.concern}\nOnset: ${r.answers.onset||'Not reported'}\nReported symptoms/details: ${r.answers.symptoms||'Not reported'}\nOther reported signs: ${r.answers.flags||'Not reported'}\nAdditional questions and symptoms: ${(r.followups||[]).join(' | ')||'None'}`));area.append(card('02 · Preliminary information & uncertainty',r.guide.recognized?'Your report matches the limited offline '+r.guide.topic+' information topic. This is educational information, not a diagnosis or personalized treatment plan.':'This concern is outside the prototype’s reviewed topics. No condition-specific conclusion can be made.'));area.append(card('03 · General guidance',r.emergency?'Potential emergency warning sign reported. Contact local emergency services now. Do not wait for an online appointment.':r.guide.guidance,r.warning));area.append(card('04 · Warning signs & next step',r.emergency?'Emergency warning sign reported: immediate local emergency assistance is appropriate.':r.warning?'A warning sign was reported. Seek prompt in-person professional assessment. A demonstration booking is not a substitute.':'No listed warning signs were selected, but this does not exclude a serious condition. Seek professional advice if symptoms persist, worsen or concern you.',r.warning));area.append(card('05 · Suggested specialty',(r.hand||r.guide.topic==='leg')?'Orthopedics or primary care may be relevant for a limb concern. This is not a clinical referral.':r.guide.topic==='mental'?'A primary care clinician or licensed mental health professional may be relevant. The demo directory does not contain a real mental health provider.':'General practice can help discuss next steps. This is not a clinical referral.'));const refs=document.createElement('article');refs.className='reportCard';refs.innerHTML='<h3>06 · Medical references</h3><p>External sources require an internet connection. Links are for further reading; no live database retrieval occurs.</p>';const ul=document.createElement('ul');const sources=[...r.guide.sources,['MedlinePlus — Health Topics','https://medlineplus.gov/healthtopics.html'],['PubMed — Biomedical literature search','https://pubmed.ncbi.nlm.nih.gov/']];sources.forEach(([label,url])=>{const li=document.createElement('li'),link=document.createElement('a');link.textContent=label;link.href=url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);ul.append(li)});refs.append(ul);area.append(refs);$('matchReason').textContent=(r.hand||r.guide.topic==='leg')?'Suggested demo directory category: Orthopedics or general practice, based on a reported limb concern.':r.guide.topic==='mental'?'A mental health professional or general practitioner may be relevant; no mental health specialist is available in this fictional directory.':'Suggested demo directory category: General practice. Not a clinical referral.';}
function renderDoctors(){const root=$('doctors');root.replaceChildren();const order=state.report?.hand||['leg','back'].includes(state.report?.guide.topic)?[doctors[1],doctors[0],doctors[2]]:doctors;order.forEach(d=>{const el=document.createElement('article');el.className='doctor';el.innerHTML=`<div class="docTop"><div class="avatar">${d.initials}</div><div><h3>${esc(d.name)}</h3><small>${esc(d.role)}</small></div></div><div class="meta">◈ ${esc(d.format)}<br>◎ ${esc(d.languages)}<br>▦ Fictional demonstration schedule</div>`;const b=document.createElement('button');b.className='btn';b.textContent='View demo availability ↗';b.onclick=()=>openBooking(d);el.append(b);root.append(el)})}
function openBooking(d){selectedDoctor=d;selectedTime=null;selectedDate=null;const p=$('bookingPanel');p.classList.remove('hidden');p.replaceChildren();const h=document.createElement('h3');h.textContent='Reserve a fictional consultation with '+d.name;p.append(h);const info=document.createElement('p');info.textContent='Demonstration only. No real clinician, appointment, payment or video call.';p.append(info);const dates=document.createElement('div');dates.className='dateSlots';for(let i=1;i<=4;i++){const date=new Date();date.setDate(date.getDate()+i);const label=date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});const b=document.createElement('button');b.className='slot';b.textContent=label;b.onclick=()=>{selectedDate=label;dates.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');updateBookingButton()};dates.append(b)}p.append(dates);const times=document.createElement('div');times.className='dateSlots';d.slots.forEach(t=>{const b=document.createElement('button');b.className='slot';b.textContent=t;b.onclick=()=>{selectedTime=t;times.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');updateBookingButton()};times.append(b)});p.append(times);const book=document.createElement('button');book.id='confirmBooking';book.className='btn';book.textContent='Confirm fictional appointment';book.disabled=true;book.onclick=()=>{state.booking={doctor:d.name,date:selectedDate,time:selectedTime,reference:'DEMO-'+Date.now().toString().slice(-6)};persist();const notice=document.createElement('p');notice.style.color='#158261';notice.textContent=`✓ Fictional reservation confirmed: ${d.name} · ${selectedDate} at ${selectedTime}. Reference ${state.booking.reference}. Saved only in this browser.`;p.append(notice);book.disabled=true};p.append(book);p.scrollIntoView({behavior:'smooth',block:'center'})}
function updateBookingButton(){const b=$('confirmBooking');if(b)b.disabled=!selectedDate||!selectedTime}
function summaryText(){const r=state.report;if(!r)return 'No report';return `AI CLINIC · FICTIONAL DEMONSTRATION\nNot a medical diagnosis or clinical record\n\nFictional patient: ${$('alias').value||'Demo patient'}\nConcern: ${r.answers.concern}\nOnset: ${r.answers.onset||'Not reported'}\nReported symptoms/details: ${r.answers.symptoms||'Not reported'}\nWarning signs: ${r.answers.flags||'Not reported'}\nAdditional questions and symptoms: ${(r.followups||[]).join(' | ')||'None'}\n\nGeneral guidance: ${r.emergency?'Seek immediate local emergency assistance.':r.guide.guidance}\nSuggested directory category: ${(r.hand||r.guide.topic==='leg')?'Orthopedics or general practice':'General practice'}\n\nReferences:\n${r.guide.sources.map(s=>s.join(' — ')).join('\n')}\n\n${state.booking?`FICTIONAL booking: ${state.booking.doctor}, ${state.booking.date}, ${state.booking.time}`:''}\nNo clinical validation or real clinician connection.`}
$('chatForm').onsubmit=e=>{e.preventDefault();receive($('messageInput').value)};$('analyse').onclick=makeReport;$('consent').onchange=()=>{$('handover').disabled=!$('consent').checked||!state.report};$('handover').onclick=()=>{if(!$('consent').checked||!state.report)return;state.handed=true;persist();$('handoverStatus').textContent=navigator.onLine?'Simulated handover completed in this browser. No server transmission.':'Offline: simulated handover queued locally; no server transmission.';$('inboxText').textContent='Fictional consultation received: '+($('alias').value||'Demo patient')+' — '+state.answers.concern+'. Human review required.'};$('download').onclick=()=>{const blob=new Blob([summaryText()],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='AI-Clinic-Demo-Summary.txt';a.click();URL.revokeObjectURL(url)};$('reset').onclick=()=>{if(!confirm('Delete this browser’s fictional demonstration data?'))return;localStorage.removeItem(KEY);location.reload()};$('photo').onchange=e=>{const f=e.target.files?.[0],area=$('preview');area.replaceChildren();if(!f)return;if(!f.type.startsWith('image/')||f.size>5e6){area.textContent='Choose an image smaller than 5 MB.';return}const url=URL.createObjectURL(f),img=document.createElement('img');img.alt='Local preview only; not analyzed';img.src=url;img.onload=()=>URL.revokeObjectURL(url);area.append(img);const note=document.createElement('p');note.textContent='Preview only. No AI image assessment, storage or upload.';area.append(note)};function network(){$('net').textContent=navigator.onLine?'● Online':'○ Offline';$('net').style.color=navigator.onLine?'#168265':'#a86b20'}window.addEventListener('online',network);window.addEventListener('offline',network);$('language').onchange=e=>{if(e.target.value==='kk')bubble('ai','Қазақша нұсқасы: өз шағымыңызды жазыңыз. Бұл медициналық диагноз емес. Толық клиникалық нұсқаулық әзірге ағылшын тілінде берілген.');else bubble('ai','English selected. Continue your consultation below.')};try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.messages&&Array.isArray(s.messages)){state=s;state.followups=state.followups||[];state.topic=state.topic||topicFor(state.answers?.concern)}}catch{}if(!state.messages.length)bubble('ai','Hello. I’m your AI Clinic consultation assistant. I can help organize your concern and show general reference-based information. I cannot diagnose conditions or interpret photographs.\n\nTo begin, what is troubling you today?');else renderMessages();updateProgress();renderDoctors();if(state.report){renderReport();$('reportSection').classList.remove('hidden')}if(state.handed)$('inboxText').textContent='A fictional consultation was shared in this browser. Human review required.';network();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

// Progressive enhancement: fictional local profile, recording, accessibility and booking shortcut.
const accountDialog=$('accountDialog'),accessDialog=$('accessDialog');
$('accountOpen').onclick=()=>accountDialog.showModal();$('closeAccount').onclick=()=>accountDialog.close();
$('accountForm').onsubmit=e=>{e.preventDefault();const name=$('demoAlias').value.trim();if(!name)return;localStorage.setItem('ai_clinic_demo_profile',JSON.stringify({name}));$('alias').value=name;$('accountOpen').textContent='Demo: '+name;$('accountStatus').textContent='Fictional local profile saved. No account was created on a server.';accountDialog.close();};
try{const profile=JSON.parse(localStorage.getItem('ai_clinic_demo_profile'));if(profile?.name){$('alias').value=profile.name;$('demoAlias').value=profile.name;$('accountOpen').textContent='Demo: '+profile.name;}}catch{}
$('accessOpen').onclick=()=>accessDialog.showModal();$('closeAccess').onclick=()=>accessDialog.close();
const prefs=['largeText','highContrast','reducedMotion','visualMode'];const classes=['a11y-large','a11y-contrast','a11y-reduced','a11y-text'];
let storedPrefs={};try{storedPrefs=JSON.parse(localStorage.getItem('ai_clinic_a11y')||'{}')}catch{}
prefs.forEach((id,i)=>{const input=$(id);input.checked=!!storedPrefs[id];document.body.classList.toggle(classes[i],input.checked);input.onchange=()=>{document.body.classList.toggle(classes[i],input.checked);storedPrefs[id]=input.checked;localStorage.setItem('ai_clinic_a11y',JSON.stringify(storedPrefs));};});
$('readPage').onclick=()=>{if(!('speechSynthesis' in window)){$('readPage').textContent='Speech playback unavailable in this browser';return;}speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance((state.messages||[]).slice(-5).map(m=>m.role+': '+m.message).join('. '));utterance.rate=.85;speechSynthesis.speak(utterance);};$('stopReading').onclick=()=>{if('speechSynthesis'in window)speechSynthesis.cancel()};
$('scheduleNow').onclick=()=>{$('specialists').scrollIntoView({behavior:'smooth'});const first=$('doctors').querySelector('button');if(first)first.focus({preventScroll:true});};
// Voice input: browser speech recognition converts speech to editable text.
// MediaRecorder keeps a local audio copy. Neither recording nor transcript is uploaded.
let recorder=null,recordedChunks=[],activeStream=null,recognition=null,recognizedText='',audioUrl=null;
const mic=$('recordAudio'),recordStatus=$('recordingStatus');
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
const voicePanel=document.createElement('div');voicePanel.className='voicePanel';voicePanel.hidden=true;
voicePanel.innerHTML='<label for="voiceTranscript">Recognized speech (review and edit before sending)</label><textarea id="voiceTranscript" rows="3" placeholder="Your recognized words will appear here. You can correct them before sending."></textarea><div class="voiceActions"><button type="button" id="voiceSend" class="btn sm">Send transcript to consultation ↑</button><button type="button" id="voiceDiscard" class="btn ghost sm">Discard</button></div><p id="voiceNote" role="status"></p>';
recordStatus.after(voicePanel);
const transcript=()=>document.getElementById('voiceTranscript');
document.getElementById('voiceSend').onclick=()=>{const value=transcript().value.trim();if(!value){document.getElementById('voiceNote').textContent='No text to send. Type or dictate your message first.';return;}receive(value);voicePanel.hidden=true;transcript().value='';document.getElementById('voiceNote').textContent='Transcript sent to the consultation. Audio remains local and is not sent.';};
document.getElementById('voiceDiscard').onclick=()=>{voicePanel.hidden=true;transcript().value='';recognizedText='';if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=null;}recordStatus.textContent='Voice input discarded.';};
mic.onclick=async()=>{
 if(recorder?.state==='recording'){
   if(recognition){try{recognition.stop()}catch{}}
   recorder.stop();return;
 }
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){recordStatus.textContent='Microphone recording unavailable. Type your message instead.';return;}
 try{
  activeStream=await navigator.mediaDevices.getUserMedia({audio:true});recordedChunks=[];recognizedText='';voicePanel.hidden=false;transcript().value='';
  recorder=new MediaRecorder(activeStream);
  recorder.ondataavailable=e=>{if(e.data.size)recordedChunks.push(e.data)};
  recorder.onstop=()=>{
   mic.setAttribute('aria-pressed','false');mic.textContent='🎙';activeStream?.getTracks().forEach(t=>t.stop());
   const blob=new Blob(recordedChunks,{type:recorder.mimeType||'audio/webm'});
   if(!blob.size)return;
   if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);
   const wrap=document.createElement('div'),audio=document.createElement('audio'),download=document.createElement('a');
   audio.controls=true;audio.src=audioUrl;download.href=audioUrl;download.download='AIClinic-demo-recording.'+(blob.type.includes('mp4')?'mp4':'webm');download.textContent='Download local recording';
   wrap.append(audio,download);recordStatus.replaceChildren(wrap);
   if(!transcript().value.trim())document.getElementById('voiceNote').textContent='No speech recognized. You can type your words in the transcript box and send them. The audio cannot be sent to a real clinic in this demo.';
  };
  if(SpeechRecognition){
   recognition=new SpeechRecognition();recognition.lang=$('language').value==='kk'?'kk-KZ':'en-US';recognition.continuous=true;recognition.interimResults=true;
   recognition.onresult=e=>{let interim='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)recognizedText+=t+' ';else interim+=t;}transcript().value=(recognizedText+interim).trim();};
   recognition.onerror=e=>{document.getElementById('voiceNote').textContent='Speech recognition unavailable ('+e.error+'). Recording still works. Type your message or use a supported browser online.';};
   try{recognition.start();document.getElementById('voiceNote').textContent='Listening and transcribing. Review your text, stop recording, then select Send transcript.';}catch{document.getElementById('voiceNote').textContent='Speech recognition could not start. Record and type your message instead.';}
  }else{document.getElementById('voiceNote').textContent='This browser cannot transcribe speech. You can record and replay audio, or type a transcript below.';}
  recorder.start();mic.textContent='■ Stop';mic.setAttribute('aria-pressed','true');recordStatus.textContent='Recording locally… Stop when finished.';
 }catch{recordStatus.textContent='Microphone access denied or unavailable. Type your message instead.';voicePanel.hidden=true;}
};
