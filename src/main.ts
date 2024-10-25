import { defineCommand } from 'citty'
import consola from 'consola'
import pkg from '../package.json' assert { type: 'json' }

export default defineCommand({
  meta: {
    name: 'nitrolux',
    version: pkg.version,
    description: pkg.description,
  },
  setup() {
    consola.info('Do some setup here')
  },
  cleanup() {
    consola.info('Do some cleanup here')
  },
  subCommands: {
    create: () => import('./cmds/create').then((r) => r.default),
  },
})
