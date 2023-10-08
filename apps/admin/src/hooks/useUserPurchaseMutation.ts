import { IV1UserPurchaseRequestBody, IV1UserPurchaseResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_REFERRALS_QUERY_KEY } from './useGetReferralsQuery'

export const useUserPurchaseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1UserPurchaseRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1UserPurchaseResponseBody>(`${API_URL}/user/purchase`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to mutate user purchase')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_REFERRALS_QUERY_KEY] })
    },
  })
}
