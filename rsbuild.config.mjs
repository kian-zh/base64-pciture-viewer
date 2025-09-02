import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './public/index.html',
    title: 'Base64 图片预览器',
    favicon: './public/favicon.ico',
  },
  output: {
    distPath: {
      root: 'dist',
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/base64-picture-viewer/' : '/',
  },
  source: {
    entry: {
      index: './src/index.js',
    },
  },
  dev: {
    port: 3000,
  },
});
