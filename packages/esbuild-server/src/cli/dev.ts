//
// Copyright 2022 DXOS.org
//

import chalk from 'chalk';
import { CommandModule } from 'yargs';

import { loadConfig, validateConfigForApp, DEFAULT_CONFIG_FILE } from '../config';
import { startDevBundler } from '../server';

interface DevCommandArgv {
  port: number
  config: string
  verbose: boolean
}

export const devCommand: CommandModule<{}, DevCommandArgv> = {
  command: 'dev', // TODO(burdon): Rename server?
  describe: 'Starts the dev server.',
  builder: yargs => yargs
    .option('port', {
      alias: 'p',
      type: 'number',
      default: 8080
    })
    .option('config', {
      type: 'string',
      default: DEFAULT_CONFIG_FILE
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      default: false
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);
    if (!config) {
      throw new Error('Config not found.');
    }

    console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);

    validateConfigForApp(config);

    startDevBundler({
      entryPoints: config.entryPoints!,
      plugins: config.plugins ?? [],
      devServer: {
        port: argv.port,
        staticDir: config.staticDir,
        logRequests: argv.verbose
      },
      overrides: config.overrides
    });
  }
};
