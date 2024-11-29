import assert from 'assert';
import { fetchy } from './before/index.js';
import userFixtures from './fixtures/users.json' assert { type: 'json' };


describe('002 POST /login', () => {

    it('logs in a user normally', async() => {

        const { email, password, name } = userFixtures[0];

        const res = await fetchy('/login', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ email, password }) });

        assert.strictEqual(res.status, 201);
        const json = await res.json();
        assert.strictEqual(json.user.name, name);
        assert.strictEqual(json.token.length, 15);
    });
});
