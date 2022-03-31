import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function pathResolve() {
  return resolve(__dirname, '.', ...arguments)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.json', '.js', '.ts', '.vue'],
    alias: {
      '@': pathResolve('src')
    }
  },
  plugins: [
    vue({
      template:{
        compilerOptions:{
          //isCustomElement: tag => tag.startsWith('easy'),
          isCustomElement: tag => tag === 'easy-player'
       }
      }
    }),
    {
      name: "isolation",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          next();
        });
      },
    },
  ]
})
