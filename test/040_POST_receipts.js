import fs from 'fs';
import assert from 'assert';
import { fetchy, instances } from './before/index.js';


describe('040 POST /receipts', () => {

    it('posts a single receipt', async() => {

        const bobToken = instances.tokens[1];
        const receiptPath = 'test/fixtures/test_receipt.jpg';
        const stats = fs.statSync(receiptPath);
        const fileSizeInBytes = stats.size;

        const res = await fetchy('/receipts', {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Length': fileSizeInBytes,
                Authorization: `Bearer ${bobToken}` },
            method: 'POST',
            duplex: 'half',
            body: fs.createReadStream(receiptPath) });

        assert.strictEqual(res.status, 201);
    });
});
