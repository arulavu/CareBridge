// Small, curated, educational offline guidance. Not clinical decision support.
export const SOURCES={
 pain:[['MedlinePlus — Pain','https://medlineplus.gov/pain.html']],
 leg:[['NHS — Leg pain','https://www.nhs.uk/symptoms/leg-pain/'],['MedlinePlus — Leg injuries and disorders','https://medlineplus.gov/leginjuriesanddisorders.html']],
 back:[['NHS — Back pain','https://www.nhs.uk/conditions/back-pain/']],
 headache:[['NHS — Headaches','https://www.nhs.uk/symptoms/headaches/']],
 digestive:[['MedlinePlus — Digestive Diseases','https://medlineplus.gov/digestivediseases.html']],
 skin:[['MedlinePlus — Skin Conditions','https://medlineplus.gov/skinconditions.html']],
 hand:[['NHS — Hand pain','https://www.nhs.uk/symptoms/hand-pain/'],['MedlinePlus — Injuries','https://medlineplus.gov/woundsandinjuries.html']],
 respiratory:[['NHS — Common cold','https://www.nhs.uk/conditions/common-cold/'],['MedlinePlus — Common cold','https://medlineplus.gov/commoncold.html']],
 mental:[['WHO — Mental health','https://www.who.int/health-topics/mental-health'],['MedlinePlus — Mental health','https://medlineplus.gov/mentalhealth.html']],
 checkup:[['MedlinePlus — Health screenings','https://medlineplus.gov/healthscreening.html'],['MedlinePlus — Health checkup','https://medlineplus.gov/ency/article/002125.htm']],
 general:[['MedlinePlus — Health topics','https://medlineplus.gov/healthtopics.html']]
};
const guides={
 leg:'You mentioned leg pain. Avoid activities that clearly worsen it; rest from strenuous exercise while you arrange assessment. If this followed a minor strain and there are no warning signs, a cold pack wrapped in cloth for up to 20 minutes may help discomfort. Do not massage a swollen, hot or red calf. New one-sided swelling, redness or warmth needs urgent medical assessment; chest pain or breathlessness needs emergency help. An injury, clot or other cause cannot be ruled out here.',
 back:'For back pain without warning signs, avoid heavy lifting and prolonged bed rest; gentle movement as tolerated may help. Arrange professional assessment if it persists or worsens. New bladder or bowel control problems, numbness around the groin or progressive leg weakness require emergency assessment.',
 headache:'For a mild familiar headache, consider hydration, rest and limiting activities that worsen symptoms. Seek urgent assessment for a new or worsening headache. A sudden extremely severe headache, weakness, confusion, fever with stiff neck or new vision loss needs emergency help.',
 pain:'For unexplained pain, avoid activities that clearly worsen it and document its location, duration and severity. Because causes vary, arrange professional assessment for persistent, severe or worsening pain. Seek urgent help for severe or rapidly worsening symptoms.',
 digestive:'For mild digestive discomfort, consider adequate fluids and note food, medicines and timing. Do not assume the cause. Seek professional assessment for persistent or worsening symptoms; severe abdominal pain, bloody vomit or black stools need urgent assessment.',
 skin:'For an unfamiliar skin concern, avoid irritating products and note any new medications or exposures. Seek assessment if it spreads, becomes painful, develops fever or persists. Rapid swelling of lips or tongue or breathing trouble requires emergency help.',
 hand:'For a recent minor hand injury, general first aid may include resting the hand, avoiding lifting or forceful gripping, and using a cold pack wrapped in a towel for up to 20 minutes at a time. Do not place ice directly on skin. Remove rings if swelling develops. Do not force movement. A clinician should assess significant pain, swelling or limited movement; online information cannot rule out a fracture.',
 respiratory:'For mild cold-like symptoms, general self-care may include rest, drinking enough fluids, and discussing suitable over-the-counter symptom relief with a pharmacist if needed. Avoid smoking and consider reducing close contact with others while unwell. A clinician can advise if symptoms worsen, persist or you have a condition that increases risk. Difficulty breathing or chest pain requires urgent assessment.',
 mental:'For stress or emotional distress, consider a calm environment, regular meals and sleep, gentle activity if comfortable, and reaching out to someone you trust. A brief grounding exercise may help some people: notice five things you can see, four you can feel, three you can hear, two you can smell and one you can taste. If distress persists or interferes with daily life, consider a qualified mental health professional. If you may harm yourself or someone else, seek immediate local crisis or emergency help.',
 checkup:'For a routine check-up, prepare a list of medications, allergies, family history, prior results, questions and any new symptoms. Ask a licensed clinician which screenings or vaccinations are appropriate for your age, history and local guidance. This prototype does not determine individual screening eligibility or recommend specific tests.',
 general:'I can help organize your questions for a clinician. Record when symptoms began, what makes them better or worse, relevant medicines and any new or worsening changes. For an unfamiliar concern, I cannot safely give condition-specific treatment advice. If symptoms are severe or rapidly worsening, seek prompt professional assessment.'
};
// Narrow educational matcher. Positive red flags take precedence; never infer a benign diagnosis.
export function assess(notes,answers={},selectedTopic){
 const n=String(notes||'').toLowerCase();
 const has=(r)=>r.test(n);
 const limb=has(/\b(hand|finger|wrist|leg|calf|knee|ankle|foot|feet|arm|elbow|shoulder)\b|қол|аяқ|кисть|нога/);
 const fracture=has(/\b(broken|broke|fractur(?:e|ed)|might be broken|could be broken)\b/)&&limb;
 const hand=has(/\b(hand|finger|wrist)\b|қол|саусақ|кисть|палец|запясть/)&&has(/hurt|pain|ache|injur|hit|fell|fall|swoll|broken|broke|fractur|удар|болит|травм|ауыр|соқ/);
 const leg=has(/\b(leg|calf|knee|ankle|foot|feet|thigh|shin)\b|аяқ|нога/)&&has(/hurt|pain|ache|injur|hit|fell|fall|swoll|broken|broke|fractur|болит|ауыр/);
 const back=has(/\b(back|spine|lower back)\b/)&&has(/hurt|pain|ache|sore|болит/);
 const headache=has(/headache|migraine|head hurts|head pain/);
 const topic=hand?'hand':leg?'leg':back?'back':headache?'headache':selectedTopic==='injury'?'pain':selectedTopic&&SOURCES[selectedTopic]?selectedTopic:'general';
 const denied=(term)=>new RegExp('\\b(?:no|not|without|deny|denies)\\s+(?:\\w+\\s+){0,2}'+term+'\\b').test(n);
 const emergency=(has(/\b(chest pain|trouble breathing|difficulty breathing|cannot breathe|can't breathe|severe bleeding|unconscious|want to die|hurt myself|suicidal)\b/)&&!denied('chest pain|trouble breathing|difficulty breathing|severe bleeding')) || has(/sudden worst headache|sudden extremely severe headache|new loss of bladder control|new loss of bowel control/);
 const clotConcern=topic==='leg'&&has(/\b(swollen|swelling|red|warm|hot)\b/)&&has(/\b(one leg|one-sided|calf|leg)\b/)&&!has(/no swelling|not swollen/);
 const flagWords=Object.entries(answers).filter(([k,v])=>v===true).map(([k])=>k);
 const concerning=flagWords.length>0||has(/\b(numbness|can't walk|cannot walk|unable to bear weight|deformity|severe pain|rapidly worsening)\b/);
 const urgent=emergency||fracture||clotConcern||concerning;
 let guidance=guides[topic];
 if(fracture){guidance='You reported a POSSIBLE FRACTURE. This cannot be ruled out in an online chat. Arrange prompt in-person assessment today; an examination and possibly an X-ray may be needed. Until assessed, avoid weight-bearing or forceful use of the injured limb, support it in a comfortable position, and use a cold pack wrapped in cloth for up to 20 minutes at a time. Do not try to straighten a deformed limb. Severe pain, loss of sensation, a cold or blue limb or an open injury warrants emergency care.';}
 else if(clotConcern){guidance='You described leg symptoms that can sometimes signal a serious problem. Seek urgent in-person medical assessment today. Do not massage the affected leg. If chest pain, fainting or difficulty breathing develops, contact emergency services immediately. This app cannot determine the cause.';}
 else if(concerning){guidance='Your description includes a concerning symptom. Arrange prompt in-person medical assessment; if you cannot bear weight, have a deformed limb or rapidly worsening severe symptoms, seek urgent care. '+guides[topic];}
 if(emergency)guidance='Your description may include an emergency warning sign. Contact local emergency or crisis services now. Do not wait for an online appointment or rely on this prototype.';
 return {topic,urgent,emergency,flags:flagWords,recognized:topic!=='general',guidance,sources:SOURCES[topic]};
}
