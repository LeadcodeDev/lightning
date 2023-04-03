import { join } from 'node:path'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(process.cwd(), 'apps', 'manager', 'resources', '**/*.{edge,js,ts}'),
    join(process.cwd(), 'apps', 'web', 'resources', '**/*.{edge,js,ts}')
  ],
  theme: {
    extend: {

    },
  },
  plugins: [],
}

