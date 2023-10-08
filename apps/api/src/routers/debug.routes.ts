import { getSgDateString } from '@loyal-heart/utils'
import express from 'express'

import { config } from '../config/api.config'

const debugRouter = express.Router()

debugRouter.get('/', (_, res) => {
  res.status(200).json({
    env: process.env.NODE_ENV,
    deployedDate: config.deployedDate,
    currentDateTime: getSgDateString(),
  })
})

export default debugRouter
