import httpErrors from 'http-errors';
import { userStatuses } from '../../dictionary/index.js';


const { BadRequest, Forbidden } = httpErrors;

/**
 * Authorize a request for a specific access record.
 * 1. Extract JWT
 * 2. Map shorthand properties to real ones
 * 3. Perform a call to `checkACE`
 * 4. Throw if no permission
 * 5. Return principal value
 *
 * @param {Object<IncomingMessage>} req - the request
 * @param {Array} access - access 'tuple': [principal, action, resource]
 * @return {String} - principal ID value (later objects probably)
 */
export default async function (req, access) {

    const [ kojo, logger ] = this;

    if (! req.headers.authorization) {
        logger.debug('🛂❌ no auth header');
        req.userStatus = userStatuses.anonymous;
        return;
    }

    const tokenId = req.headers.authorization.split('Bearer ')[1];
    logger.debug('checking token presence');

    if (! tokenId)
        throw new BadRequest('No authorization token');

    logger.debug('🛂🔑 verifying token', tokenId);
    const token = await AuthToken.verify(tokenId) ;

    if (! token)
        throw new BadRequest('Token verification failed');

    // extract principal ID
    const { userId } = token;

    // authorize
    const [ principalField, action, resource ] = access;

    if (`${type}Id` !== principalField) {
        // token principal type doesn't match endpoint principal type
        // example: we are authorizing player but pass a token for a facility
        throw new BadRequest('Principal type mismatch');
    }

    logger.debug('authorizing', type, id, action, resource);
    const can = await tasu.request(t.checkACE, [ id, action, resource ]);

    if (! can)
        throw new Forbidden('Access denied');

    // fetch & attach authorized principal
    req.principalId = id;
};