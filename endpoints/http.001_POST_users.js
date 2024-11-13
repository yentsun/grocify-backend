export default async (kojo, logger) => {

    const { HTTP, User } = kojo.functions;

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

        const newUser = await User.create({ name, email, password });

        if (newUser) {
            logger.info('👤🔰 new user:', newUser);

        }

        return 'ok';
    })
};