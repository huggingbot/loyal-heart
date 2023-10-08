import { IV1DeleteUserResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_USERS_QUERY_KEY } from './useGetUsersQuery'

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await axios.delete<IV1DeleteUserResponseBody>(`${API_URL}/user/${id}`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to delete user')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USERS_QUERY_KEY] })
    },
  })
}
