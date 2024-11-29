import bcrypt from 'bcrypt';
import httpErrors from 'http-errors';
import { nanoid } from 'nanoid';
import { permissionNames } from '../dictionary/index.js';


export default async (kojo, logger) => {

    const { HTTP } = kojo.functions;
    const { prisma } = kojo.state;

    HTTP.addRoute({
        method: 'GET',
        pathname: '/self',
        permission: permissionNames.getSelf

    }, async (req, res) => {

        const { email, password } = req.body;

        logger.debug('👤🔎 find user:', email);
        const user = await prisma.User.findUnique({ where: { email }});

        if (! user)
            throw new httpErrors.NotFound('user not found');

        logger.debug('🛂 verify password');
        const ok = await bcrypt.compare(password, user.passwordHash);

        if (! ok)
            throw new httpErrors.Unauthorized();

        logger.debug('🔑 issue token for:', user.id);
        const token = await prisma.AuthToken.create({ data: { id: `T${nanoid(14)}`, userId: user.id }});
        res.statusCode = 201;
        return { token: token.id, user };
    })
};
