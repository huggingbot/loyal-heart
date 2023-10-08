import { IV1DeleteUserActionResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_USER_ACTIONS_QUERY_KEY } from './useGetUserActionsQuery'

export const useDeleteUserActionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await axios.delete<IV1DeleteUserActionResponseBody>(`${API_URL}/user-action/${id}`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to delete user action')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USER_ACTIONS_QUERY_KEY] })
    },
  })
}
