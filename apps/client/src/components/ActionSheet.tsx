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
import { Label } from "./ui/label";
import { type TradingMetadata, SUPPORTED_ASSETS, SUPPORTED_ACTIONS} from "common/types";


export const ActionSheet = ({
    onSelect
}: {
    onSelect: (kind: NodeKind, metadata: NodeMetaData) => void
}) => {
    const [metadata,setMetadata] = useState<Partial<TradingMetadata>>({})
    const [selectedAction,setSelectedAction] = useState(SUPPORTED_ACTIONS[0].id)
    const [error, setError] = useState('')
    return <Sheet open={true}>
  <SheetContent className="w-[400px]">
    <SheetHeader className="space-y-2 pb-6">
      <SheetTitle>Select action</SheetTitle>
      <SheetDescription>
        Choose an exchange and configure your trade parameters.
      </SheetDescription>
    </SheetHeader>
    
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="action-type">Action type</Label>
        <Select value={selectedAction} onValueChange={(value) => {
          setSelectedAction(value)
          setMetadata(m => ({...m, actionType: value}))
        }}>
          <SelectTrigger id="action-type" className="w-full">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position-type">type</Label>
              <Select value={metadata?.type} onValueChange={(value: "long" | "short") => setMetadata(metadata => ({
                  ...metadata,
                  type: value
              }))}>
                <SelectTrigger id="position-type" className="w-full">
                  <SelectValue placeholder="Weather it is a long or a short" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select value={metadata?.symbol} onValueChange={(value) => setMetadata(metadata => ({
                  ...metadata,
                  symbol: value
              }))}>
                <SelectTrigger id="asset" className="w-full">
                  <SelectValue placeholder="Which asset to long or short" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity"
              type="number"
              value={metadata.qty || ''} 
              onChange={(e)=>setMetadata(m =>({
                ...m,
                qty: Number(e.target.value)
              }))}
              placeholder="How much to long or short"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API_KEY *</Label>
            <Input 
              id="api-key"
              type="text"
              value={metadata.apiKey || ''} 
              onChange={(e)=>setMetadata(m =>({
                ...m,
                apiKey: e.target.value
              }))}
              placeholder="Enter your API key"
              required
            />
          </div>
        </div>
      )}
    </div>

    <SheetFooter className="mt-6 flex-col gap-3">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}
      <Button 
        onClick={()=>{
          if (!metadata.type || !metadata.symbol || !metadata.qty || !metadata.apiKey) {
            setError('Please fill in all required fields including API Key')
            return
          }
          setError('')
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