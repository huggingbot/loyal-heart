import { IV1DeleteCouponResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_COUPONS_QUERY_KEY } from './useGetCouponsQuery'

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await axios.delete<IV1DeleteCouponResponseBody>(`${API_URL}/coupon/${id}`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to delete coupon')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_COUPONS_QUERY_KEY] })
    },
  })
}
