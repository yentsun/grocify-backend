import { nanoid } from 'nanoid';
import { suffixes } from '../../dictionary/index.js';


export default async function ({ id, email }) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;
    const { User } = kojo.functions;

    let userId = id;

    if (! userId && email){
        logger.debug('> fetch user', email);
        userId = (await User.get({ email })).id;
    }

    const token = await prisma.AuthToken.create({ data: { id: `${nanoid(14)}${suffixes.token}`, userId }});
    logger.info(token);

    return token.id;
}
