import { redis } from '@loyal-heart/cache'
import { migrateToLatest } from '@loyal-heart/db'
import { logger } from '@loyal-heart/logger'
import axios from 'axios'

import { appConfig } from './config/app.config'
import { db } from './db'
import { createServer } from './server'

const main = async () => {
  if (process.env.NODE_ENV === 'development') {
    logger.logHttp('Running in development mode')

    await migrateToLatest(db)

    // Test redis connection
    // TODO: Remove this
    const value = await redis.get('myKey')
    console.log('value', value)

    setInterval(async () => {
      // Simulate invoking lambda function via a cronjob
      axios.post('http://worker:3030/api/run')
    }, 10 * 1000 /* 10 seconds */)
  }

  const server = createServer()
  server.listen(appConfig.expressConfig.port)

  logger.logHttp(`Node Version: ${process.version}`)
  logger.logHttp(`NODE_ENV: ${process.env.NODE_ENV ?? ''}`)
  logger.logHttp(`Running express server on port ${appConfig.expressConfig.port}`)
}

main()
