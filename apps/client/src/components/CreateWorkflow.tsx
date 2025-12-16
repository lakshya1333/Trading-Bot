import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { TriggerSheet } from './TriggerSheet';
import { PriceTrigger, type PriceTriggerMetadata } from '@/nodes/triggers/PriceTrigger';
import { Timer, type TimerNodeMetadata } from '@/nodes/triggers/Timer';
import { Lighter, type TradingMetadata } from '@/nodes/actions/Lighter';
import { ActionSheet } from './ActionSheet';
import { Backpack } from '@/nodes/actions/Backpack';
import { Hyperliquid } from '@/nodes/actions/Hyperliquid';

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


export default function CreateWorkflow() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectAction,setSelectAction] =useState<{
    position: {
      x: number,
      y: number
    },
    startingNodeId: string,
  } | null>(null)
 
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
          console.log(connectionInfo.fromNode.id)
          console.log(connectionInfo.fromNode.to)
        }
    },[]
  )

 
  return (
    <div style={{ width: '100vw', height: '100vh' }} className="flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-800">Trading Bot Workflow</h1>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm text-gray-600">
          <span>{nodes.length} Nodes</span>
          <span className="text-gray-300">|</span>
          <span>{edges.length} Connections</span>
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