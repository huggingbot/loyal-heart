import { IV1CreateUserActionResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { UserActionService, UserActionServiceException, UserActionValidationError } from '../../modules/user-action'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1CreateUserActionController extends BaseController {
  private userActionService: UserActionService

  public constructor(userActionService: UserActionService) {
    super('CREATE_USER_ACTION_CONTROLLER')
    this.userActionService = userActionService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1CreateUserActionRequestSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userActionService.addUserAction(result.data.data)

      const response: IV1CreateUserActionResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserActionValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create user action validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserActionServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create user action service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected create user action error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected create user action error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1CreateUserActionRequestSchema = z.object({
  data: z.record(z.unknown()),
})
