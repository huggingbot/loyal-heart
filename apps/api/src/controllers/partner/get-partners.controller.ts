import { IV1GetPartnersResponseBody } from '@loyal-heart/types'
import express from 'express'

import { PartnerService, PartnerServiceException } from '../../modules/partner'
import { PartnerValidationError } from '../../modules/partner/errors'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1GetPartnersController extends BaseController {
  private partnerService: PartnerService

  public constructor(partnerService: PartnerService) {
    super('GET_PARTNERS_CONTROLLER')
    this.partnerService = partnerService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.partnerService.getPartners()

      const response: IV1GetPartnersResponseBody = { status: 'success', data: result }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof PartnerValidationError) {
        this.logFailure(req, { message: err.message })
        const response: IV1ErrorResponse = { message: 'get partners validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof PartnerServiceException) {
        this.logFailure(req, { message: err.message })
        const response: IV1ErrorResponse = { message: 'get partners service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get partners error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected get partners error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
