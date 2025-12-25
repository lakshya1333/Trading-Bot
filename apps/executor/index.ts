import {WorkflowModel, ExecutionModel} from "db/client"
import { execute } from "./execute.js";
import mongoose from 'mongoose'
import 'dotenv/config'

async function main(){

    await mongoose.connect(process.env.MONGO_URL!)
    while(1){
        const workflows = await WorkflowModel.find({}).populate('nodes.nodeId')
        workflows.map(async workflow =>{
            const trigger = workflow.nodes.find(x=> x.data?.kind === "TRIGGER")
            if(!trigger){
                return;
            }
            switch (trigger?.nodeId?.name) {
                case "timer":
                    const timeInS = trigger.data?.metadata.time
                    const execution =  await ExecutionModel.findOne({
                        workflowId: workflow.id,
                    }).sort({
                        startTime: -1
                    })
                    if(!execution || new Date(execution.startTime).getTime() < Date.now() - timeInS){
                        const execution = await ExecutionModel.create({
                        workflowId: workflow.id,
                        status: "PENDING",
                        startTime: new Date()
                        })
                        await execute(workflow.nodes,workflow.edges)

                        execution.endtime = new Date()
                        await execution.save()
                    }
            }
        })
    }
}


main()  