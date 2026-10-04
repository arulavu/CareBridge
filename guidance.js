// Small, curated, educational offline guidance. Not clinical decision support.
export const SOURCES={
 limb:[['NHS — Leg pain','https://www.nhs.uk/symptoms/leg-pain/'],['MedlinePlus — Injuries','https://medlineplus.gov/woundsandinjuries.html']],
 abdominal:[['MedlinePlus — Abdominal Pain','https://medlineplus.gov/abdominalpain.html']],
 allergy:[['MedlinePlus — Allergy','https://medlineplus.gov/allergy.html']],
 poisoning:[['MedlinePlus — Poisoning','https://medlineplus.gov/poisoning.html']],
 chest:[['MedlinePlus — Chest Pain','https://medlineplus.gov/chestpain.html']],
 neurological:[['MedlinePlus — Headache','https://medlineplus.gov/headache.html']],
 urinary:[['MedlinePlus — Urinary Tract Infections','https://medlineplus.gov/urinarytractinfections.html']],
 pain:[['MedlinePlus — Pain','https://medlineplus.gov/pain.html']],
 digestive:[['MedlinePlus — Digestive Diseases','https://medlineplus.gov/digestivediseases.html']],
 skin:[['MedlinePlus — Skin Conditions','https://medlineplus.gov/skinconditions.html']],
 hand:[['NHS — Hand pain','https://www.nhs.uk/symptoms/hand-pain/'],['MedlinePlus — Injuries','https://medlineplus.gov/woundsandinjuries.html']],
 respiratory:[['NHS — Common cold','https://www.nhs.uk/conditions/common-cold/'],['MedlinePlus — Common cold','https://medlineplus.gov/commoncold.html']],
 mental:[['WHO — Mental health','https://www.who.int/health-topics/mental-health'],['MedlinePlus — Mental health','https://medlineplus.gov/mentalhealth.html']],
 checkup:[['MedlinePlus — Health screenings','https://medlineplus.gov/healthscreening.html'],['MedlinePlus — Health checkup','https://medlineplus.gov/ency/article/002125.htm']],
 general:[['MedlinePlus — Health topics','https://medlineplus.gov/healthtopics.html']]
};
const guides={
 limb:'Describe the exact location, injury history, ability to walk or move, and any swelling or numbness. Pain after trauma or inability to bear weight needs professional assessment; new severe one-sided swelling or a cold, pale limb needs urgent assessment.',
 abdominal:'Abdominal pain has many possible causes. Describe its location, onset, intensity, bowel and urinary changes, medicines and pregnancy possibility where relevant. Severe sudden pain, fainting or bleeding requires urgent assessment. Do not assume self-care is appropriate.',
 allergy:'A mild rash can have several causes. Identify any suspected exposure and avoid it if safe. Difficulty breathing, throat or tongue swelling or fainting may signal a life-threatening reaction: contact emergency services immediately.',
 poisoning:'For suspected poisoning, contact a local poison-control service or emergency service immediately. Do not induce vomiting or try home antidotes. Keep product details available if safe.',
 chest:'Chest symptoms can be serious and cannot be assessed safely here. New or unexplained chest pain, especially with breathlessness, faintness or sweating, requires urgent medical assessment.',
 neurological:'Sudden severe headache, new weakness, speech difficulty or confusion requires emergency help. For other neurological concerns, seek medical assessment when new, persistent or worsening.',
 urinary:'Urinary symptoms may need testing and treatment. Fever with flank pain, inability to pass urine or symptoms during pregnancy warrant prompt professional assessment.',
 pain:'For unexplained pain, avoid activities that clearly worsen it and document its location, duration and severity. Because causes vary, arrange professional assessment for persistent, severe or worsening pain. Seek urgent help for severe or rapidly worsening symptoms.',
 digestive:'For mild digestive discomfort, consider adequate fluids and note food, medicines and timing. Do not assume the cause. Seek professional assessment for persistent or worsening symptoms; severe abdominal pain, bloody vomit or black stools need urgent assessment.',
 skin:'For an unfamiliar skin concern, avoid irritating products and note any new medications or exposures. Seek assessment if it spreads, becomes painful, develops fever or persists. Rapid swelling of lips or tongue or breathing trouble requires emergency help.',
 hand:'For a recent minor hand injury, general first aid may include resting the hand, avoiding lifting or forceful gripping, and using a cold pack wrapped in a towel for up to 20 minutes at a time. Do not place ice directly on skin. Remove rings if swelling develops. Do not force movement. A clinician should assess significant pain, swelling or limited movement; online information cannot rule out a fracture.',
 respiratory:'For mild cold-like symptoms, general self-care may include rest, drinking enough fluids, and discussing suitable over-the-counter symptom relief with a pharmacist if needed. Avoid smoking and consider reducing close contact with others while unwell. A clinician can advise if symptoms worsen, persist or you have a condition that increases risk. Difficulty breathing or chest pain requires urgent assessment.',
 mental:'For stress or emotional distress, consider a calm environment, regular meals and sleep, gentle activity if comfortable, and reaching out to someone you trust. A brief grounding exercise may help some people: notice five things you can see, four you can feel, three you can hear, two you can smell and one you can taste. If distress persists or interferes with daily life, consider a qualified mental health professional. If you may harm yourself or someone else, seek immediate local crisis or emergency help.',
 checkup:'For a routine check-up, prepare a list of medications, allergies, family history, prior results, questions and any new symptoms. Ask a licensed clinician which screenings or vaccinations are appropriate for your age, history and local guidance. This prototype does not determine individual screening eligibility or recommend specific tests.',
 general:'I can help organize your questions for a clinician. Record when symptoms began, what makes them better or worse, relevant medicines and any new or worsening changes. For an unfamiliar concern, I cannot safely give condition-specific treatment advice. If symptoms are severe or rapidly worsening, seek prompt professional assessment.'
};
export function assess(notes,answers={},selectedTopic){
 const n=String(notes||'').toLowerCase();
 const hand=/hand|finger|wrist|қол|саусақ|кисть|палец|запясть/.test(n)&&/hit|hurt|injur|fell|fall|pain|swoll|break|broke|broken|fractur|удар|болит|травм|ауыр|соқ/.test(n);
 const topic=selectedTopic&&SOURCES[selectedTopic]?selectedTopic:hand?'hand':'general';
 const urgent=/(?:^|[.!?;]\s*)(?:i have |i am experiencing )?(?:chest pain|difficulty breathing|trouble breathing|severe bleeding)|can't breathe|cannot breathe|unconscious|suicid|self.harm|want to die|hurt myself|i need urgent help/i.test(n)&&!/^(?:no|not|without) (?:chest pain|difficulty breathing|trouble breathing)/.test(n.trim());
 const suspectedFracture=topic==='hand'&&/(?:afraid|think|might|may|possible|suspect|could).{0,35}(?:broken|fractur|broke)|(?:broken|fractur|broke).{0,35}(?:hand|finger|wrist)|(?:hand|finger|wrist).{0,35}(?:broken|fractur|broke)/.test(n);
 const flags=topic==='hand'?['numbness','cannot move','severe pain','changed shape','blue or pale','open wound'].filter(k=>answers[k]):[];
 return {topic,urgent:urgent||flags.length>0||suspectedFracture,flags,recognized:topic!=='general',guidance:urgent?'Potentially serious warning signs were reported. Seek immediate local emergency or crisis assistance if you are in danger or experiencing severe symptoms. Do not wait for this demo.':suspectedFracture?'You mentioned a possible broken hand or fracture. This cannot be ruled out online. Arrange prompt in-person assessment today; an examination and possibly an X-ray may be needed. Until assessed, avoid using or putting weight on the hand, do not force movement, remove rings if swelling begins, and apply a cold pack wrapped in cloth for up to 20 minutes at a time. If fingers are numb, blue, cold, misshapen, or pain is severe, seek emergency care.':flags.length?'Your answers include concerning signs. Arrange prompt in-person medical assessment; for severe symptoms contact local emergency services. General self-care is not a substitute for assessment.':guides[topic],sources:SOURCES[topic]};
}
