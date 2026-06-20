import { useQuery } from '@tanstack/react-query'
import graphService from '../services/graphService'

export function useKnowledgeGraph(searchId) {
  return useQuery({
    queryKey: ['knowledge-graph', searchId],
    queryFn: () => graphService.getKnowledgeGraph(searchId),
    enabled: Boolean(searchId),
    retry: 1,
  })
}

export default useKnowledgeGraph
