import { NodesModel } from "db/client";
import { execute as executeLighter } from "./executors/lighter";

export type NodeDocument = {
    id: string;
    type: string
    data?: {
        kind?: "TRIGGER" | "ACTION" | null | undefined;
        metadata?: any;
    } | null | undefined;
    credentials?: any;
    nodeId: string
}  


export type EdgeDocument = {
    source: string,
    target: string
}

export async function execute(nodes: NodeDocument[],edges: EdgeDocument[]){
    const trigger = nodes.find(x=> x.data?.kind === "TRIGGER")
    if(!trigger){
        return;
    }
    await executeRecursive(trigger?.id,nodes,edges)
}

export async function executeRecursive(sourceId: string,nodes: NodeDocument[],edges: EdgeDocument[]){
    const nodesToExecute = edges.filter(({source,target}) => source === sourceId).map(({target})=>target)

    await Promise.all(nodesToExecute.map(async (nodeClientId) => {
        const node = nodes.find(({id}) => id === nodeClientId)
        if(!node){
            return
        }
        switch(node.type){
            case "lighter":

        }
    }))

    await Promise.all(nodesToExecute.map(id => executeRecursive(id,nodes,edges)))

}