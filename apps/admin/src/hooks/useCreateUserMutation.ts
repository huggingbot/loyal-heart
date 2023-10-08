import { IV1CreateUserRequestBody, IV1CreateUserResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_USERS_QUERY_KEY } from './useGetUsersQuery'

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1CreateUserRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1CreateUserResponseBody>(`${API_URL}/user`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to create user')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USERS_QUERY_KEY] })
    },
  })
}
