import { Request, Response, NextFunction } from "express";


export async function checkAuthStatus(req:Request, res:Response, next:NextFunction) {
    const userAgent = req.headers["user-agent"];
    const isAuthenticated = req.isAuthenticated;
    if (userAgent === undefined || userAgent !== 'gibby-frontend' || isAuthenticated){
        return res.redirect(303, '/');
    };
    
    next();
};
