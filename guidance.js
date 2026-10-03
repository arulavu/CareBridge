// Curated offline reference cards. NOT a live medical database or clinical decision support.
export const SOURCES={hand:[['NHS — Hand pain','https://www.nhs.uk/symptoms/hand-pain/pain-in-the-back-of-the-hand/'],['MedlinePlus — Wounds and injuries','https://medlineplus.gov/woundsandinjuries.html']],general:[['MedlinePlus — First aid','https://medlineplus.gov/firstaid.html']]};
export function assess(notes,answers={}){
 const n=notes.toLowerCase(); const hand=/hand|finger|wrist|қол|саусақ|кисть|палец|запясть/.test(n);
 const injury=/hit|hurt|injur|fell|fall|pain|swoll|удар|болит|травм|ауыр|соқ/.test(n);
 const urgent=/chest pain|can't breathe|cannot breathe|unconscious|severe bleeding|stroke|кеуде ауыру|тыныс ала алмай|сильное кровотечени/.test(n);
 const flags=['numbness','cannot move','severe pain','changed shape','blue or pale','open wound','fever'].filter(k=>answers[k]);
 const handInfo=hand&&injury;
 return {topic:handInfo?'hand':'general',urgent:urgent||flags.length>0,flags,recognized:handInfo,
 questions:handInfo?['When did the injury happen?','Can you move your hand and fingers normally?','Is there swelling, an open wound, numbness or a change in shape or colour?']:['When did this concern start?','What information would you like a clinician to know?'],
 guidance:urgent||flags.length?'Your answers include warning signs. Seek prompt in-person medical assessment; for severe symptoms contact local emergency services. Do not wait for an online appointment.':handInfo?'General information only: avoid activities that worsen pain. A cold pack wrapped in a towel may help discomfort. If pain is severe, movement or sensation is affected, the hand changes shape or colour, or you are concerned about a fracture, seek urgent in-person assessment. An online assistant cannot exclude a fracture.':'This concern is outside the prototype’s reviewed guidance topics. It will prepare your description for a human clinician rather than provide condition-specific recommendations.',
 sources:handInfo?SOURCES.hand:SOURCES.general};
}
