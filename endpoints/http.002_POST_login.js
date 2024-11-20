import bcrypt from 'bcrypt';
import httpErrors from 'http-errors';


export default async (kojo, logger) => {

    const { HTTP, AuthToken } = kojo.functions;
    const { prisma } = kojo.state;

    HTTP.addRoute({
        method: 'POST',
        pathname: '/login',
        access: [ 'anonymous', 'login' ],
        schema: { body: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }}}

    }, async (req, res) => {

        const { email, password } = req.body;

        logger.debug('👤🔎 find user:', email);
        const user = await prisma.User.findUnique({ where: { email }});

        if (! user)
            throw new httpErrors.NotFound('user not found');

        logger.debug('🛂 verify password');
        if (! await bcrypt.compare(password, user.passwordHash))
            throw new httpErrors.Unauthorized();

        logger.debug('🔑 issue token for:', user.id);
        const token = await AuthToken.issue(user.id);

        kojo.state.alice = user;

        res.statusCode = 201;
        return { token: token.id, user };
    })
};