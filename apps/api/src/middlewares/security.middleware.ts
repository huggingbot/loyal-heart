import express from 'express'
import helmet from 'helmet'

const securityMiddlewareRouter = express.Router()
securityMiddlewareRouter.use(helmet())

export default securityMiddlewareRouter
