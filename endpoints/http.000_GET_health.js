import { permissionNames } from '../dictionary/index.js';


export default async (kojo, logger) => {

    const { HTTP } = kojo.functions;

    HTTP.addRoute('GET /health', {

        permission: permissionNames.healthCheck

    }, async () => {
        logger.debug('check health');
        return 'ok';
    })
};