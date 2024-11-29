import assert from 'assert';
import { fetchy, beforeAll, afterAll, loadFixtures } from './before/index.js';


before(async function () {
    await beforeAll();
    await loadFixtures();
});

after(async function () {
    await afterAll();
});

describe('000 GET /status', () => {

    it('responds normally with 200', async() => {

        const res = await fetchy('/status');

        assert.strictEqual(res.ok, true);
        assert.strictEqual(res.status, 200);
    });
});
