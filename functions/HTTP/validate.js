import httpErrors from 'http-errors';
import screenPassword from '../../lib/screenPassword.js';


/**
 * Validates incoming request data using a provided validator function
 *
 * @param {Object} req - The request object containing query and body data to validate
 * @param {Function} validator - The validator function used to validate the request data.
 *                               It is compiled on route definition at ./addRoute.js
 * @return {void}
 */
export default function validate(req, validator) {

    const [ , logger ] = this;

    // validate incoming data combined
    const payload = {};

    if (req.key) payload.key = req.key;
    if (Object.entries(req.query).length) payload.query = req.query;
    if (req.body && Object.entries(req.body).length) payload.body = req.body;

    console.log(validator.schema, payload)

    logger.debug('⚗️', JSON.stringify({
        ...payload,

        ...payload.body && {
        body: screenPassword(payload.body, [ 'password', 'newPassword' ]) }
    }));
    const valid = validator(payload);

    if (! valid) {
        const { errors: [ error ]} = validator;

        logger.debug('failed:', JSON.stringify(error.message));
        const { keyword, params } = error;
        let message;

        // keyword => message
        const messageMap = {
            required: `Missing '${ error.params.missingProperty }'`,
            maxLength: `'${error.instancePath}' is too long`,
            minProperties: 'No data received',
            minLength: `'${error.instancePath}' is too short`,
            additionalProperties: `'${params.additionalProperty}' should not be in payload`,
            format: `Wrong format for '${error.schema}'`,
            pattern: `Requirements not met for '${error.instancePath}'`
        };

        message = messageMap[keyword];

        if (! message) {
            logger.debug("couldn't format AJV error", keyword, error.dataPath);
            const prefix = error.instancePath || 'Request payload';
            const suffix = error.params.additionalProperty ? `: '${error.params.additionalProperty}'` : '';
            message = `${prefix} ${error.message}${suffix}`;
        }

        throw new httpErrors.BadRequest(message); // TODO consider stop *throwing* http errors. These are not actual errors!
    }
};
