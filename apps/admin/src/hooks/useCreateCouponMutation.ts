import { IV1CreateCouponRequestBody, IV1CreateCouponResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_COUPONS_QUERY_KEY } from './useGetCouponsQuery'

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1CreateCouponRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1CreateCouponResponseBody>(`${API_URL}/coupon`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to create coupon')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_COUPONS_QUERY_KEY] })
    },
  })
}
