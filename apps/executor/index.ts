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
                    if(!execution || new Date(execution.startTime).getTime() < Date.now() - (timeInS*1000)){
                        const execution = await ExecutionModel.create({
                        workflowId: workflow.id,
                        status: "PENDING",
                        startTime: new Date()
                        })
                        
                        try {
                            await execute(workflow.nodes,workflow.edges)
                            execution.endtime = new Date()
                            execution.status = "SUCCESS"
                            await execution.save()
                            console.log(`✓ Execution ${execution._id} completed successfully`)
                        } catch (error) {
                            execution.endtime = new Date()
                            execution.status = "FAILURE"
                            await execution.save()
                            console.error(`✗ Execution ${execution._id} failed:`, error)
                        }
                    }
            }
        })


        await new Promise(x => setTimeout(x,2000))
    }
}


main()  