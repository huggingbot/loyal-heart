import { logger } from '@loyal-heart/logger'
import express from 'express'

import { run } from './worker'

if (process.env.NODE_ENV === 'development') {
  logger.logHttp('Running worker in development mode')

  const app = express()

  app.get('/api/debug', (_, res) => {
    res.status(200).json({ message: 'Hello from the worker!' })
  })

  app.post('/api/run', (_, res) => {
    run()
    res.status(200).json({ message: 'Started worker' })
  })

  const port = process.env.PORT || 3030
  app.listen(port)

  logger.logHttp(`Running worker on port ${port}`)
}

export default run
