import bcrypt from 'bcrypt';
import httpErrors from 'http-errors';
import { customAlphabet } from 'nanoid';


export default async (kojo, logger) => {

    const { HTTP } = kojo.functions;
    const { prisma } = kojo.state;

    HTTP.addRoute({
        method: 'POST',
        pathname: '/users',
        access: [ 'anonymous', 'create', 'user' ],
        schema: { body: {
            name: { type: 'string', minLength: 3, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }}}

    }, async (req, res) => {

        const { name, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 12);
        const nanoid = customAlphabet(`123${name}`.toLowerCase().replace(/ /g,''), 10);
        const id = nanoid();
        logger.debug('create user', { email, id, name }, '; pwd:', password.length);
        const newUser = await prisma.User.create({ data: { id, name, email, passwordHash }});

        if (! newUser) {
            throw new httpErrors.Conflict('failed to create new user');
        }

        logger.info('👤🔰 new user:', newUser);
        res.statusCode = 201;
        return { newUser };
    })
};