import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET!


export function authMiddleware(req: Request,res:Response,next: NextFunction){
    const header = req.headers["authorization"] as string;

    if(!header){
        res.status(403).json({
            message: "You are not logged in"
        })
        return
    }

    const token = header.startsWith('Bearer ') ? header.substring(7) : header

    try{
        const response = jwt.verify(token,JWT_SECRET) as JwtPayload
        req.userId = response.id
        next()
    }catch(e){
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}