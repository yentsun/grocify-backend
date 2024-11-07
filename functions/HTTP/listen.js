import http from 'http';


/**
 * Start an HTTP server and listen on the specified port.
 *
 * @async
 * @function listen
 * @returns {Promise<http.Server>} A Promise that resolves to the HTTP server instance once it starts listening on the specified port.
 */
export default async function listen() {

    const [ kojo, logger ] = this;
    const { trid, config: { http: { port }}} = kojo.state;
    const { HTTP } = kojo.functions;

    const serverId = trid.base();
    const server = http.createServer(HTTP.requestMiddleware);
    server.on('close', () => {
        logger.info(`[${serverId}] closed`);
    });

    return new Promise(resolve => {
        server.listen(port, () => {
            logger.info(`[${serverId}] listening on port ${port}`);
            resolve(server);
        });
    });
};