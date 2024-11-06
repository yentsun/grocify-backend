import http from 'http';


/**
 * Start listening to requests
 *
 * @return {Promise.<Object>} - node's httpServer
 */
export default async function listen() {

    const [ kojo, logger ] = this;
    const { trid, config: { http: { port }}} = kojo.state;
    const { HTTP } = kojo.functions;

    const serverId = trid.base();
    const server = http.createServer(HTTP.requestHandler);
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