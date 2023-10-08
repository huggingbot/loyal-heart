import { IV1DeletePartnerResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { PartnerService, PartnerServiceException, PartnerValidationError } from '../../modules/partner'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1DeletePartnerController extends BaseController {
  private partnerService: PartnerService

  public constructor(partnerService: PartnerService) {
    super('DELETE_PARTNER_CONTROLLER')
    this.partnerService = partnerService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1DeletePartnerRequestSchema.safeParse(req.params)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.partnerService.deletePartner(result.data.id)

      const response: IV1DeletePartnerResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof PartnerValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete partner validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof PartnerServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete partner service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected delete partner error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected delete partner error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1DeletePartnerRequestSchema = z.object({
  id: z.coerce.number(),
})
