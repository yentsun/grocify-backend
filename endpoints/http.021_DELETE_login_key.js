import { permissionNames } from '../dictionary/index.js';


export default async (kojo, logger) => {

    const { HTTP, AuthToken } = kojo.functions;

    HTTP.addRoute('DELETE /login/:key', {
        permission: permissionNames.logout,
        schema: {
            key: {
                type: 'string',
                minLength: 15,
                maxLength: 15
            }
        }
    }, async (req, res) => {

        logger.debug('❌🔑', req.key);
        await AuthToken.delete(req.key);

        res.statusCode = 204;
    })
};
