import test from 'node:test';import assert from 'node:assert/strict';import {topicForConcern,questionsFor,safetyScreen} from './triage.js';
for(const [text,expected] of [['my leg hurts','limb'],['pain in my liver','abdominal'],['I have an allergy','allergy'],['possible poisoning','poisoning'],['annual checkup','checkup'],['rash','skin'],['urinary pain','urinary']])test(text,()=>assert.equal(topicForConcern(text),expected));
test('leg-specific questions',()=>assert.match(questionsFor('limb')[0].q,/area hurts/));
test('poisoning escalates',()=>assert.equal(safetyScreen('possible poisoning','poisoning').level,'urgent'));
test('breathing danger escalates',()=>assert.equal(safetyScreen('trouble breathing','allergy').level,'emergency'));
test('possible fracture escalates',()=>assert.equal(safetyScreen('I think my hand is broken','limb').level,'prompt'));
