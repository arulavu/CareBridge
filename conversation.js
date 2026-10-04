export function messageIntent(input){
 const s=String(input||'').trim().toLowerCase().replace(/[.!?]+$/,'').trim();
 if(/^(hi|hello|hey|hiya|good morning|good evening|thanks|thank you|ok|okay|lol|haha|how are you|what can you do)$/.test(s))return 'social';
 if(/\b(i did not say|i didn't say|never said|not what i (said|asked|meant)|you misunderstood|that's wrong|that is wrong|stop repeating|why (are you|do you) (saying|repeat)|i was joking)\b/.test(s))return 'correction';
 if(/\b(new (question|topic|concern|symptom)|change (the )?(topic|subject)|something else|another (issue|problem|concern)|start over)\b/.test(s))return 'new-topic';
 return 'clinical';
}
export function socialResponse(input){return /thank/i.test(input)?'You’re welcome. Would you like to ask another question, add a symptom, or discuss something different?':'Hello! Would you like to continue your earlier consultation, ask a new health question, or discuss a different concern?';}
