/**
 * Removes the password hash from the user object and returns the remaining properties.
 *
 * @function
 * @param {Object} user - The user object containing user details.
 * @returns {Object} - A new object containing all properties of the user except the password hash.
 */
export default function(user) {

    const { passwordHash, ...allowedData } = user;

    return allowedData;
}
