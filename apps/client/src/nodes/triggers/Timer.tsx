import { Handle, Position } from "@xyflow/react";
import { type TimerNodeMetadata } from "common/types";

export function Timer({data}:{
    data: {
        metadata: TimerNodeMetadata
    },
    isConnectable: boolean
}){
    return <div className="min-w-[200px] bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden cursor-move">
        <div className="bg-green-600 px-3 py-2">
            <div className="text-white font-semibold text-sm">Timer</div>
        </div>
        <div className="p-3 text-center text-sm">
            <div className="text-gray-600 mb-1">Every</div>
            <div className="text-2xl font-bold text-gray-900">{data.metadata.time}s</div>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-green-600 !w-3 !h-3"></Handle>
    </div>
}