import { IV1GetCampaignsResponseBody } from '@loyal-heart/types'
import express from 'express'

import { CampaignService, CampaignServiceException, CampaignValidationError } from '../../modules/campaign'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1GetCampaignsController extends BaseController {
  private campaignService: CampaignService

  public constructor(campaignService: CampaignService) {
    super('GET_CAMPAIGNS_CONTROLLER')
    this.campaignService = campaignService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.campaignService.getCampaigns()

      const response: IV1GetCampaignsResponseBody = { status: 'success', data: result }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof CampaignValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get campaigns validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof CampaignServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get campaigns service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get campaigns error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected get campaigns error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
