import { Request, Response, NextFunction } from "express";
import db from "../dbConfig/dbConfig";

export async function setAuthStatus(req:Request, res:Response, next:NextFunction) {
    req.isAuthenticated = false;
    const session = req.cookies.session;
    if(session) {
        const {email, uuid} = JSON.parse(session);
        if(email) {
            const user = await db('session').where({email}).first();
            if (user && uuid === user.uuid) req.isAuthenticated = true
        }
    }
    next();
};
