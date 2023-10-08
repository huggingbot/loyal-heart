import { IV1DeleteCampaignResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { CampaignService, CampaignServiceException, CampaignValidationError } from '../../modules/campaign'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1DeleteCampaignController extends BaseController {
  private campaignService: CampaignService

  public constructor(campaignService: CampaignService) {
    super('DELETE_CAMPAIGN_CONTROLLER')
    this.campaignService = campaignService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1DeleteCampaignRequestSchema.safeParse(req.params)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.campaignService.deleteCampaign(result.data.id)

      const response: IV1DeleteCampaignResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof CampaignValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete campaign validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof CampaignServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete campaign service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected delete campaign error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected delete campaign error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1DeleteCampaignRequestSchema = z.object({
  id: z.coerce.number(),
})
