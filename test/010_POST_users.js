import assert from 'assert';
import { fetchy } from './before/index.js';


describe('010 POST /users', () => {

    it('creates a user normally', async() => {

        const res = await fetchy('/users', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                email: 'edwdNorthrp@HUEmail.net',
                name: 'Edward Northrop',
                password: 'ヒUrwUグuヹK8' }) });

        assert.strictEqual(res.status, 201);
        const json = await res.json();
        assert.strictEqual(json.newUser.passwordHash, undefined);
        assert.strictEqual(json.newUser.name, 'Edward Northrop');
        assert.strictEqual(json.newUser.email, 'edwdnorthrp@huemail.net');
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

    it('rejects if invalid email', async () => {
        const res = await fetchy('/users', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                email: 'edwdNorthrphuemail.net',
                name: ' No',
                password: 'ォ680Yツヴzヱ' }) });

        assert.strictEqual(res.status, 400);
    });

});
