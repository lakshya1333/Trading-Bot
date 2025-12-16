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

import { type TimerNodeMetadata,type PriceTriggerMetadata} from "common/types";
import { Input } from "./ui/input";


const SUPPORTED_TRIGGERS = [{
    id: "timer",
    title: "Timer",
    description: "Run this trigger every x seconds/minutes"
    },{
    id: "price-trigger",
    title: "Price Trigger",
    description: "Runs whenever the price goes above or below a certain threshold for an asset"
}]


export const TriggerSheet = ({
    onSelect
}: {
    onSelect: (kind: NodeKind, metadata: NodeMetaData) => void
}) => {
    const [metadata,setMetadata] = useState<PriceTriggerMetadata | TimerNodeMetadata>({
        time: 3600,
    })
    const [selectedTrigger,setSelectedTrigger] = useState(SUPPORTED_TRIGGERS[0].id)
    return <Sheet open={true}>
  <SheetContent className="w-[400px]">
    <SheetHeader className="space-y-2 pb-6">
      <SheetTitle>Select Trigger</SheetTitle>
      <SheetDescription>
        Choose the event that starts your workflow
      </SheetDescription>
    </SheetHeader>
    
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Trigger Type</label>
        <Select value={selectedTrigger} onValueChange={(value) => setSelectedTrigger(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a trigger" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SUPPORTED_TRIGGERS.map(({id,title}) => (
                <SelectItem key={id} value={id}>{title}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedTrigger == "timer" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Interval (seconds)</label>
          <Input 
            type="number"
            value={metadata.time} 
            onChange={(e) => setMetadata(metadata => ({
              ...metadata,
              time: Number(e.target.value)
            }))}
            placeholder="3600"
          />
        </div>
      )}

      {selectedTrigger == "price-trigger" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Price</label>
            <Input 
              type="number"
              onChange={(e)=>setMetadata(m =>({
                ...m,
                price: Number(e.target.value)
              }))}
              placeholder="50000"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Asset</label>
            <Select value={metadata.asset} onValueChange={(value) => setMetadata(metadata => ({
              ...metadata,
              asset: value
            }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SUPPORTED_ASSETS.map((id) => (
                    <SelectItem key={id} value={id}>{id}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>

    <SheetFooter className="mt-6">
      <Button 
        onClick={()=>{
          onSelect(selectedTrigger, metadata)
        }} 
        className="w-full"
        type="submit"
      >
        Create Trigger
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
}