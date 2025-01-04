import httpErrors from 'http-errors';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import os from 'os';
import { permissionNames, suffixes } from '../dictionary/index.js';
import { Base64Encode } from 'base64-stream';
import { PassThrough, pipeline } from 'stream';


export default async (kojo, logger) => {

    const { HTTP, AuthToken, User } = kojo.functions;
    const { openAi } = kojo.state;

    HTTP.addRoute('POST /receipts', {
        permission: permissionNames.postReceipt,
    }, async (req, res) => {

        const incoming = req;
        incoming.on('data', (data) => {
            logger.debug('🔣', data.length);
        });
        const id = `${nanoid(12)}${suffixes.receipt}`;
        const ext = mime.extension(req.headers['content-type']);
        // const storagePath = path.join(os.tmpdir(), path.basename(`grocify_${id}.${ext}`));
        // logger.debug('💾 store image:', storagePath);
        // incoming.pipe(fs.createWriteStream(storagePath));

        const outgoing = new PassThrough();
        pipeline(
            incoming,
            new Base64Encode(),
            process.stdout,
            () => {
                logger.debug('pipeline finished');
        });

        // try {
        //
        //     const chatGptResponse = await openAi.chat.completions.create({
        //         model: 'gpt-4o-mini',
        //         messages: [{
        //             role: 'user',
        //             content: [
        //                 { type: 'text', text: 'analyze' },
        //                 { type: 'image_url', image_url: { url: await new Response(outgoing).blob() } }
        //             ]
        //         }],
        //     });
        //
        //     const json = await chatGptResponse.json();
        //     logger.debug(json)
        //
        // } catch (error) {
        //     logger.error(error.message)
        //
        // }
    })
};
