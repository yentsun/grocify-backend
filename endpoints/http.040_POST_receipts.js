import httpErrors from 'http-errors';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import os from 'os';
import { permissionNames, suffixes } from '../dictionary/index.js';
import { nanoid } from 'nanoid';


export default async (kojo, logger) => {

    const { HTTP, AuthToken, User } = kojo.functions;

    HTTP.addRoute('POST /receipts', {
        permission: permissionNames.postReceipt,
    }, async (req, res) => {

        const incoming = req;
        incoming.on('data', (data) => {
            logger.debug('🔣', data.length);
        });
        const id = `${nanoid(12)}${suffixes.receipt}`;
        const ext = mime.extension(req.headers['content-type']);
        const storagePath = path.join(os.tmpdir(), path.basename(`grocify_${id}.${ext}`));
        logger.debug('💾 store image:', storagePath);
        incoming.pipe(fs.createWriteStream(storagePath));
    })
};
