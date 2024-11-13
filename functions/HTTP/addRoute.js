import AJV from 'ajv';


/**
 * Register endpoint handler. It also compiles AJV's validation function as
 * 'validator'.
 *
 * @param {object} routeConfig - endpoint config object
 * @param {string} routeConfig.method - HTTP method
 * @param {string} routeConfig.pathname - HTTP pathname
 * @param {object} routeConfig.schema - AJV validation schema
 * @param {string} routeConfig.access - ACL access record ([principal, action, resource])
 * @param {function} handler - the handler function
 * @return {undefined}
 */
export default function addRoute(routeConfig, handler) {

    const [ kojo, logger ] = this;
    logger.debug(routeConfig);
    const { method, pathname, access, schema } = routeConfig;
    let validator;

    if (schema) {
        const { query, body } = schema;
        const combinedSchema = {
            title: 'Incoming data combined',
            type: 'object',
            properties: {
                ...query && { query },
                ...body && { body }
            },
            additionalProperties: false,
            minProperties: [ query, body ].filter(p => p && (p.required || p.minItems)).length
        };
        validator = (new AJV({ verbose: true, coerceTypes: true, $data: true, strict: false })).compile(combinedSchema);
    }

    const { routes } = kojo.state;

    if (! routes[pathname])
        routes[pathname] = {};

    routes[pathname][method] = { handler, access, ...validator && { validator } };
};
