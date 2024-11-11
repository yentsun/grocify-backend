import { StringDecoder } from 'string_decoder';
import { HttpError } from 'http-errors';
import HRT2sec from '../../lib/HRT2sec.js';


// Set limit to 1MB
const MAX_CONTENT_LENGTH = 1e6;

/**
 * General request handler
 *
 * @async
 * @param {Object} req - IncomingMessage (https://nodejs.org/api/http.html#http_class_http_incomingmessage)
 * @param {Object} res - ServerResponse (https://nodejs.org/api/http.html#http_class_http_serverresponse)
 * @return {Promise}
 */
export default async function requestMiddleware(req, res) {

    const [ kojo, logger ] = this;
    const { trid } = kojo.state;
    const { HTTP } = kojo.functions;

    const { method, url } = req;

    const reqID = trid.seq();
    logger.debug(`<-- [${reqID}] ${method} ${url}`);
    req.headers['content-type'] && logger.debug('content-type is', req.headers['content-type']);
    const start = process.hrtime();

    // set general headers
    res.sendDate = true;
    res.setHeader('X-Request-ID', reqID);
    res.setHeader('Content-Type', 'application/json');

    // capture body
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);

        // Check Content-Length and end connection if over limit
        if(buffer.length > MAX_CONTENT_LENGTH){
            req.connection.destroy();
            logger.error(`⚠ request content length exceeded limit of ${MAX_CONTENT_LENGTH} bytes`);
        }
    });
    const requestBody = await new Promise(resolve => {
        req.on('end', () => {
            buffer += decoder.end();
            resolve(buffer);
        });
    }); // TODO add content length limit!

    let responseBody = '';
    let symbol = '->';

    // general request handling
    try {
        // extract endpoint config and parameters
        const { resourceId, handler, access, query, validator } = HTTP.router(method, url);
        req.resourceId = resourceId;
        req.query = query;

        // parse JSON body
        req.body = HTTP.parse(requestBody, req.headers['content-type']);

        // validate against the schema
        if (validator)
            HTTP.validate(req, validator);

        // run authorization if any
        if (access) {
            const [principalField] = access;
            req[principalField] = await HTTP.authorize(req, access);
        }

        // call endpoint handler
        const result = await handler(req, res);

        if (typeof result === 'object')
            responseBody = JSON.stringify(result);

    } catch (error) { // error response

        symbol = '❌';
        res.setHeader('Content-Type', 'text/plain');

        if (error instanceof HttpError) {
            res.statusCode = error.statusCode;
            responseBody = error.message;
        } else {
            res.statusCode = 500;
            logger.error(error.stack);
            responseBody = 'Unexpected error';
        }

    } finally { // finalize any response

        const length = Buffer.byteLength(responseBody);
        res.setHeader('Content-Length', length);

        logger.debug(`${symbol} [${reqID}] ${res.statusCode} / ${length} bytes / ${HRT2sec(process.hrtime(start))} sec \n${JSON.stringify(res.getHeaders(), null, 2)} \n-----------------------------\n${responseBody}\n-----------------------------`);
        res.end(responseBody);
    }
};