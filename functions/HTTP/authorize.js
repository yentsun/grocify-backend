import assert from 'assert';
import httpErrors from 'http-errors';
import { userRoles } from '../../dictionary/index.js';
import permissions from '../../permissions.js';


export default async function (req, permission) {

    const [ kojo, logger ] = this;
    const { AuthToken, User } = kojo.functions;
    assert(permission, `No permission defined`);

    if (! req.headers.authorization) {
        logger.debug('no auth header');
        req.state.role = userRoles.anonymous;
    }

    if (req.headers.authorization) {
        const tokenId = req.headers.authorization.split('Bearer ')[1];

        if (! tokenId || tokenId.length !== 15)
            throw new httpErrors.BadRequest('No authorization token');

        logger.debug('🛂🔑 verifying token:', tokenId);
        const userId = await AuthToken.verify(tokenId) ;

        if (! userId)
            throw new httpErrors.BadRequest('Token verification failed');

        req.state.requesterId = userId;
        req.state.requester = await User.get({ id: userId });
        req.state.role = userRoles.registered;
    }

    logger.debug('🛂📃 check permission:', req.state.role, permission);
    const checks = permissions[req.state.role][permission];

    if (! checks?.length) {
        logger.debug('💨 no checks, OK');
        return;
    }

    try {
        logger.debug('🛂🔎 perform checks', checks.length);
        assert(checks.every(check => Boolean(check(req))));
        logger.debug('🛂✔ OK');
    } catch (error) {
        throw new httpErrors.Forbidden(error.message);
    }


};
