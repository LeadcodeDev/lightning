import { join } from 'node:path'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(process.cwd(), 'app', 'manager', 'resources', '**/*.{edge,js,ts}')
  ],
  theme: {
    extend: {

    },
  },
  plugins: [],
}

