import assert from 'assert';
import { fetchy, state, kojo } from './before/index.js';


describe('021 DELETE /login/:token', () => {

    it('deletes an auth token', async() => {

        const res = await fetchy(`/login/${state.aliceToken}`, { method: 'DELETE' });

        assert.strictEqual(res.status, 204);
        assert.ok(! await kojo.functions.AuthToken.verify(state.aliceToken));
    });

    it('rejects with 404', async() => {

        const res = await fetchy(`/login/978Kfg`, { method: 'DELETE' });

        assert.strictEqual(res.status, 400);
    });
});
