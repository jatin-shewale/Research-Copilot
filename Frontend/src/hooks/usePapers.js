import { useQuery } from '@tanstack/react-query'
import papersService from '../services/papersService'

export function usePapers({ skip = 0, limit = 24, search = '' } = {}) {
  return useQuery({
    queryKey: ['papers', skip, limit, search],
    queryFn: () => papersService.listPapers({ skip, limit, search }),
    keepPreviousData: true,
    retry: 1,
  })
}

export function usePaper(paperId) {
  return useQuery({
    queryKey: ['paper', paperId],
    queryFn: () => papersService.getPaperById(paperId),
    enabled: Boolean(paperId),
    retry: 1,
  })
}

export default usePapers
