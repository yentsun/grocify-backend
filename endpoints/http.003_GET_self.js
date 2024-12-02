import { permissionNames } from '../dictionary/index.js';


export default async (kojo, logger) => {

    const { HTTP } = kojo.functions;
    const { prisma } = kojo.state;

    HTTP.addRoute({
        method: 'GET',
        pathname: '/self',
        permission: permissionNames.getSelf

    }, async (req) => {

        const { requester } = req.state;
        logger.debug('👤 return user:', requester.id, requester.email);

        return { user: requester };
    })
};
