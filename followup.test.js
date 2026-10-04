import test from 'node:test';import assert from 'node:assert/strict';import {followupAnswer} from '../followup.js';
test('suspected fracture never recommends waiting',()=>{const a=followupAnswer('Can I wait until tomorrow?',{topic:'hand',context:'car door crushed my fingers; possible fracture',guide:{urgent:true}});assert.match(a,/today/);assert.match(a,/cannot safely recommend waiting/i)});
test('new symptoms can trigger appropriate caution',()=>{const a=followupAnswer('What can I do?',{topic:'hand',context:'hand pain',safety:{level:'emergency'}});assert.match(a,/emergency services now/)});
test('doctor question has relevant hand referral',()=>{const a=followupAnswer('Which doctor should I see?',{topic:'hand',context:'finger injury'});assert.match(a,/urgent care/)});
test('unanswered questions acknowledge limits',()=>{const a=followupAnswer('Can I wait?',{topic:'general'});assert.match(a,/cannot confirm/i)});
