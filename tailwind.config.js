import { join } from 'node:path'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(process.cwd(), 'resources', '**/*.{edge,ts,js}'),
    join(process.cwd(), 'apps', 'manager', 'resources', '**/*.{edge,js,ts}'),
    join(process.cwd(), 'apps', 'web', 'resources', '**/*.{edge,js,ts}')
  ],
  theme: {
    colors: {
      ...colors,
      primary: colors.indigo,
      secondary: colors.slate
    }
  },
  plugins: [],
}

