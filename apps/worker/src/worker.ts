import { initDb } from '@loyal-heart/db'
import { logger } from '@loyal-heart/logger'

export const run = async (): Promise<void> => {
  logger.info('Worker is running')
  const db = initDb({ connectionLimit: 1 })
  const partners = await db.selectFrom('partner').selectAll().execute()
  await db.destroy()
  logger.info(`Partners: ${JSON.stringify(partners)}`)
}
