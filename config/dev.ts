import type { UserConfigExport } from "@tarojs/cli";
export default {
   logger: {
    quiet: false,
    stats: true
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://wycode.cn',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
} satisfies UserConfigExport<'webpack5'>
