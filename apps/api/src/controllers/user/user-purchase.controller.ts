import { IV1UserPurchaseResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { UserService, UserServiceException, UserValidationError } from '../../modules/user'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1UserPurchaseController extends BaseController {
  private userService: UserService

  public constructor(userService: UserService) {
    super('USER_PURCHASE_CONTROLLER')
    this.userService = userService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1UserPurchaseRequestSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userService.userPurchase(result.data.data)

      const response: IV1UserPurchaseResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'user purchase validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'user purchase service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected user purchase error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected user purchase error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1UserPurchaseRequestSchema = z.object({
  data: z.record(z.unknown()),
})
