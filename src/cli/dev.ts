import chalk from 'chalk';
import { CommandModule } from 'yargs';
import { validateConfigForApp } from '../config';

import { DEFAFULT_CONFIG_FILE } from '../config';
import { startDevBundler } from '../dev-bundler';
import { loadConfig } from '../load-config';

interface DevCommandArgv {
  port: number
  config: string
  verbose: boolean
}

export const devCommand: CommandModule<{}, DevCommandArgv> = {
  command: 'dev',
  describe: 'start the dev server',
  builder: yargs => yargs
    .option('port', {
      alias: 'p',
      type: 'number',
      default: 8080,
    })
    .option('config', {
      type: 'string',
      default: DEFAFULT_CONFIG_FILE,
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      default: false,
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);
    if (config) {
      console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
    } else {
      throw new Error('Config not found.');
    }

    validateConfigForApp(config);

    startDevBundler({
      entryPoints: config?.entryPoints!,
      plugins: config?.plugins ?? [],
      devServer: {
        port: argv.port,
        staticDir: config?.staticDir,
        logRequests: argv.verbose
      },
      overrides: config?.overrides
    });
  }
}
