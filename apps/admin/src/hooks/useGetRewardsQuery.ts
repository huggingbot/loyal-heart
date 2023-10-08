import { IV1GetRewardsResponseBody } from '@loyal-heart/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'

export const GET_REWARDS_QUERY_KEY = 'getRewards'

export const useGetRewardsQuery = () => {
  return useQuery({
    queryKey: [GET_REWARDS_QUERY_KEY],
    queryFn: async () => {
      const result = await axios.get<IV1GetRewardsResponseBody>(`${API_URL}/reward`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to get rewards')
      }
      return result.data.data
    },
  })
}
