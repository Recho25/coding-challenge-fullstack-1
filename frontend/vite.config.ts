import {defineConfig} from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [viteCommonjs(), react(), reactRefresh()],
  server: {
    open: true,
  },
  optimizeDeps: {
    include: ['@react-navigation/native'],
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.web.js', '.js', '.ts'],
      plugins: [esbuildCommonjs(['@react-navigation/elements'])],
    },
  },
  resolve: {
    extensions: ['.web.tsx', '.web.jsx', '.web.js', '.tsx', '.ts', '.js'],
    alias: {
      'react-native': 'react-native-web',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
