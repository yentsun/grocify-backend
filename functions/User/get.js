/**
 * Async function to find a user by specific data using Prisma
 *
 * @param {Object} where - The search criteria for finding a user
 * @returns {Promise<Object>} - The user object if found, otherwise null
 */
export default async function (where) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;

    const user = await prisma.User.findUnique({ where });
    logger.debug(user.id, user.email);

    return user;
}
