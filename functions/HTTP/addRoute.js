import AJV from 'ajv';


/**
 * Add a route with the specified configuration and handler to the application's routes.
 *
 * @param {Object} routeConfig - Configuration object for the new route.
 * @param {string} routeConfig.method - HTTP method for the route (e.g., GET, POST).
 * @param {string} routeConfig.pathname - URI path for the route.
 * @param {string} routeConfig.permission - Permission required to access the route.
 * @param {Object} routeConfig.schema - Schema object defining the expected request data structure.
 * @param {Object} handler - Function to handle the request for the route.
 *
 * @return {void}
 */
export default function addRoute(routeConfig, handler) {

    const [ kojo, logger ] = this;
    logger.debug(routeConfig);
    const { method, pathname, permission, schema } = routeConfig;
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

    routes[pathname][method] = { handler, permission, validator };
};
