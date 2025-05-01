import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginVueJsx } from '@rsbuild/plugin-vue-jsx'


export default defineConfig({
  output: {
    assetPrefix: './',
  },
  plugins: [
    pluginVue(),
    pluginLess(),
    pluginSass(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginVueJsx(),
  ],
  html: {
    title: '爱排课 AIpick',
    favicon: './src/assets/logo.png',
    meta: {
      description: '爱排课 AIpick',
    },
  },
})
