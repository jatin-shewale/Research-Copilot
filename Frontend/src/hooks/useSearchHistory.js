import { useQuery } from '@tanstack/react-query'
import searchService from '../services/searchService'

export function useSearchHistory() {
  return useQuery({
    queryKey: ['search-history'],
    queryFn: searchService.getSearchHistory,
    staleTime: 30_000,
    retry: 1,
  })
}

export default useSearchHistory
