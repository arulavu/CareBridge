import test from 'node:test';import assert from 'node:assert/strict';import {assess} from '../guidance.js';import {safetyScreen} from '../triage.js';
test('car door injury and possible broken fingers override generic limb topic',()=>{const r=assess('I hurt my hand in car door; I think I broke two fingers',{flags:'Deformity / possible fracture'},'limb');assert.equal(r.topic,'hand');assert.equal(r.urgent,true);assert.match(r.guidance,/assessment/);assert.ok(r.sources.every(x=>!/leg/i.test(x[0]+' '+x[1])))});
test('deformity flag alone escalates hand injury',()=>{const r=assess('I hurt my hand',{flags:'Deformity / possible fracture'},'limb');assert.equal(r.urgent,true);assert.match(r.guidance,/fracture/)});
test('car door crushing injury is flagged',()=>assert.equal(safetyScreen('My hand got shut in a car door','limb').level,'prompt'));
test('cold or blue fingers need emergency care',()=>assert.equal(safetyScreen('my fingers are blue and cold','limb').level,'emergency'));
