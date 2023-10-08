import { IV1CreateRewardResponseBody } from '@loyal-heart/types'
import express from 'express'
import { z } from 'zod'

import { RewardService, RewardServiceException, RewardValidationError } from '../../modules/reward'
import { IV1ErrorResponse } from '../../types'
import { BaseController } from '../common'

export class V1CreateRewardController extends BaseController {
  private rewardService: RewardService

  public constructor(rewardService: RewardService) {
    super('CREATE_REWARD_CONTROLLER')
    this.rewardService = rewardService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = V1CreateRewardRequestSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IV1ErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.rewardService.addReward(result.data.data)

      const response: IV1CreateRewardResponseBody = { status: 'success' }
      res.status(200).json(response)
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof RewardValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create reward validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof RewardServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IV1ErrorResponse = { message: 'create reward service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected create reward error: ${(err as Error).toString()}` })
        const response: IV1ErrorResponse = { message: 'unexpected create reward error' }
        res.status(500).json(response)
        return
      }
    }
  }
}

const V1CreateRewardRequestSchema = z.object({
  data: z.record(z.unknown()),
})
