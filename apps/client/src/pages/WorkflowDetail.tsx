import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/http'
import CreateWorkflow from '@/components/CreateWorkflow'

interface Workflow {
  _id: string
  userId: string
  nodes: any[]
  edges: any[]
  createdAt?: string
  updatedAt?: string
}

export default function WorkflowDetail() {
  const { workflowId } = useParams<{ workflowId: string }>()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (workflowId) {
      loadWorkflow()
    }
  }, [workflowId])

  const loadWorkflow = async () => {
    if (!workflowId) return
    
    try {
      const data = await apiClient.getWorkflow(workflowId)
      setWorkflow(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflow')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading workflow...</div>
      </div>
    )
  }

  if (error || !workflow) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-600 mb-4">{error || 'Workflow not found'}</div>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back
            </Button>
            <h1 className="text-xl font-semibold">Workflow Details</h1>
          </div>
          <Button onClick={() => navigate(`/workflow/${workflowId}/executions`)}>
            View Executions
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <CreateWorkflow workflowId={workflowId} initialData={workflow} />
      </div>
    </div>
  )
}
