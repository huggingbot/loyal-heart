import { IV1DeleteUserActionResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { UserActionService, UserActionServiceException, UserActionValidationError } from '../../modules/user-action'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1DeleteUserActionController extends BaseController {
  private userActionService: UserActionService

  public constructor(userActionService: UserActionService) {
    super('DELETE_USER_ACTION_CONTROLLER')
    this.userActionService = userActionService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1DeleteUserActionRequestSchema.safeParse(req.params)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userActionService.deleteUserAction(result.data.id)

      const response: IV1DeleteUserActionResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserActionValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete userAction validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserActionServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete userAction service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected delete userAction error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected delete userAction error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1DeleteUserActionRequestSchema = z.object({
  id: z.coerce.number(),
})
