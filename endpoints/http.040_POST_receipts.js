import httpErrors from 'http-errors';
import { nanoid } from 'nanoid';
import path from 'path';
import mime from 'mime-types';
import os from 'os';
import { permissionNames, suffixes } from '../dictionary/index.js';
import { Base64Encode } from 'base64-stream';
import { PassThrough, pipeline } from 'stream';


export default async (app, logger) => {

    const { HTTP, AuthToken, User } = app.functions;
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

        try {
            logger.debug('send request to chatGPT: analyze image');
            const chatGptResponse = await openAi.chat.completions.create({
                response_format: { type: 'json_object' },
                model: 'o4-mini-2025-04-16',
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Analyze this receipt and return the following information:' +
                                              'json object with receipt id, shop name, location and country and array of data objects ' +
                                              'with category, sub-category, name, translated name, item count, price as amount and currency.' },
                        { type: 'image_url', image_url: { url: base64Data }}
                    ]
                }],
            });

            const data = JSON.parse(chatGptResponse.choices[0].message.content);
            logger.debug(data);
            res.statusCode = 200;
            return { data };

        } catch (error) {
            logger.error(error.message)

        }
    })
};
