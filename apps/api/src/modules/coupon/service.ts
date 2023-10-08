import { IV1CreateCouponRequestBody, IV1GetCouponsResponseBody } from '@loyal-heart/types'
import { SafeParseReturnType, z } from 'zod'

import { db } from '../../db'
import { BaseService } from '../common'
import { CouponValidationError } from './errors'

export class CouponService extends BaseService {
  constructor() {
    super('COUPON_SERVICE')
  }

  public async getCoupons(): Promise<IV1GetCouponsResponseBody['data']> {
    return await db
      .selectFrom('coupon')
      .select(['id', 'code', 'rewardId', 'partnerId', 'userId', 'usageCount', 'maxUsage', 'validFrom', 'validTo'])
      .execute()
  }

  public async addCoupon(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1CreateCouponRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1CouponDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new CouponValidationError('invalid data', validationErrors)
    }
    await db.insertInto('coupon').values(result.data).execute()
  }

  public async deleteCoupon(id: number): Promise<void> {
    await db.deleteFrom('coupon').where('id', '=', id).execute()
  }
}

const V1CouponDataSchema = z.object({
  code: z.string(),
  rewardId: z.number(),
  partnerId: z.number().optional(),
  userId: z.number().optional(),
  usageCount: z.number().optional(),
  maxUsage: z.number().optional(),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
})
