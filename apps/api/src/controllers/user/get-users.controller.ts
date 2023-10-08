import { IV1GetUsersResponseBody } from '@loyal-heart/types'
import express from 'express'

import { UserService, UserServiceException, UserValidationError } from '../../modules/user'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1GetUsersController extends BaseController {
  private userService: UserService

  public constructor(userService: UserService) {
    super('GET_USERS_CONTROLLER')
    this.userService = userService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.userService.getUsers()

      const response: IV1GetUsersResponseBody = { status: 'success', data: result }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get users validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get users service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get users error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected get users error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
