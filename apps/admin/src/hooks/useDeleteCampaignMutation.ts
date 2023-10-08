import { IV1DeleteCampaignResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_CAMPAIGNS_QUERY_KEY } from './useGetCampaignsQuery'

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await axios.delete<IV1DeleteCampaignResponseBody>(`${API_URL}/campaign/${id}`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to delete campaign')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CAMPAIGNS_QUERY_KEY] })
    },
  })
}
