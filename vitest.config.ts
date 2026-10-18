import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['dotenv/config'],
    fileParallelism: false,
    coverage: {
      provider: 'v8',
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
})
