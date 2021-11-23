import chalk from 'chalk';
import { CommandModule } from 'yargs';

import { startDevBundler } from '../dev-bundler';
import { loadConfig } from '../load-config';
import { DEFAFULT_CONFIG_FILE } from '../config';

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
      throw new Error('Config not found')
    }

    if (!config.entryPoints) {
      throw new Error('At least one entrypoint must be specified')
    }

    startDevBundler({
      entryPoints: config?.entryPoints,
      plugins: config?.plugins ?? [],
      devServer: {
        port: argv.port,
        staticDir: config?.staticDir,
        logRequests: argv.verbose
      },
      overrides: config?.overrides
    })
  }
}