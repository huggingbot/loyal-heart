import express from 'express'

import { V1CreateUserController } from '../controllers/user/create-user.controller'
import { V1DeleteUserController } from '../controllers/user/delete-user.controller'
import { V1GetUsersController } from '../controllers/user/get-users.controller'
import { V1UserPurchaseController } from '../controllers/user/user-purchase.controller'
import { UserService } from '../modules/user'

export const apiVersion = 'v1'
const userBaseRoute = `/${apiVersion}/user`

const userRoutes = express.Router()

const userService = new UserService()

userRoutes.get(`${userBaseRoute}`, (req, res, next) => {
  new V1GetUsersController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userRoutes.post(`${userBaseRoute}`, (req, res, next) => {
  new V1CreateUserController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userRoutes.delete(`${userBaseRoute}/:id`, (req, res, next) => {
  new V1DeleteUserController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userRoutes.post(`${userBaseRoute}/purchase`, (req, res, next) => {
  new V1UserPurchaseController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default userRoutes
