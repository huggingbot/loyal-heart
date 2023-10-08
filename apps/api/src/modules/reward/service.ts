import { IV1CreateRewardRequestBody, IV1GetRewardsResponseBody } from '@loyal-heart/types'
import { SafeParseReturnType, z } from 'zod'

import { db } from '../../db'
import { BaseService } from '../common'
import { RewardValidationError } from './errors'

export class RewardService extends BaseService {
  constructor() {
    super('REWARD_SERVICE')
  }

  public async getRewards(): Promise<IV1GetRewardsResponseBody['data']> {
    return await db.selectFrom('reward').select(['id', 'name', 'type', 'value']).execute()
  }

  public async addReward(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1CreateRewardRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1RewardDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new RewardValidationError('invalid data', validationErrors)
    }
    await db.insertInto('reward').values(result.data).execute()
  }

  public async deleteReward(id: number): Promise<void> {
    await db.deleteFrom('reward').where('id', '=', id).execute()
  }
}

const V1RewardDataSchema = z.object({
  name: z.string(),
  type: z.enum(['points', 'discount_percent', 'discount_value']),
  value: z.number(),
})
