import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { CreateWorkflowSchema, SigninSchema, SignupSchema, UpdateWorkflowSchema } from  "common/types"
import jwt from 'jsonwebtoken'
import { ExecutionModel, NodesModel, UserModel, WorkflowModel } from 'db/client'
import { authMiddleware } from './middleware.js'
mongoose.connect(process.env.MONGO_URL!)
const JWT_SECRET = process.env.JWT_SECRET!


const app = express()
app.use(cors())
app.use(express.json())

app.post("/signup",async (req,res)=>{
    const {success,data} = SignupSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return
    }
    try{
        const user = await UserModel.create({
        username: data.username,
        password: data.password
        })

        res.json({
            id: user._id
        })
    } catch(e){
        res.status(411).json({
            message: "Username already exists"
        })
    }
})

app.post("/signin",async (req,res)=>{
    const {success,data} = SigninSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return
    }
    try{
        const user = await UserModel.findOne({
        username: data.username,
        password: data.password
        })
        if(user){
            const token = jwt.sign({
                id: user._id
            },JWT_SECRET);

            res.json({
            id: user._id,
            token
            })   
        }else{
           res.status(403).json({
            message: "Incorrect credentials"
        }) 
        }
    } catch(e){
        res.status(411).json({
            message: "Server is not responding"
        })
    }
})

app.post("/workflow", authMiddleware,async(req,res)=>{
    const userId = req.userId!
    const {success,data,error} = CreateWorkflowSchema.safeParse(req.body);
    if(!success){
        console.log("Validation error:", error)
        res.status(403).json({
            message: "Incorrect inputs",
            errors: error.errors
        })
        return
    }
    try{
        const workflow = await WorkflowModel.create({
            userId,
            nodes: data.nodes,
            edges: data.edges
        })
        res.json({
            _id: workflow._id
        })
    }catch(e){
        console.error("Workflow creation error found:", e)
        res.status(411).json({
            message: "Failed to create workflow",
            error: e instanceof Error ? e.message : "Unknown error"
        })
    }
})

app.put("/workflow/:workflowId",authMiddleware,async(req,res)=>{
    const {success,data} = UpdateWorkflowSchema.safeParse(req.body)
    if(!success){
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return
    }
    try{
        const workflow = await WorkflowModel.findByIdAndUpdate(req.params.workflowId,data,{new:true})
        if(!workflow){
            res.status(404).json({
                message: "workflow not found"
            })
            return
        }
        res.json({
            _id: workflow._id
        })
    }catch(e){
        res.status(411).json({
            message: "Failed to update workflow"
        })
    }
})

app.get("/workflow/:workflowId",authMiddleware,async (req,res)=>{
    const workflow = await WorkflowModel.findById(req.params.workflowId).populate('nodes.nodeId')
    if(!workflow || workflow.userId.toString() !== req.userId){
        res.status(404).json({
            message: "Workflow not found"
        })
        return
    }
    res.json(workflow)
})

app.get("/workflows",authMiddleware,async(req,res)=>{
    const workflows = await WorkflowModel.find({userId: new mongoose.Types.ObjectId(req.userId!)})
    res.json(workflows)
})

app.get("/workflow/executions/:workflowId",authMiddleware,async (req,res)=>{
    const executions = await ExecutionModel.find({workflowId: new mongoose.Types.ObjectId(req.params.workflowId)})
    res.json(executions)
})

app.get("/nodes",async (req,res)=>{
    const nodes = await NodesModel.find()
    res.json(nodes)
})

app.listen(process.env.PORT || 3000)






