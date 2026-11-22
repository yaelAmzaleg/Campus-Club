import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Tests (Vitest) - you don't need to change this part
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.jsx'],
    setupFiles: ['./tests/setup.js'],
    reporters: ['./tests/reporter.js'],
    css: {
      // CSS Modules keep their real class names in the tests (styles.selected -> "selected")
      include: /\.module\.css$/,
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
})
