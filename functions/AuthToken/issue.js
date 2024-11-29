import { nanoid } from 'nanoid';


export default async function (user) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;

    const token = await prisma.AuthToken.create({ data: { id: `T${nanoid(14)}`, userId: user.id }});
    logger.info(token);

    return token;
}
