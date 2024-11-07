import * as path from 'node:path';
import configLoader from 'yt-config';
import Kojo from 'kojo';
import TRID from 'trid';


export async function boot() {

    console.log('> load config');
    const config = await configLoader(path.join(process.cwd(), 'config.ini'));

    console.log('> init Kojo');
    const kojo = new Kojo(config.kojo);
    kojo.set('config', config);
    kojo.set('handlers', {});

    console.log('> init trid');
    kojo.set('trid', new TRID({ prefix: kojo.id, length: 4 }));

    console.log('> wait for ready');
    await kojo.ready();

    const { HTTP } = kojo.functions;
    kojo.set('httpServer', await HTTP.listen());

    return kojo;
}
