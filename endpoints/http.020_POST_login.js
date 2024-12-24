import httpErrors from 'http-errors';
import { permissionNames } from '../dictionary/index.js';


export default async (kojo, logger) => {

    const { HTTP, AuthToken, User } = kojo.functions;

    HTTP.addRoute('POST /login', {
        permission: permissionNames.login,
        schema: {
            body: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 }}
        }
    }, async (req, res) => {

        const { email, password } = req.parsed;

        logger.debug('🛂 verify password');
        if (! await User.checkPassword(email, password))
            throw new httpErrors.Unauthorized('Bad user or password');

        logger.debug('🔑 issue token for:', email);
        const token = await AuthToken.issue({ email });

        res.statusCode = 201;
        return { token, user: await User.get({ email }) };
    })
};
