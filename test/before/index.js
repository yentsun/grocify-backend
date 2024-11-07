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

    const { httpServer } = kojo.state;
    console.log('> stopping http server');
    httpServer.close();

    sinon.restore();
}