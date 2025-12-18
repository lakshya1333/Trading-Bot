import express from 'express'
import mongoose from 'mongoose'
import { SignupSchema } from  "common/types"
import { UserModel } from 'db/client'
mongoose.connect(process.env.MONGO_URL!)

const app = express()


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

app.post("/signin",(req,res)=>{

})

app.post("/workflow",(req,res)=>{

})

app.put("/workflow",(req,res)=>{

})

app.get("/workflow/:workflowId",(req,res)=>{

})

app.get("/workflow/executions/:workflowId",(req,res)=>{

})

app.post("/credentials",(req,res)=>{

})

app.get("/credentials",(req,res)=>{

})



app.listen(process.env.PORT || 3000)



