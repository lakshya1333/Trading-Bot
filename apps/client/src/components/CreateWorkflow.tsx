import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { useNavigate } from 'react-router-dom';
import { TriggerSheet } from './TriggerSheet';
import { PriceTrigger} from '@/nodes/triggers/PriceTrigger';
import { Timer} from '@/nodes/triggers/Timer';
import { Lighter} from '@/nodes/actions/Lighter';
import { type TradingMetadata,type TimerNodeMetadata,type PriceTriggerMetadata} from "common/types";
import { ActionSheet } from './ActionSheet';
import { Backpack } from '@/nodes/actions/Backpack';
import { Hyperliquid } from '@/nodes/actions/Hyperliquid';
import { Button } from './ui/button';
import { apiClient } from '@/http';

const nodeTypes = {
    "price-trigger": PriceTrigger,
    "timer": Timer,
    "lighter": Lighter,
    "backpack": Backpack,
    "hyperliquid": Hyperliquid
}
 
export type TriggerType = "action" | "trigger";
export type NodeKind = "price-trigger" | "timer" | "hyperliquid" | "backpack" | "lighter"
interface NodeType{
    type: NodeKind,
    data: {
        kind: TriggerType,
        metadata: NodeMetaData,
    },
    id: string, 
    position: {x: number,y: number}
}

export type NodeMetaData = TradingMetadata | PriceTriggerMetadata | TimerNodeMetadata;

interface Edge{
    id: string,
    source: string, 
    target: string
}


export default function CreateWorkflow({ workflowId, initialData }: { workflowId?: string, initialData?: any } = {}) {
  const navigate = useNavigate();
  
  // Transform nodes from database format to ReactFlow format
  const transformedNodes = initialData?.nodes?.map((node: any) => ({
    id: node.id,
    type: node.nodeId?.name || node.type, // Use nodeId.name from populated data
    position: node.position,
    data: node.data
  })) || []
  
  const [nodes, setNodes] = useState<NodeType[]>(transformedNodes);
  const [edges, setEdges] = useState<Edge[]>(initialData?.edges || []);
  const [availableNodes, setAvailableNodes] = useState<any[]>([])
  const [selectAction,setSelectAction] =useState<{
    position: {
      x: number,
      y: number
    },
    startingNodeId: string,
  } | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [publishSuccess, setPublishSuccess] = useState('')

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const dbNodes = await apiClient.getNodes()
        setAvailableNodes(dbNodes)
      } catch (error) {
        console.error('Failed to fetch nodes:', error)
      }
    }
    fetchNodes()
  }, [])
 
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const POSITION_OFFSET = 5
  const onConnectEnd = useCallback(
    (params,connectionInfo) => {
        if(!connectionInfo.isValid){
          setSelectAction({
            startingNodeId: connectionInfo.fromNode.id,
            position: {
              x: connectionInfo.from.x + POSITION_OFFSET,
              y: connectionInfo.from.y + POSITION_OFFSET
            }
          })
        }
    },[]
  )

  const handlePublish = async () => {
    if (nodes.length === 0) {
      setPublishError('Please add at least one node to your workflow')
      return
    }

    setIsPublishing(true)
    setPublishError('')

    try {
      const workflowData = {
        nodes: nodes.map(node => {
          const dbNode = availableNodes.find(n => n.name === node.type)
          if (!dbNode) {
            throw new Error(`Node type ${node.type} not found in database`)
          }
          return {
            nodeId: dbNode._id,
            data: {
              kind: node.data.kind.toUpperCase() as "ACTION" | "TRIGGER",
              metadata: node.data.metadata
            },
            credentials: {},
            id: node.id,
            position: node.position
          }
        }),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      }

      if (workflowId) {
        // Update existing workflow
        await apiClient.updateWorkflow(workflowId, workflowData)
        setPublishError('')
        setPublishSuccess('Workflow updated successfully!')
        setTimeout(() => setPublishSuccess(''), 3000)
      } else {
        // Create new workflow
        const response = await apiClient.createWorkflow(workflowData)
        setPublishError('')
        setPublishSuccess('Workflow published successfully!')
        setTimeout(() => {
          navigate(`/workflow/${response._id}`)
        }, 1500)
      }
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Failed to publish workflow')
    } finally {
      setIsPublishing(false)
    }
  }
 
  return (
    <div style={{ width: '100vw', height: '100vh' }} className="flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 z-10">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Back
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">Trading Bot Workflow</h1>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 mr-4">
            <span>{nodes.length} Nodes</span>
            <span className="text-gray-300">|</span>
            <span>{edges.length} Connections</span>
          </div>
          {publishError && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-200 mr-2">
              {publishError}
            </div>
          )}
          {publishSuccess && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-200 mr-2">
              {publishSuccess}
            </div>
          )}
          <Button 
            onClick={handlePublish}
            disabled={isPublishing || nodes.length === 0}
            size="sm"
          >
            {isPublishing ? 'Publishing...' : workflowId ? 'Update Workflow' : 'Publish Workflow'}
          </Button>
        </div>
      </div>
      
      {!nodes.length && <TriggerSheet onSelect={(type,metadata) => {
        setNodes([...nodes,{
            id: Math.random().toString(),
            type,
            data:{
                kind: "trigger",
                metadata
            },
            position: {x:0,y:0}
      }])}}/>}
      {selectAction && <ActionSheet onSelect={(type,metadata) => {
        const nodeId = Math.random().toString()
        setNodes([...nodes,{
            id: nodeId,
            type,
            data:{
                kind: "action",
                metadata
            },
            position: selectAction.position
      }])
      setEdges([...edges,{
        id: `${selectAction.startingNodeId}-${nodeId}`,
        source: selectAction.startingNodeId,
        target: nodeId
      }])
      setSelectAction(null)
      }}/>}
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
      />
    </div>
  );
}