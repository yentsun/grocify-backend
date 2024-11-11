import * as path from 'node:path';
import PgMigrate  from '@urbica/pg-migrate';


async function migrate() {

    const pgMigrate = new PgMigrate({
        migrationsDir: path.join(process.cwd(), 'migrations')
    });

    await pgMigrate.connect();
    await pgMigrate.migrate();
    await pgMigrate.end();
}

migrate().catch(error => { throw error });
