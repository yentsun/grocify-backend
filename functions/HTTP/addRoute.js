import AJV from 'ajv';


/**
 * Adds a new route with the specified pattern, route configuration, and handler function.
 *
 * @param {string} pattern - The pattern for the route in the format 'METHOD /pathname'.
 * @param {Object} routeConfig - The configuration object for the route containing permission and schema information.
 * @param {Function} handler - The handler function to be executed when the route is accessed.
 *
 * @return {void}
 */
export default function addRoute(pattern, routeConfig, handler) {

    const [ kojo, logger ] = this;
    const { ajv } = kojo.state;

    logger.debug(pattern, routeConfig);
    const { permission, schema } = routeConfig;
    const [ method, pathnamePattern ] = pattern.split(' ');

    let validator;
    const required = [];

    if ([ 'POST', 'PUT' ].includes(method))
        required.push('body');

    // This belongs to HTTP.validate, but since we can benefit from pre-compiled validator
    // we are doing it in route configuration
    if (schema) {
        const { query, body, key } = schema;

        if (key)
            required.push('key');

        const combinedSchema = {
            title: 'Incoming data combined',
            type: 'object',
            properties: {

                ...key && {
                key },

                ...query && {
                query },

                ...body && {
                body }
            },
            additionalProperties: false,
            required,
            minProperties: [ query, body, key ].filter(p => p && (p.required || p.minItems)).length
        };
        validator = ajv.compile(combinedSchema);
    }

    const { routes } = kojo.state;

    if (! routes[pathnamePattern])
        routes[pathnamePattern] = {};

    routes[pathnamePattern][method] = { handler, permission, validator };
};
