import test from 'node:test';import assert from 'node:assert/strict';import {classify,train,samples} from '../model.js';
test('model trains on bundled English and Kazakh examples',()=>{const m=train(samples);assert.equal(m.labels.length,4);assert.ok(m.vocab.size>20);});
test('appointment example recognized',()=>assert.equal(classify('I need to book an appointment').category,'appointment'));
test('clinic information recognized',()=>assert.equal(classify('Where is the clinic and what are its opening hours').category,'clinic_info'));
test('out-of-vocabulary request abstains',()=>assert.equal(classify('zzzx qqqy').category,'unknown'));
test('does not output diagnosis or urgency categories',()=>{const allowed=new Set(['appointment','clinic_info','records','follow_up','unknown']);for(const s of ['I feel very sick','My skin hurts','Денем ауырады'])assert.ok(allowed.has(classify(s).category));});
