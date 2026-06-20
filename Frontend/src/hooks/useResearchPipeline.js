import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import searchService from '../services/searchService'
import { useSearchStore } from '../store/searchStore'
import { SEARCH_POLL_INTERVAL_MS, SEARCH_POLL_TIMEOUT_MS } from '../constants'

/**
 * Drives a research pipeline run end-to-end: kicks it off, then polls
 * GET /search/{id} until it completes or fails. The backend doesn't expose
 * granular per-stage websocket events, so we simulate smooth stage progress
 * client-side (purely cosmetic) while the real status is "processing".
 */
export function useResearchPipeline() {
  const navigate = useNavigate()
  const { startSearch, setCompleted, setFailed, searchId, status, results, error, query } = useSearchStore()
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const pollRef = useRef(null)
  const stageTimerRef = useRef(null)
  const startedAtRef = useRef(null)

  const clearTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (stageTimerRef.current) clearInterval(stageTimerRef.current)
    pollRef.current = null
    stageTimerRef.current = null
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const run = useCallback(
    async (newQuery) => {
      clearTimers()
      setActiveStageIndex(0)
      startedAtRef.current = Date.now()

      try {
        const { search_id } = await searchService.startResearch(newQuery)
        startSearch({ searchId: search_id, query: newQuery })
        navigate(`/search?id=${search_id}`)

        // Cosmetic stage progression — advances roughly every few seconds
        // while we wait for the real backend result.
        stageTimerRef.current = setInterval(() => {
          setActiveStageIndex((prev) => Math.min(prev + 1, 7))
        }, 4500)

        pollRef.current = setInterval(async () => {
          if (Date.now() - startedAtRef.current > SEARCH_POLL_TIMEOUT_MS) {
            clearTimers()
            setFailed('The research pipeline took too long to respond. Please try again.')
            return
          }
          try {
            const result = await searchService.getSearchResult(search_id)
            if (result.status === 'completed') {
              clearTimers()
              setActiveStageIndex(8)
              setCompleted(result.results)
            } else if (result.status === 'failed') {
              clearTimers()
              setFailed(result.error || 'The research pipeline failed.')
            }
          } catch (err) {
            clearTimers()
            setFailed(err.message || 'Lost connection while polling for results.')
          }
        }, SEARCH_POLL_INTERVAL_MS)
      } catch (err) {
        setFailed(err.message || 'Could not start the research pipeline.')
      }
    },
    [clearTimers, navigate, setCompleted, setFailed, startSearch]
  )

  const resumePolling = useCallback(
    (existingSearchId) => {
      clearTimers()
      startedAtRef.current = Date.now()
      pollRef.current = setInterval(async () => {
        if (Date.now() - startedAtRef.current > SEARCH_POLL_TIMEOUT_MS) {
          clearTimers()
          setFailed('The research pipeline took too long to respond. Please try again.')
          return
        }
        try {
          const result = await searchService.getSearchResult(existingSearchId)
          if (result.status === 'completed') {
            clearTimers()
            setCompleted(result.results)
          } else if (result.status === 'failed') {
            clearTimers()
            setFailed(result.error || 'The research pipeline failed.')
          }
        } catch (err) {
          clearTimers()
          setFailed(err.message || 'Lost connection while polling for results.')
        }
      }, SEARCH_POLL_INTERVAL_MS)
    },
    [clearTimers, setCompleted, setFailed]
  )

  return { run, resumePolling, searchId, status, results, error, query, activeStageIndex, clearTimers }
}

export default useResearchPipeline
