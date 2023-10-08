import { IV1DeleteReferralResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_REFERRALS_QUERY_KEY } from './useGetReferralsQuery'

export const useDeleteReferralMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await axios.delete<IV1DeleteReferralResponseBody>(`${API_URL}/referral/${id}`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to delete referral')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_REFERRALS_QUERY_KEY] })
    },
  })
}
