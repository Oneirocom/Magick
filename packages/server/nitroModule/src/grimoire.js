#!/usr/bin/env node
import { execSync } from 'child_process'
import { Command } from 'commander'
import { resolve, dirname } from 'path'
import { createRequire } from 'module'
import dotenv from 'dotenv'

// Load environment variables from .env file if it exists
dotenv.config()

const require = createRequire(import.meta.url)

const program = new Command()

function initializePrismaSchema() {
  try {
    // Dynamically resolve the path to the @magickml/server-db package
    const serverDbPath = dirname(
      require.resolve('@magickml/server-db/package.json')
    )
    const schemaPath = resolve(
      serverDbPath,
      'src',
      'lib',
      'prisma',
      'schema.prisma'
    )

    // Construct and execute the db push command
    const command = `npx prisma db push --schema=${schemaPath}`
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(), // Use the current working directory
    })

    console.log('Database schema successfully synchronized with Prisma schema')
  } catch (error) {
    console.error('Error pushing schema changes:', error.message)
    throw error
  }
}

function generatePrismaClient() {
  try {
    // Dynamically resolve the path to the @magickml/server-db package
    const serverDbPath = dirname(
      require.resolve('@magickml/server-db/package.json')
    )
    const schemaPath = resolve(
      serverDbPath,
      'src',
      'lib',
      'prisma',
      'schema.prisma'
    )

    // Construct and execute the generate command
    const command = `npx prisma generate --schema=${schemaPath}`
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(), // Use the current working directory
    })

    console.log('Prisma client generated successfully')
  } catch (error) {
    console.error('Error generating Prisma client:', error.message)
    throw error
  }
}

program
  .command('init')
  .description(
    'Push Prisma schema changes to the database for node_modules/@magickml/server-db'
  )
  .action(() => {
    try {
      console.log('Initializing Grimoire...')

      console.log('Initializing Prisma schema...')
      initializePrismaSchema()

      console.log('Generating Prisma client...')
      generatePrismaClient()
    } catch (error) {
      console.error('Error pushing schema changes:', error.message)
    }
  })

program.parse(process.argv)
