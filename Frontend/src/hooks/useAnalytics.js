import { useQuery } from '@tanstack/react-query'
import analyticsService from '../services/analyticsService'

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalytics,
    staleTime: 60_000,
    retry: 1,
  })
}

export default useAnalytics
