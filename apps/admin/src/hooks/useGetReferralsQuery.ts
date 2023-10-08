import { IV1GetReferralsResponseBody } from '@loyal-heart/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { API_URL } from '../constants'

export const GET_REFERRALS_QUERY_KEY = 'getReferrals'

export const useGetReferralsQuery = () => {
  return useQuery({
    queryKey: [GET_REFERRALS_QUERY_KEY],
    queryFn: async () => {
      const result = await axios.get<IV1GetReferralsResponseBody>(`${API_URL}/referral`)

      if (result.status !== 200 || result.data.status !== 'success') {
        throw new Error('Failed to get referrals')
      }
      return result.data.data
    },
  })
}
