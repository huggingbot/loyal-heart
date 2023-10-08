import express from 'express'

import { V1CreateReferralController } from '../controllers/referral/create-referral.controller'
import { V1DeleteReferralController } from '../controllers/referral/delete-referral.controller'
import { V1GetReferralsController } from '../controllers/referral/get-referrals.controller'
import { ReferralService } from '../modules/referral'

export const apiVersion = 'v1'
const referralBaseRoute = `/${apiVersion}/referral`

const referralRoutes = express.Router()

const referralService = new ReferralService()

referralRoutes.get(`${referralBaseRoute}`, (req, res, next) => {
  new V1GetReferralsController(referralService).handleRequest(req, res).catch((err: unknown) => next(err))
})

referralRoutes.post(`${referralBaseRoute}`, (req, res, next) => {
  new V1CreateReferralController(referralService).handleRequest(req, res).catch((err: unknown) => next(err))
})

referralRoutes.delete(`${referralBaseRoute}/:id`, (req, res, next) => {
  new V1DeleteReferralController(referralService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default referralRoutes
