import { IV1CreateUserActionRequestBody, IV1CreateUserActionResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_USER_ACTIONS_QUERY_KEY } from './useGetUserActionsQuery'

export const useCreateUserActionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1CreateUserActionRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1CreateUserActionResponseBody>(`${API_URL}/user-action`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to create user action')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USER_ACTIONS_QUERY_KEY] })
    },
  })
}
