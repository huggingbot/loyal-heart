import { IV1DeleteCouponResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { CouponService, CouponServiceException, CouponValidationError } from '../../modules/coupon'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1DeleteCouponController extends BaseController {
  private couponService: CouponService

  public constructor(couponService: CouponService) {
    super('DELETE_COUPON_CONTROLLER')
    this.couponService = couponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1DeleteCouponRequestSchema.safeParse(req.params)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.couponService.deleteCoupon(result.data.id)

      const response: IV1DeleteCouponResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof CouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete coupon validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof CouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'delete coupon service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected delete coupon error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected delete coupon error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1DeleteCouponRequestSchema = z.object({
  id: z.coerce.number(),
})
