/**
 * Async function to find a user by specific data using Prisma
 *
 * @param {Object} data - The search criteria for finding a user
 * @returns {Promise<Object>} - The user object if found, otherwise null
 */
export default async function (data) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;

    const user = await prisma.User.findUnique({ where: data });

    if (user)
            logger.info(user.id, user.email);

    return user;
}
