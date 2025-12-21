import { Handle, Position } from "@xyflow/react"
import { type TradingMetadata } from "common/types";


export function Hyperliquid({data}:{
    data:{
        metadata: TradingMetadata
    }
}) {
    const displayType = data.metadata.type?.toUpperCase() || 'N/A'
    const maskedApiKey = data.metadata.apiKey ? `${data.metadata.apiKey.substring(0, 4)}...` : 'N/A'
    
    return <div className="min-w-[200px] bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden cursor-move">
        <div className="bg-cyan-600 px-3 py-2">
            <div className="text-white font-semibold text-sm">Hyperliquid Trade</div>
        </div>
        <div className="p-3 space-y-2 text-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Type:</span>
                <span className={`font-semibold ${data.metadata.type === 'long' ? 'text-green-600' : 'text-red-600'}`}>
                    {displayType}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Symbol:</span>
                <span className="font-semibold text-gray-900">{data.metadata.symbol}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Qty:</span>
                <span className="font-semibold text-gray-900">{data.metadata.qty}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600">API Key:</span>
                <span className="font-mono text-xs text-gray-700">{maskedApiKey}</span>
            </div>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-cyan-600 !w-3 !h-3"></Handle>
        <Handle type="target" position={Position.Left} className="!bg-cyan-600 !w-3 !h-3"></Handle>
    </div>
}