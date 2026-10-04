import test from 'node:test';import assert from 'node:assert/strict';import {medicationReaction} from '../reaction.js';
test('itchy throat after medication overrides old hand-injury topic',()=>{const r=medicationReaction('I drank some medication to numb the pain, but now my throat is itchy',['My hand hurts']);assert.equal(r.topic,'allergy');assert.equal(r.level,'urgent');assert.match(r.message,/urgent medical advice/)});
test('swelling and trouble breathing after medication escalates',()=>assert.equal(medicationReaction('I took a tablet and now my throat is swollen and I have trouble breathing').level,'emergency'));
test('ordinary injury does not trigger reaction',()=>assert.equal(medicationReaction('I hit my hand while playing basketball'),null));
