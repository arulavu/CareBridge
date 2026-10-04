import test from 'node:test';import assert from 'node:assert/strict';import {messageIntent} from '../conversation.js';
test('greetings not symptoms',()=>{for(const s of ['hi','hello','lol','thanks'])assert.equal(messageIntent(s),'social')});
test('correction interrupts prior advice',()=>assert.equal(messageIntent('but I did not say anything about it lol'),'correction'));
test('new topic recognized',()=>assert.equal(messageIntent('new topic'),'new-topic'));
test('symptoms preserved',()=>assert.equal(messageIntent('my leg hurts'),'clinical'));
