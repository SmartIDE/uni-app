import { Plugin, ResolvedConfig } from 'vite'
import { formatMsg, checkUpdate, isWindows } from '@dcloudio/uni-cli-shared'
import { VitePluginUniResolvedOptions } from '..'

import { initEnv } from './env'
import { initOptions } from './options'
import { initPlugins } from './plugins'
import { customResolver } from '../config/resolve'

export function createConfigResolved(options: VitePluginUniResolvedOptions) {
  return ((config) => {
    initEnv(config)
    initLogger(config)
    initOptions(options, config)
    initPlugins(config, options)
    initCheckUpdate()
    if (isWindows) {
      // TODO 等 https://github.com/vitejs/vite/issues/3331 修复后，可以移除下列代码
      const item = config.resolve.alias.find((item) =>
        typeof item.find !== 'string' ? item.find.test('@/') : false
      )
      if (item) {
        item.customResolver = customResolver
      }
    }
  }) as Plugin['configResolved']
}

function initCheckUpdate() {
  const pkg = require('@dcloudio/vite-plugin-uni/package.json')
  checkUpdate({
    inputDir: process.env.UNI_INPUT_DIR,
    compilerVersion:
      (pkg['uni-app'] && pkg['uni-app']['compilerVersion']) || '',
    versionType: pkg.version.includes('alpha') ? 'a' : 'r',
  })
}

function initLogger({ logger }: ResolvedConfig) {
  const { error } = logger
  logger.error = (msg, opts) => {
    return error(formatMsg(msg), opts)
  }
}