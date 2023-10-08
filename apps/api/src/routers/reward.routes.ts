import express from 'express'

import { V1CreateRewardController } from '../controllers/reward/create-reward.controller'
import { V1DeleteRewardController } from '../controllers/reward/delete-reward.controller'
import { V1GetRewardsController } from '../controllers/reward/get-rewards.controller'
import { RewardService } from '../modules/reward'

export const apiVersion = 'v1'
const rewardBaseRoute = `/${apiVersion}/reward`

const rewardRoutes = express.Router()

const rewardService = new RewardService()

rewardRoutes.get(`${rewardBaseRoute}`, (req, res, next) => {
  new V1GetRewardsController(rewardService).handleRequest(req, res).catch((err: unknown) => next(err))
})

rewardRoutes.post(`${rewardBaseRoute}`, (req, res, next) => {
  new V1CreateRewardController(rewardService).handleRequest(req, res).catch((err: unknown) => next(err))
})

rewardRoutes.delete(`${rewardBaseRoute}/:id`, (req, res, next) => {
  new V1DeleteRewardController(rewardService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default rewardRoutes
