import { IV1CreateReferralRequestBody, IV1CreateReferralResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_REFERRALS_QUERY_KEY } from './useGetReferralsQuery'

export const useCreateReferralMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1CreateReferralRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1CreateReferralResponseBody>(`${API_URL}/referral`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to create referral')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_REFERRALS_QUERY_KEY] })
    },
  })
}
