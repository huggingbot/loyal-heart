import { IV1GetUserActionsResponseBody } from '@loyal-heart/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'

export const GET_USER_ACTIONS_QUERY_KEY = 'getUserActions'

export const useGetUserActionsQuery = () => {
  return useQuery({
    queryKey: [GET_USER_ACTIONS_QUERY_KEY],
    queryFn: async () => {
      const result = await axios.get<IV1GetUserActionsResponseBody>(`${API_URL}/user-action`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to get user actions')
      }
      return result.data.data
    },
  })
}
