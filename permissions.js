import { userRoles, permissionNames as perm, errorCodes } from './dictionary/index.js';
import ExpectedError from './lib/ExpectedError.js';


export default {
    [userRoles.anonymous]: [
        [ perm.healthCheck ],
        [ perm.login ],
        [ perm.registerSelf ]
    ],

    [userRoles.registered]: [
        [ perm.getSelf, [ isRegistered ]]
    ]
}

function isRegistered(req) {
    if (! Boolean(req.state.requester))
        throw new ExpectedError('Not registered', errorCodes.notRegistered);
    return true;
}
