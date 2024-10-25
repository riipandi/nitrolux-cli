import { runMain as _runMain, defineCommand } from 'citty'

const main = defineCommand({
  meta: {
    name: 'nitrolux',
    version: '0.0.1',
    description: 'Nitrolux Command Line Interface',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Application name',
      valueHint: 'my-app',
      required: true,
    },
    verbose: {
      type: 'boolean',
      description: 'Use friendly greeting',
      alias: 'F',
    },
  },
  run({ args }) {
    console.info(`${args.friendly ? 'Howdy,' : 'Creating application:'} ${args.name}\n`)
  },
})

const runMain = () => _runMain(main)

export { runMain }
