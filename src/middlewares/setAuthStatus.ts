import { Request, Response, NextFunction } from "express";
import db from "../dbConfig/dbConfig";

export async function setAuthStatus(req:Request, res:Response, next:NextFunction) : Promise<any> {
    req.isAuthenticated = false;
    const session = req.cookies.session;
    const path = req.path;

    if(session) {
        const {email, uuid} = JSON.parse(session);

        if(email) {
            const userSession = await db('session').where({email}).first();
            if (userSession && uuid === userSession.uuid) {
                req.isAuthenticated = true;
                
                if(path === '/') {
                    const user = await db('users').where({email}).first();
                    if(user) {
                        delete user.password;
                        delete user.updated_at;
                        return res.status(309).json(user);
                    };
                }
            };
        };
    };
    next();
};
