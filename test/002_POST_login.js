import assert from 'assert';
import { fetchy } from './before/index.js';
import users from './fixtures/users.json' assert { type: 'json' };


const alice = users[0];

describe('002 POST /login', () => {

    it('logs in a user normally', async() => {

        const { email, password } = alice;

        const res = await fetchy('/login', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ email, password }) });

        assert.strictEqual(res.status, 201);
        const json = await res.json();
        assert.strictEqual(json.user.name, alice.name);
        assert.strictEqual(json.token.length, 15);
    });
});
