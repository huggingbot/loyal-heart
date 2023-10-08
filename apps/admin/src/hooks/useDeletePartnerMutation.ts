import { IV1DeletePartnerResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_PARTNERS_QUERY_KEY } from './useGetPartnersQuery'

export const useDeletePartnerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await axios.delete<IV1DeletePartnerResponseBody>(`${API_URL}/partner/${id}`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to delete partner')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_PARTNERS_QUERY_KEY] })
    },
  })
}
