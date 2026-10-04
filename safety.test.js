import test from 'node:test';import assert from 'node:assert/strict';import {assess} from '../guidance.js';
test('suspected hand fracture does not reassure',()=>{const r=assess('I am afraid my hand is broken',{},'injury');assert.equal(r.topic,'hand');assert.equal(r.urgent,true);assert.match(r.guidance,/prompt in-person assessment/);assert.doesNotMatch(r.guidance,/all is good|nothing serious/i)});
test('hand injury gets related care not blanket reassurance',()=>{const r=assess('My hand hurts after I hit it',{},'injury');assert.equal(r.topic,'hand');assert.match(r.guidance,/cold pack/)});
test('mental, respiratory, digestive and skin have distinct guidance',()=>{for(const topic of ['mental','respiratory','digestive','skin']){const r=assess('I have a concern',{},topic);assert.equal(r.topic,topic);assert.equal(r.recognized,true)}});
test('critical chest pain is escalated',()=>assert.equal(assess('I have chest pain',{},'general').urgent,true));
