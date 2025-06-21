import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { errorCodes, suffixes } from '../../dictionary/index.js';
import ExpectedError from '../../lib/ExpectedError.js';


/**
 * Asynchronous function to create a new user in the database.
 *
 * @param {Object} data - Data object containing user information.
 * @param {string} data.email - User email address.
 * @param {string} data.name - User name.
 * @param {string} data.password - User password.
 *
 * @returns {Promise<Object>} A Promise that resolves with the created user object.
 */
export default async function (data) {

    const [ kojo, logger ] = this;
    const { prisma } = kojo.state;
    const { email, name, password } = data;

    const id = `${nanoid(9)}${name.slice(0, 2)}${suffixes.user}`;
    const passwordHash = await bcrypt.hash(password, 12);

    try {
        logger.debug('> create user', email, id, name, '; pwd:', password.length);
        return await prisma.User.create({ data: { id, email, name, passwordHash }});

    } catch (error) {
        logger.error(error);

        if (error.code === 'P2002')
            throw new ExpectedError(`User already registered: ${email}`, errorCodes.duplicate);

        logger.debug('re-throw error with code:', error.code);
        throw error;
    }
}
