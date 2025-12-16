import { Handle, Position } from "@xyflow/react";
import { type PriceTriggerMetadata } from "common/types";

export function PriceTrigger({data,isConnectable: _isConnectable}:{
    data: {
        metadata: PriceTriggerMetadata
    },
    isConnectable: boolean
}){
    return <div className="min-w-[200px] bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden cursor-move">
        <div className="bg-purple-600 px-3 py-2">
            <div className="text-white font-semibold text-sm">Price Trigger</div>
        </div>
        <div className="p-3 space-y-2 text-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Asset:</span>
                <span className="font-semibold text-gray-900">{data.metadata.asset}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-gray-900">${data.metadata.price}</span>
            </div>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-purple-600 !w-3 !h-3"></Handle>
    </div>
}