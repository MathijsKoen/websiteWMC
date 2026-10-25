import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    '.netlify/**',
    'next-env.d.ts',
    // Oude site en designbestanden, geen onderdeel van de app
    'HuidigeSiteWMC/**',
    'stitchWMC/**',
    'print/**',
  ]),
])
