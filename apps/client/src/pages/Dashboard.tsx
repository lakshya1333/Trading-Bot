import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/http'
import { ThemeToggle } from '@/components/theme-toggle'
import { Plus, LogOut, Activity, Eye } from 'lucide-react'

interface Workflow {
  _id: string
  userId: string
  nodes: any[]
  edges: any[]
  createdAt?: string
  updatedAt?: string
}

export default function Dashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      const data = await apiClient.getWorkflows()
      setWorkflows(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    apiClient.clearToken()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="flex gap-3 items-center">
              <ThemeToggle />
              <Button onClick={() => navigate('/create-workflow')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            Loading workflows...
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 rounded p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No workflows yet</p>
            <Button onClick={() => navigate('/create-workflow')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <div
                key={workflow._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
                onClick={() => navigate(`/workflow/${workflow._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">Workflow</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {workflow.createdAt
                      ? new Date(workflow.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                  <p>Nodes: {workflow.nodes?.length || 0}</p>
                  <p>Edges: {workflow.edges?.length || 0}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/workflow/${workflow._id}`)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/workflow/${workflow._id}/executions`)
                    }}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Executions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
