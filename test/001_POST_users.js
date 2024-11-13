import assert from 'assert';
import { fetchy } from './before/index.js';
import users from './fixtures/users.json' assert { type: 'json' };


describe('001 POST /users', () => {

    it('creates a user normally', async() => {

        const res = await fetchy('/users', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(users[0]) });

        assert.strictEqual(res.ok, true);
        assert.strictEqual(res.status, 201);
    });
});
