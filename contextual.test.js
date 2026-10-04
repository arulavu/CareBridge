import test from 'node:test';import assert from 'node:assert/strict';import {assess} from '../guidance.js';
test('leg pain routes to leg information, not generic',()=>{const r=assess('hi my leg hurts',{},'pain');assert.equal(r.topic,'leg');assert.match(r.guidance,/leg pain/i);assert.doesNotMatch(r.guidance,/outside|all is good/i)});
test('leg pain days later stays relevant',()=>{const r=assess('hi my leg hurts Pain or discomfort A few days ago None reported',{},'pain');assert.equal(r.topic,'leg');assert.match(r.guidance,/avoid activities/i)});
test('possible broken leg escalates',()=>{const r=assess('I am afraid my leg is broken',{},'pain');assert.equal(r.urgent,true);assert.match(r.guidance,/POSSIBLE FRACTURE/)});
test('one-sided swollen calf prompts urgent assessment',()=>{const r=assess('My calf hurts and one leg is swollen and warm',{},'leg');assert.equal(r.urgent,true);assert.match(r.guidance,/urgent in-person/)});
test('back and headache get separate information',()=>{assert.equal(assess('my back hurts',{},'pain').topic,'back');assert.equal(assess('I have a headache',{},'pain').topic,'headache')});
test('negated breathing symptom is not a detected emergency',()=>{assert.equal(assess('I have no chest pain',{},'general').emergency,false)});
