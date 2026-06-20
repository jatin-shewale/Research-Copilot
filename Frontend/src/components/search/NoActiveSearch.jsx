import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'

export default function NoActiveSearch({ title = 'No active research session', description }) {
  const navigate = useNavigate()
  return (
    <EmptyState
      icon={FiSearch}
      title={title}
      description={description || 'Run a research query first — every view here (landscape, graph, reading map, timeline, chat) is generated from your latest search.'}
      action={
        <Button onClick={() => navigate('/search')}>
          Start a Research Query
        </Button>
      }
    />
  )
}
