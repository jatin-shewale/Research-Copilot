import { useQuery } from '@tanstack/react-query'
import healthService from '../services/healthService'

export function useBackendHealth() {
  return useQuery({
    queryKey: ['backend-health'],
    queryFn: healthService.getBackendHealth,
    staleTime: 15_000,
    retry: 1,
    refetchInterval: 30_000,
  })
}

export default useBackendHealth
