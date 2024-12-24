import querystring from 'querystring';
import httpErrors from 'http-errors';


export default function parse(body, contentType) {

    const [ , logger ] = this;

    if (! body) return;

    let result;
    logger.debug('🔪 content type:', contentType);

    switch (contentType) {

        case 'application/json':
            result = JSON.parse(body);
            break;

        case 'application/x-www-form-urlencoded':
            result = querystring.parse(body);
            break;

        default:
            throw new httpErrors.BadRequest('Unexpected content type');
    }

    return result;
};