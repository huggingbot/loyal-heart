import { IV1DeleteReferralResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { ReferralService, ReferralServiceException, ReferralValidationError } from '../../modules/referral'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1DeleteReferralController extends BaseController {
  private referralService: ReferralService

  public constructor(referralService: ReferralService) {
    super('DELETE_REFERRAL_CONTROLLER')
    this.referralService = referralService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1DeleteReferralRequestSchema.safeParse(req.params)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.referralService.deleteReferral(result.data.id)

      const response: IV1DeleteReferralResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof ReferralValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete referral validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof ReferralServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete referral service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected delete referral error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected delete referral error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1DeleteReferralRequestSchema = z.object({
  id: z.coerce.number(),
})
