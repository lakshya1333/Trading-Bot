import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { SigninSchema, SignupSchema } from  "common/types"
import jwt from 'jsonwebtoken'
import { UserModel } from 'db/client'
import { authMiddleware } from './middleware.js'
mongoose.connect(process.env.MONGO_URL!)
const JWT_SECRET = process.env.JWT_SECRET!


const app = express()
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
            message: "Username already exists"
        })
    }
})

app.post("/workflow", authMiddleware,(req,res)=>{
    const userId = req.userId!
})

app.put("/workflow",authMiddleware,(req,res)=>{

})

app.get("/workflow/:workflowId",authMiddleware,(req,res)=>{

})

app.get("/workflow/executions/:workflowId",authMiddleware,(req,res)=>{

})

app.get("/nodes",(req,res)=>{

})

app.listen(3000)






