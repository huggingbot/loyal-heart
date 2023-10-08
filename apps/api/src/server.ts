import { logger } from '@loyal-heart/logger'
import compression from 'compression'
import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'

import apiMiddlewareRouter from './middlewares/api.middleware'
import securityMiddlewareRouter from './middlewares/security.middleware'
import campaignRouter from './routers/campaign.routes'
import couponRouter from './routers/coupon.routes'
import debugRouter from './routers/debug.routes'
import partnerRouter from './routers/partner.routes'
import referralRouter from './routers/referral.routes'
import rewardRouter from './routers/reward.routes'
import userRouter from './routers/user.routes'
import userActionRouter from './routers/user-action.routes'

export const createServer = (): Express => {
  const app = express()
  app.use(compression())
  app.use(express.json())
  app.use(securityMiddlewareRouter)

  app.use(morgan('tiny', { stream: { write: message => logger.logHttp(message.trim()) } }))

  app.use(
    cors({
      origin: 'http://localhost:3010',
    }),
  )

  app.use('/api/debug', debugRouter)
  app.use('/api', apiMiddlewareRouter)
  app.use('/api', partnerRouter)
  app.use('/api', userRouter)
  app.use('/api', rewardRouter)
  app.use('/api', couponRouter)
  app.use('/api', userActionRouter)
  app.use('/api', campaignRouter)
  app.use('/api', referralRouter)

  return app
}
