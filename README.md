# ESBuild Server

A fast dev-server and storybook built with esbuild.

<img src="https://img.shields.io/npm/v/@dxos/esbuild-server"/>

## Getting started

To run the dev server with the examples:

```bash
yarn build

cd examples
../bin/main.js dev 
```

To run the storybook within the examples:

```bash
cd examples
../bin/main.js book stories/*.stories.tsx
```

## CLI reference

Run `esbuild-server --help` or `esbuild-server <command> --help` for an always up-to-date CLI reference.

### Running apps and storybooks

```
esbuild-server <command>

Commands:
  esbuild-server build              Build the app for production.
  esbuild-server dev                Start the dev server.
  esbuild-server book [stories...]  Start the dev server with a book of components.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### Building storybooks

```
esbuild-server book --build [stories...]
```

## Config file

Config is automatically loaded from `./esbuild-server.config.js`.

```typescript
export interface Config {
  /**
   * List of entry points to bundle.
   *
   * Those are then can be requested from the dev server.
   *
   * Read more: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: string[] | Record<string, string>

  /**
   * Directory to output production build to.
   */
  outdir?: string

  /**
   * Override esapp default settings for esbuild
   */
  overrides?: BuildOptions

  /**
   * Directory with static files to be served by the dev server.
   */
  staticDir?: string

  /**
   * Esbuild plugins: https://esbuild.github.io/plugins/.
   */
  plugins?: Plugin[]
}
```

## Storybook

esbuild-server stories are compatible with storybook format, although only the very minimal features are supported.

To render a storybook run the following command (replacing with your glob for stories).

```
esbuild-server book 'stories/**/*.stories.tsx'
```

Each story file should export a set of components and optionally a default export with the title that will be displayed in the outline.

## Development

Use `yarn link` and `yarn build --watch` to use the development build of this project from another package.

## Polyfills

Currently esbuild-server does not polyfill any of the node.js modules or globals. 
If your code is using them you'd need to manually include a plugin to add them.
