/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: [
      'tests/**/*.{test,spec}.ts'
    ],
    exclude: [
      '**/build/**',
      '**/.{idea,git,cache,output,temp}/**'
    ],
    watch: true
  }
})