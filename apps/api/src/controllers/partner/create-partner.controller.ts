import { IV1CreatePartnerResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { PartnerService, PartnerServiceException } from '../../modules/partner'
import { PartnerValidationError } from '../../modules/partner/errors'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1CreatePartnerController extends BaseController {
  private partnerService: PartnerService

  public constructor(partnerService: PartnerService) {
    super('CREATE_PARTNER_CONTROLLER')
    this.partnerService = partnerService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1CreatePartnerRequestSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.partnerService.addPartner(result.data.data)

      const response: IV1CreatePartnerResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof PartnerValidationError) {
        this.logFailure(req, { message: err.message })
        const response: IV1ErrorResponse = { message: 'create partner validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof PartnerServiceException) {
        this.logFailure(req, { message: err.message })
        const response: IV1ErrorResponse = { message: 'create partner service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected create partner error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected create partner error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1CreatePartnerRequestSchema = z.object({
  data: z.record(z.unknown()),
})
