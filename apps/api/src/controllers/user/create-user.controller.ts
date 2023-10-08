import { IV1CreateUserResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { UserService, UserServiceException, UserValidationError } from '../../modules/user'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1CreateUserController extends BaseController {
  private userService: UserService

  public constructor(userService: UserService) {
    super('CREATE_USER_CONTROLLER')
    this.userService = userService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1CreateUserRequestSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userService.addUser(result.data.data)

      const response: IV1CreateUserResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create user validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create user service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected create user error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected create user error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1CreateUserRequestSchema = z.object({
  data: z.record(z.unknown()),
})
