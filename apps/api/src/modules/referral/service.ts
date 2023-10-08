import { IV1CreateReferralRequestBody, IV1GetReferralsResponseBody } from '@loyal-heart/types'
import { SafeParseReturnType, z } from 'zod'

import { db } from '../../db'
import { BaseService } from '../common'
import { ReferralValidationError } from './errors'

export class ReferralService extends BaseService {
  constructor() {
    super('REFERRAL_SERVICE')
  }

  public async getReferrals(): Promise<IV1GetReferralsResponseBody['data']> {
    return await db
      .selectFrom('referral')
      .select([
        'id',
        'referrerId',
        'referredId',
        'referrerCouponId',
        'referredCouponId',
        'referrerCouponUsageDate',
        'referredCouponUsageDate',
      ])
      .execute()
  }

  public async addReferral(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1CreateReferralRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1ReferralDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new ReferralValidationError('invalid data', validationErrors)
    }
    await db.insertInto('referral').values(result.data).execute()
  }

  public async deleteReferral(id: number): Promise<void> {
    await db.deleteFrom('referral').where('id', '=', id).execute()
  }
}

const V1ReferralDataSchema = z.object({
  referrerId: z.number(),
  referredId: z.number(),
  referrerCouponId: z.number().optional(),
  referredCouponId: z.number().optional(),
  referrerCouponUsageDate: z.coerce.date().optional(),
  referredCouponUsageDate: z.coerce.date().optional(),
})
