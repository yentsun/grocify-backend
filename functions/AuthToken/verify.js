/**
 * Retrieves the user ID associated with the provided authentication token ID.
 * @param {string} tokenId - The ID of the authentication token to retrieve user ID for.
 * @returns {Promise<string>} - A Promise that resolves with the user ID associated with the token.
 */
export default async function (tokenId) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;

    const token = await prisma.AuthToken.findUnique({ where: { id: tokenId }});
    logger.debug({ token });

    return token?.userId;
}
