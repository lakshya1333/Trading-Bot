import 'dotenv/config'
import {WorkflowModel, ExecutionModel} from "db/client"
import { execute } from "./execute.js"
import mongoose from 'mongoose'


async function main(){

    await mongoose.connect(process.env.MONGO_URL!)
    console.log("Connected to MongoDB. Starting workflow executor...")
    
    while(1){
        const workflows = await WorkflowModel.find({})
        console.log(`Found ${workflows.length} workflows`)
        
        for (const workflow of workflows) {
            const trigger = workflow.nodes.find(x=> x.data?.kind === "TRIGGER")
            if(!trigger){
                continue;
            }
            
            // Timer trigger - check if it's time to execute
            const timeInS = trigger.data?.metadata.time
            if (timeInS) {
                    const lastExecution = await ExecutionModel.findOne({
                        workflowId: workflow.id,
                    }).sort({
                        startTime: -1
                    })
                    
                    const now = Date.now()
                    const timeInMs = timeInS * 1000
                    
                    if(!lastExecution || now - lastExecution.startTime.getTime() >= timeInMs){
                        console.log(`Executing workflow ${workflow.id}`)
                        const execution = await ExecutionModel.create({
                            workflowId: workflow.id,
                            status: "PENDING",
                            startTime: new Date()
                        })
                        
                        try {
                            await execute(workflow.nodes, workflow.edges)
                            execution.status = "SUCCESS"
                        } catch (error) {
                            console.error(`Workflow execution failed:`, error)
                            execution.status = "FAILED"
                        }
                        
                        execution.endtime = new Date()
                        await execution.save()
                    }
                }
        }
        
        // Wait 5 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 5000))
    }
}


main()