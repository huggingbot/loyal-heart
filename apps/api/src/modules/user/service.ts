import { IV1CreateUserRequestBody, IV1GetUsersResponseBody, IV1UserPurchaseRequestBody } from '@loyal-heart/types'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql'
import { SafeParseReturnType, z } from 'zod'

import { db } from '../../db'
import { BaseService } from '../common'
import { UserValidationError } from './errors'

export class UserService extends BaseService {
  constructor() {
    super('USER_SERVICE')
  }

  public async getUsers(): Promise<IV1GetUsersResponseBody['data']> {
    return await db
      .selectFrom('user')
      .select(['id', 'partnerId', 'name', 'dateOfBirth', 'phoneNumber', 'email'])
      .execute()
  }

  public async addUser(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1CreateUserRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1UserDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async trx => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { referrerPhone, ...rest } = result.data
      const user = await trx.insertInto('user').values(rest).executeTakeFirstOrThrow()

      if (result.data.referrerPhone) {
        const referrer = await trx
          .selectFrom('user')
          .select(['id'])
          .where('phoneNumber', '=', result.data.referrerPhone)
          .executeTakeFirstOrThrow()

        const referredRegisterUserActionName = 'register_referred_discount_percent_earned'
        const campaign = await trx
          .selectFrom('campaign')
          .leftJoin('userAction', 'userAction.id', 'campaign.userActionId')
          .leftJoin('coupon', 'coupon.id', 'campaign.couponId')
          .select(['coupon.id as couponId'])
          .where('campaign.partnerId', '=', result.data.partnerId)
          .where('userAction.name', '=', referredRegisterUserActionName)
          .where(eb =>
            eb.or([
              eb('coupon.usageCount', 'is', null),
              eb('coupon.maxUsage', 'is', null),
              eb('coupon.usageCount', '<', eb.ref('coupon.usageCount')),
            ]),
          )
          .where(eb =>
            eb.or([
              eb('coupon.validFrom', 'is', null),
              eb('coupon.validTo', 'is', null),
              eb('coupon.validFrom', '<', new Date()),
              eb('coupon.validTo', '>', new Date()),
            ]),
          )
          .executeTakeFirst()

        let couponIds = {} as { referredCouponId: number }
        if (campaign && campaign.couponId) {
          couponIds = { referredCouponId: campaign.couponId }
        }

        await trx
          .insertInto('referral')
          .values({
            referrerId: referrer.id,
            referredId: Number(user.insertId?.toString()),
            ...couponIds,
          })
          .execute()
      }
    })
  }

  public async deleteUser(id: number): Promise<void> {
    await db.deleteFrom('user').where('id', '=', id).execute()
  }

  public async userPurchase(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1UserPurchaseRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1UserPurchaseDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async trx => {
      const referral = await trx
        .selectFrom('referral')
        .select(({ selectFrom }) => [
          jsonArrayFrom(
            selectFrom('referral')
              .select(['id', 'referrerId', 'referrerCouponId'])
              .where('referrerId', '=', result.data.userId)
              .where('referrerCouponId', '=', result.data.couponId)
              .where('referrerCouponUsageDate', 'is', null),
          ).as('referrer'),
          jsonObjectFrom(
            selectFrom('referral')
              .select(['id', 'referredId', 'referredCouponId'])
              .where('referredId', '=', result.data.userId)
              .where('referredCouponId', '=', result.data.couponId)
              .where('referredCouponUsageDate', 'is', null),
          ).as('referred'),
        ])
        .executeTakeFirst()

      if (!referral) {
        throw new UserValidationError('invalid referral')
      }

      const { referrer: referrers, referred } = referral
      if (!referrers.length && !referred) {
        throw new UserValidationError('invalid referrer and referred')
      }

      const isReferrerPurchase = referrers.length && referrers[0].referrerId === result.data.userId
      let rowId = 0
      let userId = 0
      let couponId = 0
      if (isReferrerPurchase && referrers.length && referrers[0].referrerCouponId) {
        rowId = referrers[0].id
        userId = referrers[0].referrerId
        couponId = referrers[0].referrerCouponId
      } else if (!isReferrerPurchase && referred && referred.referredCouponId) {
        rowId = referred.id
        userId = referred.referredId
        couponId = referred.referredCouponId
      }
      if (!rowId) {
        throw new UserValidationError('invalid referral row id')
      }
      if (!userId) {
        throw new UserValidationError('invalid referral user id')
      }
      if (!couponId) {
        throw new UserValidationError('invalid referral coupon id')
      }

      const user = await trx
        .selectFrom('user')
        .select(['id', 'partnerId'])
        .where('id', '=', userId)
        .executeTakeFirstOrThrow()

      const referralPurchaseUserActionName = 'purchase_referral_discount_percent_earned'

      const campaign = await trx
        .selectFrom('campaign')
        .leftJoin('userAction', 'userAction.id', 'campaign.userActionId')
        .leftJoin('coupon', 'coupon.id', 'campaign.couponId')
        .select(['coupon.id as couponId'])
        .where('campaign.partnerId', '=', user.partnerId)
        .where('userAction.name', '=', referralPurchaseUserActionName)
        .where(eb =>
          eb.or([
            eb('coupon.usageCount', 'is', null),
            eb('coupon.maxUsage', 'is', null),
            eb('coupon.usageCount', '<', eb.ref('coupon.usageCount')),
          ]),
        )
        .where(eb =>
          eb.or([
            eb('coupon.validFrom', 'is', null),
            eb('coupon.validTo', 'is', null),
            eb('coupon.validFrom', '<', new Date()),
            eb('coupon.validTo', '>', new Date()),
          ]),
        )
        .executeTakeFirstOrThrow()

      const updateObj = isReferrerPurchase
        ? { referrerCouponUsageDate: new Date() }
        : { referredCouponUsageDate: new Date(), referrerCouponId: campaign.couponId }
      await trx.updateTable('referral').set(updateObj).where('id', '=', rowId).executeTakeFirstOrThrow()
    })
  }
}

const V1UserDataSchema = z
  .object({
    partnerId: z.number(),
    name: z.string(),
    dateOfBirth: z.coerce.date().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    referrerPhone: z.string().optional(),
  })
  .refine(data => data.phoneNumber || data.email, {
    message: 'either phone_number or email must be provided',
    path: ['phone_number', 'email'],
  })

const V1UserPurchaseDataSchema = z.object({
  userId: z.number(),
  couponId: z.number(),
})
