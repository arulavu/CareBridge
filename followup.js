// Transparent, constrained educational follow-up responses. Not an LLM or clinical triage device.
const lower=s=>String(s||'').toLowerCase();
export function followupAnswer(question,{topic='general',context='',flags='',guide={},safety={}}={}){
 const q=lower(question),c=lower(context),f=lower(flags);
 const danger=safety.level==='emergency';
 const prompt=safety.level==='prompt'||guide.urgent||/(possible fracture|deformity|severe pain|numbness|blue|cold limb|open wound)/.test(f);
 const fracture=/(finger|hand|wrist)/.test(c)&&/(broken|broke|fractur|crush|car door|deformity)/.test(c+' '+f);
 const safetyText=danger?'Your answers may indicate an emergency. Contact local emergency services now; do not wait for an online response.':fracture?'A possible crushed or broken finger needs prompt in-person assessment today, usually urgent care or an emergency department where an X-ray may be available. Blue/cold/numb fingers, an open injury or severe deformity warrant emergency care.':prompt?'Your reported warning signs mean home care alone may be unsafe. Seek prompt in-person medical assessment.':null;
 if(/^(hi|hello|hey|thanks|thank you|ok|okay)$/i.test(question.trim()))return 'Hello! You can ask another question, describe a new symptom, or type “new topic” to start another concern.';
 if(/(?:which|what kind of|find|see).{0,30}(?:doctor|specialist)|(?:doctor|specialist).{0,30}(?:should|which|see)/.test(q)){
  const specialties={hand:'urgent care or an emergency department for suspected fractures; a hand specialist or orthopedist may be involved after examination',limb:'primary care or urgent care; orthopedics may be appropriate after assessment',mental:'a primary care clinician or qualified mental-health professional',checkup:'a primary care clinician',allergy:'primary care or an allergist after assessment',abdominal:'primary care or urgent care depending on severity',poisoning:'a local poison-control service or emergency department',chest:'urgent/emergency medical assessment for new or unexplained chest symptoms',general:'a primary care clinician who can direct further assessment'};
  return (safetyText?safetyText+'\n\n':'')+'A starting point is '+(specialties[topic]||'a primary care clinician, with urgent care for severe or worsening symptoms')+'. This is educational navigation, not a clinical referral.';
 }
 if(/(?:can i wait|wait until|tomorrow|urgent|emergency|when.*doctor|need.*doctor|should.*doctor|go.*hospital|self.care|home care|stay home|is it serious)/.test(q)){
  if(safetyText)return safetyText+' I cannot safely recommend waiting or self-care alone.';
  return 'I cannot confirm from this chat that home care or waiting is safe. Is the symptom new or worsening, how severe is it, and are there any additional symptoms? If it is severe, rapidly worsening or concerning, seek medical assessment rather than waiting.';
 }
 if(/(?:what.*do|how.*help|ice|cold pack|rest|medicine|painkill|treatment|recommend|self.care|care at home)/.test(q)){
  if(safetyText)return safetyText+'\n\nWhile arranging assessment, avoid activities that worsen the injury or symptoms. Do not rely on online first aid as a substitute for examination.';
  if(topic==='hand')return 'For a minor hand injury, rest and avoid forceful movement. A cold pack wrapped in cloth for up to 20 minutes may help. New swelling, severe pain or reduced movement should be assessed; I cannot rule out a fracture.';
  return (guide.guidance||'Please describe your concern, when it started, severity and other symptoms.')+'\n\nThis is general information; I cannot recommend individual medicines or confirm self-care is safe.';
 }
 if(safetyText)return safetyText+'\n\nWhat else would you like to know? You can add another symptom, ask about the next step, or type “new topic”.';
 return 'I can continue discussing this concern. To answer more usefully, could you specify what you want to know—for example, whether to seek care, which clinician to contact, or what information to prepare? You can also describe another symptom or type “new topic”.';
}
