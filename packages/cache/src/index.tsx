import { logger } from '@loyal-heart/logger'
import { createClient } from 'redis'

const { REDIS_HOSTNAME, REDIS_PORT } = process.env

export const redis = createClient({ socket: { host: REDIS_HOSTNAME, port: Number(REDIS_PORT) } })

redis.connect()

redis.on('error', error => {
  logger.error(error)
})

redis.on('ready', () => {
  logger.info('Connected to redis')
})
