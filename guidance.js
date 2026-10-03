// Small, curated, educational offline guidance. Not clinical decision support.
export const SOURCES={
 hand:[['NHS — Hand pain','https://www.nhs.uk/symptoms/hand-pain/'],['MedlinePlus — Injuries','https://medlineplus.gov/woundsandinjuries.html']],
 respiratory:[['NHS — Common cold','https://www.nhs.uk/conditions/common-cold/'],['MedlinePlus — Common cold','https://medlineplus.gov/commoncold.html']],
 mental:[['WHO — Mental health','https://www.who.int/health-topics/mental-health'],['MedlinePlus — Mental health','https://medlineplus.gov/mentalhealth.html']],
 checkup:[['MedlinePlus — Health screenings','https://medlineplus.gov/healthscreening.html'],['MedlinePlus — Health checkup','https://medlineplus.gov/ency/article/002125.htm']],
 general:[['MedlinePlus — Health topics','https://medlineplus.gov/healthtopics.html']]
};
const guides={
 hand:'For a recent minor hand injury, general first aid may include resting the hand, avoiding lifting or forceful gripping, and using a cold pack wrapped in a towel for up to 20 minutes at a time. Do not place ice directly on skin. Remove rings if swelling develops. Do not force movement. A clinician should assess significant pain, swelling or limited movement; online information cannot rule out a fracture.',
 respiratory:'For mild cold-like symptoms, general self-care may include rest, drinking enough fluids, and discussing suitable over-the-counter symptom relief with a pharmacist if needed. Avoid smoking and consider reducing close contact with others while unwell. A clinician can advise if symptoms worsen, persist or you have a condition that increases risk. Difficulty breathing or chest pain requires urgent assessment.',
 mental:'For stress or emotional distress, consider a calm environment, regular meals and sleep, gentle activity if comfortable, and reaching out to someone you trust. A brief grounding exercise may help some people: notice five things you can see, four you can feel, three you can hear, two you can smell and one you can taste. If distress persists or interferes with daily life, consider a qualified mental health professional. If you may harm yourself or someone else, seek immediate local crisis or emergency help.',
 checkup:'For a routine check-up, prepare a list of medications, allergies, family history, prior results, questions and any new symptoms. Ask a licensed clinician which screenings or vaccinations are appropriate for your age, history and local guidance. This prototype does not determine individual screening eligibility or recommend specific tests.',
 general:'I can help organize your questions for a clinician. Record when symptoms began, what makes them better or worse, relevant medicines and any new or worsening changes. For an unfamiliar concern, I cannot safely give condition-specific treatment advice. If symptoms are severe or rapidly worsening, seek prompt professional assessment.'
};
export function assess(notes,answers={},selectedTopic){
 const n=String(notes||'').toLowerCase();
 const hand=/hand|finger|wrist|қол|саусақ|кисть|палец|запясть/.test(n)&&/hit|hurt|injur|fell|fall|pain|swoll|удар|болит|травм|ауыр|соқ/.test(n);
 const topic=selectedTopic==='injury'?(hand?'hand':'general'):(selectedTopic&&SOURCES[selectedTopic]?selectedTopic:(hand?'hand':'general'));
 const urgent=/(?:^|[.!?;]\s*)(?:i have |i am experiencing )?(?:chest pain|difficulty breathing|trouble breathing|severe bleeding)|can't breathe|cannot breathe|unconscious|suicid|self.harm|want to die|hurt myself|i need urgent help/i.test(n)&&!/^(?:no|not|without) (?:chest pain|difficulty breathing|trouble breathing)/.test(n.trim());
 const flags=topic==='hand'?['numbness','cannot move','severe pain','changed shape','blue or pale','open wound'].filter(k=>answers[k]):[];
 return {topic,urgent:urgent||flags.length>0,flags,recognized:topic!=='general',guidance:urgent?'Potentially serious warning signs were reported. Seek immediate local emergency or crisis assistance if you are in danger or experiencing severe symptoms. Do not wait for this demo.':flags.length?'Your answers include concerning signs. Arrange prompt in-person medical assessment; for severe symptoms contact local emergency services. General self-care is not a substitute for assessment.':guides[topic],sources:SOURCES[topic]};
}
