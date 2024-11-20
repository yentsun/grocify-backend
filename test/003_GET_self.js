import assert from 'assert';
import users from './fixtures/users.json' assert { type: 'json' };
import { fetchy, kojo } from './before/index.js';


const alice = users[0];

describe('003 GET /self', () => {

    it('returns logged-in user normally', async() => {

        const alice = kojo.state.alice;
        const token = await kojo.functions.AuthToken.issue(alice.id);

        const res = await fetchy('/self', {
            headers: { 'Authorization': `Bearer ${token}` }});

        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.strictEqual(json.user.name, alice.name);
        assert.strictEqual(json.token.length, 15);
    });
});
