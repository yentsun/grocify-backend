/**
 * Delete an authentication token from the database.
 *
 * @param {string} tokenId - The ID of the authentication token to be deleted.
 */
export default async function (tokenId) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;

    const token = await prisma.AuthToken.delete({ where: { id: tokenId }});
    logger.info(token);
}
