// Small, auditable on-device multinomial Naive Bayes classifier.
// Administrative intake categories ONLY; never clinical diagnosis, triage or urgency.
export const samples = [
 ['I need to book an appointment','appointment'],['Can I schedule a visit with the clinic','appointment'],['I want to see a doctor next week','appointment'],['Please arrange my consultation','appointment'],['Дәрігерге жазылғым келеді','appointment'],['Қабылдауға жазылу керек','appointment'],
 ['Where is the clinic and what are its opening hours','clinic_info'],['What is the clinic phone number','clinic_info'],['How can I find the health center','clinic_info'],['When is the clinic open','clinic_info'],['Емхана қайда орналасқан','clinic_info'],['Емхананың жұмыс уақыты қандай','clinic_info'],
 ['I need to share my medical history with a nurse','records'],['Can I send my consultation notes','records'],['I want to upload my records for the doctor','records'],['Please prepare a summary of my health notes','records'],['Дәрігерге жазбаларымды жібергім келеді','records'],['Медициналық құжаттарды жіберу','records'],
 ['I need information about a follow up appointment','follow_up'],['When should I return for my next visit','follow_up'],['I have a question about my previous appointment','follow_up'],['How can I contact the doctor after the visit','follow_up'],['Келесі қабылдау қашан','follow_up'],['Қайта қаралу туралы сұрақ','follow_up']
];
const tokenize = s => (s.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
export function train(rows=samples){
 const labels=[...new Set(rows.map(r=>r[1]))], vocab=new Set(), counts={}, totals={}, docs={};
 for(const label of labels){counts[label]={};totals[label]=0;docs[label]=0;}
 for(const [phrase,label] of rows){docs[label]++;for(const word of tokenize(phrase)){vocab.add(word);counts[label][word]=(counts[label][word]||0)+1;totals[label]++;}}
 return {labels,vocab,counts,totals,docs,n:rows.length};
}
export const model=train();
export function classify(input,trained=model){
 const words=tokenize(input).filter(w=>trained.vocab.has(w));
 if(words.length===0)return {category:'unknown',confidence:0,matched:0};
 const scores=trained.labels.map(label=>{
   let score=Math.log(trained.docs[label]/trained.n);
   for(const w of words)score+=Math.log(((trained.counts[label][w]||0)+1)/(trained.totals[label]+trained.vocab.size));
   return {label,score};
 });
 const max=Math.max(...scores.map(x=>x.score));const exp=scores.map(x=>Math.exp(x.score-max));const sum=exp.reduce((a,b)=>a+b,0);
 const ranked=scores.map((x,i)=>({label:x.label,p:exp[i]/sum})).sort((a,b)=>b.p-a.p);
 const confidence=ranked[0].p;
 return {category:confidence>=0.62&&words.length>=2?ranked[0].label:'unknown',confidence,matched:words.length};
}
