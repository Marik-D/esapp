import { build, BuildOptions, Plugin } from 'esbuild';
import { DevServer, DevServerConfig } from '.';

export interface DevBundlerConfig {
  entryPoints: string[] | Record<string, string>
  plugins: Plugin[]
  devServer: DevServerConfig,
  overrides?: BuildOptions
}

export function startDevBundler(config: DevBundlerConfig) {
  const devServer = new DevServer(config.devServer);
  const overrides = config?.overrides || {};

  build({
    entryPoints: config.entryPoints,
    outdir: '/',
    bundle: true,
    watch: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    incremental: true,
    plugins: [
      ...config.plugins,
      devServer.createPlugin(),
    ],
    metafile: true,
    loader: {
      '.jpg': 'file',
      '.png': 'file',
      '.svg': 'file',
    },
    ...overrides
  })

  // Increment port of in use.
  let port = config.devServer.port;
  let callback = (code: string) => {
    if (code === 'EADDRINUSE') {
      port++
      devServer.listen(port, callback)
    } else {
      throw Error(code)
    }
  }

  devServer.listen(port, callback)
}