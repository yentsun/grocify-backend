import * as path from 'node:path';
import OpenAI from 'openai';
import configLoader from 'yt-config';
import AJV from 'ajv';
import ajvSanitizer from 'ajv-sanitizer';
import ajvKeywords from 'ajv-keywords';
import addFormats from 'ajv-formats';
import Kojo from 'kojo';
import TRID from 'trid';
import { PrismaClient } from '@prisma/client'


export async function boot() {

    console.log('> config');
    const config = await configLoader(path.join(process.cwd(), 'config.ini'));

    console.log('> Kojo');
    const kojo = new Kojo(config.kojo);
    kojo.set('config', config);
    kojo.set('routes', {});

    console.log('> AJV');
    const ajv = new AJV({ verbose: true, coerceTypes: true, $data: true, strict: false });
    ajvKeywords(ajv);
    addFormats(ajv);
    kojo.set('ajv', ajvSanitizer(ajv));

    console.log('> Prisma')
    kojo.set('prisma', new PrismaClient());

    console.log('> Trid');
    kojo.set('trid', new TRID({ prefix: kojo.id, length: 4 }));

    console.log('> OpenAI');
    kojo.set('openAi', new OpenAI());

    console.log('> wait for ready');
    await kojo.ready();

    const { HTTP } = kojo.functions;
    kojo.set('httpServer', await HTTP.listen());

    return kojo;
}
