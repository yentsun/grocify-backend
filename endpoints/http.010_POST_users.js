import httpErrors from 'http-errors';
import { errorCodes, permissionNames } from '../dictionary/index.js';


export default async (kojo, logger) => {

    const { HTTP, User } = kojo.functions;

    HTTP.addRoute('POST /users', {
        permission: permissionNames.registerSelf,
        schema: { body: {
            name: { type: 'string', minLength: 3, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }}}

    }, async (req, res) => {

        try {
            const newUser = await User.create(req.body);
            logger.info('👤🔰 new user:', newUser);
            res.statusCode = 201;
            return { newUser };

        } catch (error) {
            logger.error(error);

            if (error.code === errorCodes.duplicate)
                throw new httpErrors.Conflict(error.message);
        }
    })
};
