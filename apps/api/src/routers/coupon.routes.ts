import express from 'express'

import { V1CreateCouponController } from '../controllers/coupon/create-coupon.controller'
import { V1DeleteCouponController } from '../controllers/coupon/delete-coupon.controller'
import { V1GetCouponsController } from '../controllers/coupon/get-coupons.controller'
import { CouponService } from '../modules/coupon'

export const apiVersion = 'v1'
const couponBaseRoute = `/${apiVersion}/coupon`

const couponRoutes = express.Router()

const couponService = new CouponService()

couponRoutes.get(`${couponBaseRoute}`, (req, res, next) => {
  new V1GetCouponsController(couponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

couponRoutes.post(`${couponBaseRoute}`, (req, res, next) => {
  new V1CreateCouponController(couponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

couponRoutes.delete(`${couponBaseRoute}/:id`, (req, res, next) => {
  new V1DeleteCouponController(couponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default couponRoutes
