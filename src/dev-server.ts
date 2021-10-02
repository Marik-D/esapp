import { BuildResult, Plugin } from "esbuild";
import { readFile } from "fs/promises";
import { join } from "path/posix";
import { Trigger } from "./trigger";
import http from 'http'

export interface ResolvedFile {
  path: string
  contents: Uint8Array
}

export interface DevServerConfig {
  port: number,
  staticDir?: string,
  logRequests?: boolean
}

export class DevServer {
  private buildTrigger = new Trigger<BuildResult>();

  constructor(
    readonly config: DevServerConfig
  ) {}

  createPlugin(): Plugin {
    return {
      name: 'esapp-serve',
      setup: ({ onStart, onEnd }) => {
        let startTime: number = 0;
        onStart(() => {
          console.log(`Build started`)
          startTime = Date.now()

          this.buildTrigger.reset();
        })
  
        onEnd((result) => {
          console.log(`Build ended in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`)
  
          this.buildTrigger.wake(result);
        })
      }
    }
  }

  private async resolveFile(url: string): Promise<ResolvedFile | undefined> {
    const buildResult = await this.buildTrigger.wait()
    
    const output = buildResult.outputFiles?.find(file => file.path === url)
    if(output) {
      return {
        path: output.path,
        contents: output.contents,
      }
    }

    if(this.config.staticDir) {
      try {
        const path = join(this.config.staticDir, url)
        const contents = await readFile(path)

        return {
            path,
            contents,
        }
      } catch {}
    }

    if(url === '/') {
      return this.resolveFile('index.html')
    }

    return undefined
  }

  listen() {
    http.createServer(async (req, res) => {
      const start = Date.now()

      this.config.logRequests && console.log(`=> ${req.method} ${req.url} ${req.headers['accept']}`)

      const respondWithFile = (file: ResolvedFile) => {
        this.config.logRequests && console.log(`<= 200 ${file.path} (${file.contents.length} bytes) ${Date.now() - start}ms`)

        res.writeHead(200)
        res.write(file?.contents)
        res.end()
      }

      const file = await this.resolveFile(req.url!)
      if(file) {
        respondWithFile(file)
        return
      }

      const indexFile = await this.resolveFile('/')
      if(indexFile) {
        respondWithFile(indexFile)
        return
      }

      this.config.logRequests && console.log(`<= 404`)

      res.writeHead(404, 'Not found')
      res.end()
    }).listen(this.config.port)
  }
}
