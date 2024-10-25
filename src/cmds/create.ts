import { defineCommand } from 'citty'
import consola from 'consola'
import { downloadTemplate } from 'giget'
import { makeDirectory } from 'make-dir'
import { resolve } from 'pathe'
import { checkDirectoryExists } from '../utils'

export default defineCommand({
  meta: {
    name: 'create',
    description: 'Create a new Nitro application',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Application name (lowercase, separated by dashes)',
      valueHint: 'nitro-app',
      required: true,
    },
    template: {
      type: 'string',
      description: 'Template to use for the application',
      default: 'nitro-basic',
      required: false,
      alias: 't',
    },
    baseDir: {
      type: 'string',
      description: 'Base directory to create the application in',
      required: false,
      alias: 'd',
    },
    force: {
      type: 'boolean',
      description: 'Force overwrite existing application directory',
      default: false,
      alias: 'f',
    },
    install: {
      type: 'boolean',
      description: 'Install  dependencies after creating the application',
      default: false,
      alias: 'i',
    },
    silent: {
      type: 'boolean',
      description: 'Suppress all output (including errors)',
      default: false,
      alias: 's',
    },
    dryRun: {
      type: 'boolean',
      description: 'Dry run the command without creating anything',
    },
    verbose: {
      type: 'boolean',
      description: 'Output more detailed debugging information',
      default: false,
      alias: 'V',
    },
    help: {
      type: 'boolean',
      description: 'Print information about the command',
      default: false,
    },
  },
  async setup({ args }) {
    const { template, silent } = args
    try {
      if (!silent) {
        consola.info(`Fetching and validating template '${template}'`)
      }

      const templateExists = await checkDirectoryExists('nitroluxjs', 'templates', template)

      if (templateExists) {
        if (!silent) {
          consola.success(`Template '${template}' exists and available for use`)
        }
      } else {
        if (!silent) {
          consola.warn(`Template '${template}' not found in the template repository`)
        }
        process.exit(1)
      }
    } catch (error: unknown) {
      if (!silent) {
        consola.error(error instanceof Error ? error.message : 'Unknown error occurred')
      }
      process.exit(1)
    }
  },
  cleanup() {
    consola.info('Do some cleanup here')
  },
  async run({ args }) {
    const { name, baseDir, force, silent, dryRun, install, template } = args

    try {
      // Early exit for dry run
      if (dryRun) {
        consola.info('Dry run mode - no changes will be made')
        return
      }

      // Create target directory if args.baseDir is provided
      if (baseDir) {
        await makeDirectory(resolve('.tmp')).catch((err) => {
          throw new Error(`Failed to create target directory: ${err.message}`)
        })
      }

      // Construct target directory path
      const basePath = baseDir ? `${baseDir}/${name}` : name
      const targetDir = resolve(basePath)

      if (!silent) {
        consola.info(`Installing dependencies...`)
      }

      const templateUrl = `github:nitroluxjs/templates/${template}`
      const { source, dir } = await downloadTemplate(templateUrl, {
        dir: targetDir,
        cwd: targetDir,
        forceClean: force,
        install,
        silent,
      })

      // Log success messages
      if (!silent) {
        consola.info(`Template source: ${source}`)
        consola.info(`Output directory: ${dir}`)
        consola.success(`Application "${name}" has been created at ${targetDir}`)
      }
    } catch (error) {
      if (!silent) {
        consola.error(error instanceof Error ? error.message : 'Unknown error occurred')
      }
      process.exit(1)
    }
  },
})
