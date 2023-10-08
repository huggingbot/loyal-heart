import { IV1GetUsersResponseBody } from '@loyal-heart/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'

export const GET_USERS_QUERY_KEY = 'getUsers'

export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: [GET_USERS_QUERY_KEY],
    queryFn: async () => {
      const result = await axios.get<IV1GetUsersResponseBody>(`${API_URL}/user`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to get users')
      }
      return result.data.data
    },
  })
}
