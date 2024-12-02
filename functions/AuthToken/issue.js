import { nanoid } from 'nanoid';


export default async function ({ id, email }) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;
    const { User } = kojo.functions;

    let userId = id;

    if (! userId && email){
        logger.debug('> fetch user', email);
        userId = (await User.get({ email })).id;
    }

    const token = await prisma.AuthToken.create({ data: { id: `${nanoid(14)}t`, userId }});
    logger.info(token);

    return token.id;
}
