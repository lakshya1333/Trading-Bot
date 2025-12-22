import {WorkflowModel, ExecutionModel} from "db/client"
import { execute } from "./execute";

async function main(){
    while(1){
        const workflows = await WorkflowModel.find({})
        workflows.map(async workflow =>{
            const trigger = workflow.nodes.find(x=> x.data?.kind === "TRIGGER")
            if(!trigger){
                return;
            }
            switch (trigger?.name) {
                case "timer":
                    const timeInS = trigger.data?.metadata.time
                    const execution =  await ExecutionModel.findOne({
                        workflowId: workflow.id,
                    }).sort({
                        startTime: 1
                    })
                    if(!execution){
                        await execute(workflow.nodes,workflow.edges)
                    } else if(execution.startTime.getSeconds() < Date.now() - timeInS){
                        await execute(workflow.nodes,workflow.edges)
                    }
            }
        })
    }
}


main()