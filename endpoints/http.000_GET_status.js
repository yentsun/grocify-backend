export default async (gate, logger) => {

    const { HTTP } = gate.functions;

    HTTP.addRoute({

        method: 'GET',
        pathname: '/status'

    }, async () => {
        logger.debug('returning status');
        return 'ok';
    })
};