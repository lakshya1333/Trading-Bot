import type { NodeKind, NodeMetaData } from "./CreateWorkflow";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { type TradingMetadata, SUPPORTED_ASSETS} from "common/types";

const SUPPORTED_ACTIONS = [{
    id: "hyperliquid",
    title: "Hyperliquid",
    description: "Place a trade on hyperliquid"
    },{
    id: "lighter",
    title: "Lighter",
    description: "Place a trade on lighter"
    },{
    id: "backpack",
    title: "Backpack",
    description: "Place a trade on backpack" 
}]


export const ActionSheet = ({
    onSelect
}: {
    onSelect: (kind: NodeKind, metadata: NodeMetaData) => void
}) => {
    const [metadata,setMetadata] = useState<TradingMetadata | {}>({})
    const [selectedAction,setSelectedAction] = useState(SUPPORTED_ACTIONS[0].id)
    return <Sheet open={true}>
  <SheetContent className="w-[400px]">
    <SheetHeader className="space-y-2 pb-6">
      <SheetTitle>Select Action</SheetTitle>
      <SheetDescription>
        Choose the trading action to execute
      </SheetDescription>
    </SheetHeader>
    
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Exchange Platform</label>
        <Select value={selectedAction} onValueChange={(value) => setSelectedAction(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an exchange" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SUPPORTED_ACTIONS.map(({id,title}) => (
                <SelectItem key={id} value={id}>{title}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {(selectedAction === "hyperliquid" || selectedAction === "lighter" || selectedAction === "backpack") && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Position Type</label>
            <Select value={metadata?.type} onValueChange={(value) => setMetadata(metadata => ({
                ...metadata,
                type: value
            }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"long"}>LONG</SelectItem>
                  <SelectItem value={"short"}>SHORT</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trading Symbol</label>
            <Select value={metadata?.symbol} onValueChange={(value) => setMetadata(metadata => ({
                ...metadata,
                symbol: value
            }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SUPPORTED_ASSETS.map(asset => (
                    <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input 
              type="number"
              value={metadata.qty} 
              onChange={(e)=>setMetadata(m =>({
                ...m,
                qty: Number(e.target.value)
              }))}
              placeholder="Enter quantity"
            />
          </div>
        </div>
      )}
    </div>

    <SheetFooter className="mt-6">
      <Button 
        onClick={()=>{
          onSelect(selectedAction, metadata)
        }} 
        className="w-full"
        type="submit"
      >
        Create Action
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
}