import { IV1GetPartnersResponseBody } from '@loyal-heart/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'

export const GET_PARTNERS_QUERY_KEY = 'getPartners'

export const useGetPartnersQuery = () => {
  return useQuery({
    queryKey: [GET_PARTNERS_QUERY_KEY],
    queryFn: async () => {
      const result = await axios.get<IV1GetPartnersResponseBody>(`${API_URL}/partner`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to get partners')
      }
      return result.data.data
    },
  })
}
