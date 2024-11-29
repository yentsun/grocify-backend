import httpErrors from 'http-errors';
import screenPassword from '../../lib/screenPassword.js';


/**
 * Validates incoming request data using a provided validator function
 *
 * @param {Object} req - The request object containing query and body data to validate
 * @param {Function} validator - The validator function used to validate the request data
 * @return {void}
 */
export default function validate(req, validator) {

    const [ , logger ] = this;

    // validate incoming data combined
    const payload = {};

    if (Object.entries(req.query).length) payload.query = req.query;
    if (Object.entries(req.body).length) payload.body = req.body;

    logger.debug('checking:', JSON.stringify({
        ...payload,

        ...payload.body &&
        { body: screenPassword(payload.body, [ 'password', 'newPassword' ]) }
    }));
    const valid = validator(payload);

    if (! valid) {
        const { errors: [ error ]} = validator;

        logger.debug('failed:', JSON.stringify(error.message));
        const { keyword, params } = error;
        let message;

        if (keyword === 'required') {
            message = `Missing '${error.params.missingProperty}'`;
        } else if (keyword === 'minProperties') {
            message = `No data received`
        } else if (keyword === 'type') {
            message = `'${error.dataPath.split('.').pop()}' ${error.message}`
        } else if (keyword === 'minLength') {
            message = `'${error.dataPath.split('.').pop()}' is too short`
        } else if (keyword === 'additionalProperties') {
            message = `'${params.additionalProperty}' should not be in payload`
        } else if (keyword === 'format')  {
            message = `Wrong format for '${error.dataPath.split('.').pop()}'`
        } else if (keyword === 'pattern')  {
            message = `Requirements not met for '${error.dataPath.split('.').pop()}'`
        } else {
            logger.debug("couldn't format AJV error", keyword, error.dataPath);
            const prefix = error.dataPath ? `'${error.dataPath.replace('.', '')}'` : 'Request payload';
            const suffix = error.params.additionalProperty ? `: '${error.params.additionalProperty}'` : '';
            message = `${prefix} ${error.message}${suffix}`;
        }

        throw new httpErrors.BadRequest(message); // TODO consider stop *throwing* http errors. These are not actual errors!
    }

};