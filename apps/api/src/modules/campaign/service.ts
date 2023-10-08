import { IV1CreateCampaignRequestBody, IV1GetCampaignsResponseBody } from '@loyal-heart/types'
import { SafeParseReturnType, z } from 'zod'

import { db } from '../../db'
import { BaseService } from '../common'
import { CampaignValidationError } from './errors'

export class CampaignService extends BaseService {
  constructor() {
    super('CAMPAIGN_SERVICE')
  }

  public async getCampaigns(): Promise<IV1GetCampaignsResponseBody['data']> {
    return await db.selectFrom('campaign').select(['id', 'partnerId', 'userActionId', 'couponId']).execute()
  }

  public async addCampaign(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1CreateCampaignRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1CampaignDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new CampaignValidationError('invalid data', validationErrors)
    }
    await db.insertInto('campaign').values(result.data).execute()
  }

  public async deleteCampaign(id: number): Promise<void> {
    await db.deleteFrom('campaign').where('id', '=', id).execute()
  }
}

const V1CampaignDataSchema = z.object({
  partnerId: z.number(),
  userActionId: z.number(),
  couponId: z.number(),
})
