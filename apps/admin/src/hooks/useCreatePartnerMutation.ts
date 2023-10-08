import { IV1CreatePartnerRequestBody, IV1CreatePartnerResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_PARTNERS_QUERY_KEY } from './useGetPartnersQuery'

export const useCreatePartnerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1CreatePartnerRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1CreatePartnerResponseBody>(`${API_URL}/partner`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to create partner')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_PARTNERS_QUERY_KEY] })
    },
  })
}
