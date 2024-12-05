import URL from 'url';
import errors from 'http-errors';


const { MethodNotAllowed, NotFound } = errors;

/**
 * Route the request to the appropriate handler based on method and URL.
 *
 * @param {string} method - The HTTP method (e.g., 'GET' or 'POST').
 * @param {string} url - The URL to route the request to.
 * @throws {NotFound} - If the pathname is not found in the routes.
 * @throws {MethodNotAllowed} - If the method is not allowed for the specified pathname.
 * @return {Object} - An object containing query, key, and route information based on the method and URL.
 */
export default function router(method, url) {

    const [ kojo, logger ] = this;

    const { pathname, query } = URL.parse(url, true);
    const [ , major, key ] = pathname.split('/');
    const pathnamePattern = '/' + [ major, key ? ':key' : undefined ].filter(Boolean).join('/');
    const routePattern = `${method} ${pathnamePattern}`;
    const { routes } = kojo.state;
    logger.debug('🧭', routePattern);

    // 404 pathname not found
    if (! routes[pathnamePattern]) {
        throw new NotFound('Pathname not found');
    }

    // 405 method not found (thus not allowed)
    if (routes[pathnamePattern] && ! routes[pathnamePattern][method]) {
        throw new MethodNotAllowed('Not allowed: ' + method);
    }

    return { query, key, ...routes[pathnamePattern][method] };
};
