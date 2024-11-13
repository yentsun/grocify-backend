export default async (kojo, logger) => {

    const { HTTP } = kojo.functions;

    HTTP.addRoute({

        method: 'GET',
        pathname: '/status'

    }, async () => {
        logger.debug('returning status');
        return 'ok';
    })
};