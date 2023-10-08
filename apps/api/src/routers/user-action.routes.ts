import express from 'express'

import { V1CreateUserActionController } from '../controllers/user-action/create-user-action.controller'
import { V1DeleteUserActionController } from '../controllers/user-action/delete-user-action.controller'
import { V1GetUserActionsController } from '../controllers/user-action/get-user-actions.controller'
import { UserActionService } from '../modules/user-action'

export const apiVersion = 'v1'
const userActionBaseRoute = `/${apiVersion}/user-action`

const userActionRoutes = express.Router()

const userActionService = new UserActionService()

userActionRoutes.get(`${userActionBaseRoute}`, (req, res, next) => {
  new V1GetUserActionsController(userActionService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userActionRoutes.post(`${userActionBaseRoute}`, (req, res, next) => {
  new V1CreateUserActionController(userActionService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userActionRoutes.delete(`${userActionBaseRoute}/:id`, (req, res, next) => {
  new V1DeleteUserActionController(userActionService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default userActionRoutes
