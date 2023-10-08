import { IV1GetReferralsResponseBody } from '@loyal-heart/types'
import express from 'express'

import { ReferralService, ReferralServiceException, ReferralValidationError } from '../../modules/referral'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1GetReferralsController extends BaseController {
  private referralService: ReferralService

  public constructor(referralService: ReferralService) {
    super('GET_REFERRALS_CONTROLLER')
    this.referralService = referralService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.referralService.getReferrals()

      const response: IV1GetReferralsResponseBody = { status: 'success', data: result }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof ReferralValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get referrals validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof ReferralServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get referrals service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get referrals error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected get referrals error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
