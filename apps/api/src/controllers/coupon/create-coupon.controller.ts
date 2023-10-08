import { IV1CreateCouponResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { CouponService, CouponServiceException, CouponValidationError } from '../../modules/coupon'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1CreateCouponController extends BaseController {
  private couponService: CouponService

  public constructor(couponService: CouponService) {
    super('CREATE_COUPON_CONTROLLER')
    this.couponService = couponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1CreateCouponRequestSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.couponService.addCoupon(result.data.data)

      const response: IV1CreateCouponResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof CouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create coupon validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof CouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create coupon service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected create coupon error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected create coupon error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1CreateCouponRequestSchema = z.object({
  data: z.record(z.unknown()),
})
