// Conservative educational safety gate; NOT a validated medical triage device.
const exposure=/\b(?:took|taken|drank|swallowed|started|after|used|injected|dose|tablet|pill|medicine|medication|painkiller|antibiotic|drug)\b/i;
const allergy=/\b(?:allerg(?:y|ic)|hives|itch(?:y|ing)?|rash|swelling|reaction)\b/i;
const throat=/\b(?:throat|tongue|lip|mouth|voice|swallow)\b/i;
const airway=/\b(?:difficulty|trouble|hard|can't|cannot|unable|wheez|tight|closing|swollen|swelling|hoarse|faint|dizzy|collapse)\b/i;
export function medicationReaction(message,history=[]){
 const s=String(message||'');const previous=history.join(' ');
 const hasExposure=exposure.test(s)||exposure.test(previous);
 const hasAllergy=allergy.test(s)||allergy.test(previous);
 const hasThroat=throat.test(s);
 if(hasExposure&&hasThroat&&(hasAllergy||airway.test(s))){
  const severe=airway.test(s)&&/\b(?:trouble|difficulty|hard|can't|cannot|unable|tight|closing|swollen|swelling|hoarse|faint|collapse|wheez)\b/i.test(s);
  return {level:severe?'emergency':'urgent',topic:'allergy',message:severe?
   'Possible serious medication reaction: throat or breathing symptoms after medication can be an emergency. Call local emergency services now. If you have a prescribed epinephrine auto-injector for anaphylaxis, follow its instructions. Do not wait for this chat.':
   'An itchy throat after taking medication could signal an allergic reaction, which can worsen quickly. Seek urgent medical advice now rather than relying on this chat. If you develop throat or tongue swelling, difficulty breathing or swallowing, hoarseness, dizziness or faintness, call emergency services immediately. Do not take another dose of the suspected medication until a clinician or pharmacist advises you. What medication did you take, when, and do you have ANY breathing or swallowing difficulty or swelling right now?'};
 }
 return null;
}
