import sinon from 'sinon';
import { boot } from '../../boot.js';
import userFixtures from '../fixtures/users.json' assert { type: 'json' };


export let fetchy;
export let kojo;
export let baseURL;
export let instances;
export const state = {};

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

    const { httpServer, prisma } = kojo.state;
    console.log('> stop http server');
    httpServer.close();

    console.log('> truncate database');
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$disconnect();

    sinon.restore();

    console.log('🏁 DONE');
}

export async function loadFixtures() {

    const { User, AuthToken } = kojo.functions;

    const users = await Promise.all(userFixtures.map(User.create));
    const tokens = await Promise.all(users.map(AuthToken.issue))

    instances = { users, tokens };
}
