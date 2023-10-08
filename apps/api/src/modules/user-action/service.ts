import { IV1CreateUserActionRequestBody, IV1GetUserActionsResponseBody } from '@loyal-heart/types'
import { SafeParseReturnType, z } from 'zod'

import { db } from '../../db'
import { BaseService } from '../common'
import { UserActionValidationError } from './errors'

export class UserActionService extends BaseService {
  constructor() {
    super('USER_ACTION_SERVICE')
  }

  public async getUserActions(): Promise<IV1GetUserActionsResponseBody['data']> {
    return await db.selectFrom('userAction').select(['id', 'name', 'category']).execute()
  }

  public async addUserAction(data: Record<string, unknown>): Promise<void> {
    type RequestBody = IV1CreateUserActionRequestBody['data']
    const result: SafeParseReturnType<RequestBody, RequestBody> = V1UserActionDataSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserActionValidationError('invalid data', validationErrors)
    }
    await db.insertInto('userAction').values(result.data).execute()
  }

  public async deleteUserAction(id: number): Promise<void> {
    await db.deleteFrom('userAction').where('id', '=', id).execute()
  }
}

const V1UserActionDataSchema = z.object({
  name: z.string(),
  category: z.enum([
    'points_earned',
    'points_spent',
    'discount_percent_earned',
    'discount_percent_spent',
    'discount_value_earned',
    'discount_value_spent',
  ]),
})
