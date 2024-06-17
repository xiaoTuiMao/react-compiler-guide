import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// const ReactCompilerConfig = {
//   sources: (filename: string) => {
//     return filename.indexOf('src/components') !== -1;
//   },
// };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ babel: { plugins: ["babel-plugin-react-compiler"] }})],
  // plugins: [react({ babel: { plugins: ["babel-plugin-react-compiler", ReactCompilerConfig] }})],
  server: {
    hmr: false
  },
  esbuild: {
    sourcemap: false,  // 禁用 JavaScript 的 sourcemap，Vite 使用 esbuild 处理 JS
  }
})
