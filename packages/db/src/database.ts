import { logger } from '@loyal-heart/logger'
import { promises as fs } from 'fs'
import {
  CamelCasePlugin,
  CompiledQuery,
  FileMigrationProvider,
  Kysely,
  Migrator,
  MysqlDialect,
  MysqlPool,
} from 'kysely'
import { createPool, PoolOptions } from 'mysql2'
import * as path from 'path'

import { DB } from './gen-types'

const createMysqlPool = (poolOptions: PoolOptions = {}): MysqlPool => {
  return createPool({
    database: process.env.MYSQL_DATABASE,
    host: process.env.RDS_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.RDS_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ...poolOptions,
  })
}

const createMysqlDialect = (pool: MysqlPool): MysqlDialect => {
  return new MysqlDialect({
    pool,
    async onCreateConnection(connection) {
      try {
        await connection.executeQuery(CompiledQuery.raw('SELECT VERSION()'))
        logger.debug('Db connection success')
      } catch (err) {
        logger.error('Db connection failed', err)
      }
    },
  })
}

export const initDb = (poolOptions: PoolOptions = {}): Kysely<DB> => {
  try {
    const pool = createMysqlPool(poolOptions)
    const dialect = createMysqlDialect(pool)
    return new Kysely<DB>({
      dialect,
      plugins: [new CamelCasePlugin()],
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : undefined,
    })
  } catch (err) {
    logger.error('Failed to initialize db', err)
    throw err
  }
}

export const migrateToLatest = async (db: Kysely<DB>) => {
  logger.debug('Running migrations')

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach(it => {
    if (it.status === 'Success') {
      logger.debug(`Migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      logger.error(`Failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    logger.error('Failed to migrate')
    logger.error(String(error))
    process.exit(1)
  }
  logger.debug('Migrations complete')
}
