import { IV1CreateCampaignRequestBody, IV1CreateCampaignResponseBody } from '@loyal-heart/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'
import { GET_CAMPAIGNS_QUERY_KEY } from './useGetCampaignsQuery'

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IV1CreateCampaignRequestBody) => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const result = await axios.post<IV1CreateCampaignResponseBody>(`${API_URL}/campaign`, data, config)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to create campaign')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CAMPAIGNS_QUERY_KEY] })
    },
  })
}
