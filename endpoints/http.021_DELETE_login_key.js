import httpErrors from 'http-errors';
import { permissionNames } from '../dictionary/index.js';


export default async (kojo, logger) => {

    const { HTTP, AuthToken } = kojo.functions;

    HTTP.addRoute('DELETE /login/:key', {
        permission: permissionNames.logout,
        schema: {
            key: { type: 'string', length: 14 }
        }
    }, async (req, res) => {

        logger.debug('❌🔑', req.key);
        await AuthToken.delete(req.key);

        res.statusCode = 204;
    })
};
