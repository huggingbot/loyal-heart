import { DBSelect } from '@loyal-heart/db'

// Partner
export interface IV1CreatePartnerRequestBody {
  data: {
    name: string
    phoneNumber?: string
    email: string
    password: string
  }
}

export interface IV1CreatePartnerResponseBody {
  status: 'success' | 'failure'
}

export interface IV1GetPartnersResponseBody {
  status: 'success' | 'failure'
  data: Pick<DBSelect['partner'], 'id' | 'name' | 'phoneNumber' | 'email'>[]
}

export interface IV1DeletePartnerResponseBody {
  status: 'success' | 'failure'
}

// User
export interface IV1CreateUserRequestBody {
  data: {
    partnerId: number
    name: string
    dateOfBirth?: Date
    phoneNumber?: string
    email?: string
    referrerPhone?: string
  }
}

export interface IV1CreateUserResponseBody {
  status: 'success' | 'failure'
}

export interface IV1GetUsersResponseBody {
  status: 'success' | 'failure'
  data: Pick<DBSelect['user'], 'id' | 'partnerId' | 'name' | 'dateOfBirth' | 'phoneNumber' | 'email'>[]
}

export interface IV1DeleteUserResponseBody {
  status: 'success' | 'failure'
}

export interface IV1UserPurchaseRequestBody {
  data: {
    userId: number
    couponId: number
  }
}

export interface IV1UserPurchaseResponseBody {
  status: 'success' | 'failure'
}

// Reward
export interface IV1CreateRewardRequestBody {
  data: {
    name: string
    type: 'points' | 'discount_percent' | 'discount_value'
    value: number
  }
}

export interface IV1CreateRewardResponseBody {
  status: 'success' | 'failure'
}

export interface IV1GetRewardsResponseBody {
  status: 'success' | 'failure'
  data: Pick<DBSelect['reward'], 'id' | 'name' | 'type' | 'value'>[]
}

export interface IV1DeleteRewardResponseBody {
  status: 'success' | 'failure'
}

// Coupon
export interface IV1CreateCouponRequestBody {
  data: {
    code: string
    rewardId: number
    partnerId?: number
    userId?: number
    usageCount?: number
    maxUsage?: number
    validFrom?: Date
    validTo?: Date
  }
}

export interface IV1CreateCouponResponseBody {
  status: 'success' | 'failure'
}

export interface IV1GetCouponsResponseBody {
  status: 'success' | 'failure'
  data: Pick<
    DBSelect['coupon'],
    'id' | 'code' | 'rewardId' | 'partnerId' | 'userId' | 'usageCount' | 'maxUsage' | 'validFrom' | 'validTo'
  >[]
}

export interface IV1DeleteCouponResponseBody {
  status: 'success' | 'failure'
}

// Campaign
export interface IV1CreateCampaignRequestBody {
  data: {
    partnerId: number
    userActionId: number
    couponId: number
  }
}

export interface IV1CreateCampaignResponseBody {
  status: 'success' | 'failure'
}

export interface IV1GetCampaignsResponseBody {
  status: 'success' | 'failure'
  data: Pick<DBSelect['campaign'], 'id' | 'partnerId' | 'userActionId' | 'couponId'>[]
}

export interface IV1DeleteCampaignResponseBody {
  status: 'success' | 'failure'
}

// Referral
export interface IV1CreateReferralRequestBody {
  data: {
    referrerId: number
    referredId: number
    referrerCouponId?: number
    referredCouponId?: number
    referrerCouponUsageDate?: Date
    referredCouponUsageDate?: Date
  }
}

export interface IV1CreateReferralResponseBody {
  status: 'success' | 'failure'
}

export interface IV1GetReferralsResponseBody {
  status: 'success' | 'failure'
  data: Pick<
    DBSelect['referral'],
    | 'id'
    | 'referrerId'
    | 'referredId'
    | 'referrerCouponId'
    | 'referredCouponId'
    | 'referrerCouponUsageDate'
    | 'referredCouponUsageDate'
  >[]
}

export interface IV1DeleteReferralResponseBody {
  status: 'success' | 'failure'
}

// User action
export interface IV1CreateUserActionRequestBody {
  data: {
    name: string
    category:
      | 'points_earned'
      | 'points_spent'
      | 'discount_percent_earned'
      | 'discount_percent_spent'
      | 'discount_value_earned'
      | 'discount_value_spent'
  }
}

export interface IV1CreateUserActionResponseBody {
  status: 'success' | 'failure'
}

export interface IV1GetUserActionsResponseBody {
  status: 'success' | 'failure'
  data: Pick<DBSelect['userAction'], 'id' | 'name' | 'category'>[]
}

export interface IV1DeleteUserActionResponseBody {
  status: 'success' | 'failure'
}
