import httpErrors from 'http-errors';
import { nanoid } from 'nanoid';
import path from 'path';
import mime from 'mime-types';
import os from 'os';
import { permissionNames, suffixes } from '../dictionary/index.js';
import { Base64Encode } from 'base64-stream';
import { PassThrough, pipeline } from 'stream';
import analyzeReceipt from '../functions/ChatGpt/analyzeReceipt.js';


export default async (app, logger) => {

    const { HTTP, ChatGpt } = app.functions;
    const { openAi } = app.state;

    HTTP.addRoute('POST /receipts', {
        permission: permissionNames.postReceipt,
    }, async (req, res) => {

        const incoming = req;
        // incoming.on('data', (data) => {
        //     logger.debug('🔣', data.length);
        // });
        const id = `${nanoid(12)}${suffixes.receipt}`;
        const ext = mime.extension(req.headers['content-type']);
        // const storagePath = path.join(os.tmpdir(), path.basename(`grocify_${id}.${ext}`));
        // logger.debug('💾 store image:', storagePath);
        // incoming.pipe(fs.createWriteStream(storagePath));

        const outgoing = new PassThrough();
        const chunks = [];
        outgoing.on('data', chunk => chunks.push(chunk));

        await new Promise(resolve => pipeline(
            incoming,
            new Base64Encode({ prefix:`data:${req.headers['content-type']};base64,` }),
            outgoing,
            (error) => {
                logger.debug('pipeline finished', error?.message);
                resolve();
            }
        ));

        const base64Data = Buffer.concat(chunks).toString();
        const data = await ChatGpt.analyzeReceipt(base64Data);

    });
};
