import { userRoles, permissionNames as perm, errorCodes } from './dictionary/index.js';
import ExpectedError from './lib/ExpectedError.js';


export default {
    [userRoles.anonymous]: [
        [ perm.healthCheck ],
        [ perm.login ], [perm.logout],
        [ perm.registerSelf ]
    ],

    [userRoles.registered]: [
        [ perm.getSelf, [ isOk ]],
        [ perm.postReceipt, [ isOk ] ]
    ]
}

function isOk(req) {
    if (! Boolean(req.state.requester))
        throw new ExpectedError('Not registered', errorCodes.notRegistered);
    return true;
}
