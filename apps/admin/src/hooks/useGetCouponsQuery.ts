import { IV1GetCouponsResponseBody } from '@loyal-heart/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'

export const GET_COUPONS_QUERY_KEY = 'getCoupons'

export const useGetCouponsQuery = () => {
  return useQuery({
    queryKey: [GET_COUPONS_QUERY_KEY],
    queryFn: async () => {
      const result = await axios.get<IV1GetCouponsResponseBody>(`${API_URL}/coupon`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to get coupons')
      }
      return result.data.data
    },
  })
}
