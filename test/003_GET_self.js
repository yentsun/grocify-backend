import assert from 'assert';
import userFixtures from './fixtures/users.json' assert { type: 'json' };
import { fetchy, instances } from './before/index.js';


describe('003 GET /self', () => {

    it('returns logged-in user normally', async() => {

        const res = await fetchy('/self', {
            headers: { 'Authorization': `Bearer ${instances.tokens[0]}` }});

        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.strictEqual(json.user.name, userFixtures[0].name);
        assert.strictEqual(json.token.length, 15);
    });
});
