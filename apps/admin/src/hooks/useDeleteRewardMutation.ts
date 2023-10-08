import { IV1DeleteRewardResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_REWARDS_QUERY_KEY } from './useGetRewardsQuery'

export const useDeleteRewardMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await axios.delete<IV1DeleteRewardResponseBody>(`${API_URL}/reward/${id}`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to delete reward')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_REWARDS_QUERY_KEY] })
    },
  })
}
