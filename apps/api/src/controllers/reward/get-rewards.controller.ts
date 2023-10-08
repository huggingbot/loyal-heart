import { IV1GetRewardsResponseBody } from '@loyal-heart/types'
import express from 'express'

import { RewardService, RewardServiceException, RewardValidationError } from '../../modules/reward'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1GetRewardsController extends BaseController {
  private rewardService: RewardService

  public constructor(rewardService: RewardService) {
    super('GET_REWARDS_CONTROLLER')
    this.rewardService = rewardService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.rewardService.getRewards()

      const response: IV1GetRewardsResponseBody = { status: 'success', data: result }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof RewardValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get rewards validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof RewardServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'get rewards service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get rewards error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected get rewards error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
