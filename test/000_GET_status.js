import assert from 'assert';
import { fetchy, beforeAll, afterAll } from './before/index.js';


before(async function () {
    await beforeAll();
});

after(async function () {
    await afterAll();
});

describe('000 GET /status', () => {

    it('responds normally with 204', async() => {

        const res = await fetchy('/status');

        assert.strictEqual(res.ok, true);
        assert.strictEqual(res.status, 204);
    });
});
