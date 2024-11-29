import assert from 'assert';
import { fetchy } from './before/index.js';
import users from './fixtures/users.json' assert { type: 'json' };


describe('001 POST /users', () => {

    it('creates a user normally', async() => {

        const res = await fetchy('/users', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                email: 'edwdNorthrp@huemail.net',
                name: 'Edward Northrop',
                password: 'ヒUrwUグuヹK8' }) });

        assert.strictEqual(res.status, 201);
        assert.strictEqual((await res.json()).newUser.name, 'Edward Northrop');
    });

    it('rejects payload with existing email', async () => {
        const res = await fetchy('/users', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                email: 'edwdNorthrp@huemail.net',
                name: 'Edward Northrop',
                password: 'ォ680Yツヴzヱ' }) });

        assert.strictEqual(res.status, 409);
    });
});
