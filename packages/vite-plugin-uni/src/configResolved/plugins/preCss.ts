import debug from 'debug'
import { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import { preJs } from '@dcloudio/uni-cli-shared'

import { UniPluginFilterOptions } from '.'

const debugPre = debug('vite:uni:pre-css')
const debugPreTry = debug('vite:uni:pre-css-try')
const cssLangs = `\\.(less|sass|scss|styl|stylus|postcss)($|\\?)`
const cssLangRE = new RegExp(cssLangs)
/**
 * preprocess css
 * @param options
 */
export function uniPreCssPlugin(options: UniPluginFilterOptions): Plugin {
  const filter = createFilter(options.include, options.exclude)
  return {
    name: 'vite:uni-pre-css',
    transform(code, id) {
      if (!filter(id)) {
        return code
      }
      if (!cssLangRE.test(id)) {
        return
      }
      debugPreTry(id)
      if (!code.includes('#endif')) {
        return
      }
      debugPre(id)
      return preJs(code)
    },
  }
}