import { IV1GetCouponsResponseBody } from '@loyal-heart/types'
import express from 'express'

import { CouponService, CouponServiceException, CouponValidationError } from '../../modules/coupon'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1GetCouponsController extends BaseController {
  private couponService: CouponService

  public constructor(couponService: CouponService) {
    super('GET_COUPONS_CONTROLLER')
    this.couponService = couponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.couponService.getCoupons()

      const response: IV1GetCouponsResponseBody = { status: 'success', data: result }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof CouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get coupons validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof CouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get coupons service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get coupons error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected get coupons error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
