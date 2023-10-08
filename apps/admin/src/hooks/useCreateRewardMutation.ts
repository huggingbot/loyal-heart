import { IV1CreateRewardRequestBody, IV1CreateRewardResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_REWARDS_QUERY_KEY } from './useGetRewardsQuery'

export const useCreateRewardMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1CreateRewardRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1CreateRewardResponseBody>(`${API_URL}/reward`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to create reward')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_REWARDS_QUERY_KEY] })
    },
  })
}
