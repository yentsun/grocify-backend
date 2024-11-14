import sinon from 'sinon';
import { boot } from '../../boot.js';


export let fetchy;
export let kojo;
export let baseURL;

const commonHeaders = {
    'x-platform': 'linux',
    'x-app-version': '0.0.0',
    'connection': 'keep-alive'
}

export async function beforeAll() {

    kojo = await boot();
    const { config } = kojo.state;
    const { hostname, port } = config.http;

    baseURL = `http://${hostname}:${port}`;


    // convenience fetch wrapper
    fetchy = function (path, options={}) {

        options.headers = new Headers({...commonHeaders, ...options.headers });
        const url = `${baseURL}${path}`;
        console.debug('📡 fetchy:', url);

        return fetch(url, options);
    }
}

export async function afterAll() {

    const { httpServer, config, prisma } = kojo.state;
    console.log('> stop http server');
    httpServer.close();

    console.log('> truncate database');
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$disconnect();

    sinon.restore();

    console.log('🏁 DONE');
}