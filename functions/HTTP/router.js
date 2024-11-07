import URL from 'url';
import errors from 'http-errors';


const { MethodNotAllowed, NotFound } = errors;

/**
 * Routes incoming requests based on the specified method and URL.
 *
 * @param {string} method - The HTTP method of the request (e.g., 'GET', 'POST').
 * @param {string} url - The URL for the request.
 * @throws {NotFound} If the specified pathname is not found in the routes.
 * @throws {MethodNotAllowed} If the specified method is not allowed for the route.
 * @return {Object} An object containing information about the matching route and its associated details.
 */
export default function router(method, url) {

    const [ kojo, logger ] = this;

    // routing
    const { pathname, query } = URL.parse(url, true);
    const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');
    const [ major, resourceId, minor ] = trimmedPath.split('/');
    const routePattern = '/' + [major, resourceId ? ':id' : undefined, minor].filter(p => p).join('/');
    const { routes } = kojo.state;
    logger.debug('🧭 lookup route', { method, major, resourceId, minor }, 'in', Object.keys(routes).length, 'routes');

    // 404 pathname not found
    if (! routes[routePattern]) {
        throw new NotFound('Pathname not found');
    }

    // 405 method not found (thus not allowed)
    if (routes[routePattern] && ! routes[routePattern][method]) {
        throw new MethodNotAllowed('Not allowed: ' + method);
    }

    return { major, resourceId, minor, query, ...routes[routePattern][method] };
};
