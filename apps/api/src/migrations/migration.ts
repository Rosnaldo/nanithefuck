import { getMigrationDao } from '#daos/singleton';
import { RuntimeFiles } from '#utils/runtime_files';
import path from 'path';

export class Migration {
    public runScripts = async () => {
        const dir =  path.join(__dirname, 'scripts');
        const runtime = new RuntimeFiles();
        const scripts = runtime.get(dir, __filename);
        for await (const script of scripts) {
            const migration = await getMigrationDao().findOne(script);
            if (!migration) {
                const { migrate } = await import(`./scripts/${script}`);
                await migrate.run();
                await getMigrationDao().insert(script);
            }
        }
    };
}
