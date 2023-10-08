import { IV1CreatePartnerRequestBody, IV1GetPartnersResponseBody } from '@loyal-heart/types'
import argon2 from 'argon2'
import { SafeParseReturnType, z } from 'zod'

import { db } from '../../db'
import { BaseService } from '../common'
import { PartnerValidationError } from './errors'

export class PartnerService extends BaseService {
  constructor() {
    super('PARTNER_SERVICE')
  }

  public async getPartners(): Promise<IV1GetPartnersResponseBody['data']> {
    return await db.selectFrom('partner').select(['id', 'name', 'phoneNumber', 'email']).execute()
  }

  public async addPartner(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1CreatePartnerRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1PartnerDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new PartnerValidationError('invalid data', validationErrors)
    }
    const { password, ...rest } = result.data
    await db
      .insertInto('partner')
      .values({ ...rest, password: await argon2.hash(password) })
      .values(result.data)
      .execute()
  }

  public async deletePartner(id: number): Promise<void> {
    await db.deleteFrom('partner').where('id', '=', id).execute()
  }
}

const V1PartnerDataSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
})
