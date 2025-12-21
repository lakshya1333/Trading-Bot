import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/http'

interface Execution {
  _id: string
  workflowId: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export default function WorkflowExecutions() {
  const { workflowId } = useParams<{ workflowId: string }>()
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (workflowId) {
      loadExecutions()
    }
  }, [workflowId])

  const loadExecutions = async () => {
    if (!workflowId) return
    
    try {
      const data = await apiClient.getWorkflowExecutions(workflowId)
      setExecutions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load executions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(`/workflow/${workflowId}`)}>
              Back to Workflow
            </Button>
            <h1 className="text-3xl font-bold">Workflow Executions</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading executions...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-12">{error}</div>
        ) : executions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No executions found for this workflow</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {executions.map((execution) => (
                  <tr key={execution._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {execution._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          execution.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : execution.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {execution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {execution.createdAt
                        ? new Date(execution.createdAt).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {execution.updatedAt
                        ? new Date(execution.updatedAt).toLocaleString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
