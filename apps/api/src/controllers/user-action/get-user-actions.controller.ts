import { IV1GetUserActionsResponseBody } from '@loyal-heart/types'
import express from 'express'

import { UserActionService, UserActionServiceException, UserActionValidationError } from '../../modules/user-action'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1GetUserActionsController extends BaseController {
  private userActionService: UserActionService

  public constructor(userActionService: UserActionService) {
    super('GET_USER_ACTIONS_CONTROLLER')
    this.userActionService = userActionService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.userActionService.getUserActions()

      const response: IV1GetUserActionsResponseBody = { status: 'success', data: result }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserActionValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get user actions validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserActionServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get user actions service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get user actions error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected get user actions error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
