import { defineCommand, showUsage } from 'citty'
import pkg from '../package.json' assert { type: 'json' }

export default defineCommand({
  meta: {
    name: 'nitrolux',
    version: pkg.version,
    description: pkg.description,
  },
  args: {
    help: {
      type: 'boolean',
      description: 'Print information about the application',
      default: false,
    },
  },
  subCommands: {
    create: () => import('./cmds/create').then((r) => r.default),
    version: () => import('./cmds/version').then((r) => r.default),
  },
  async run({ args, cmd }) {
    // Show help page if --help flag is used or no subcommand provided
    if (args.help || args._.length === 0) {
      showUsage(cmd)
      return
    }
  },
})
