import { Request, Response, NextFunction } from "express";


export async function checkAuthStatus(req:Request, res:Response, next:NextFunction) : Promise<any> {
    const customHeader = req.headers.personal;
    const isAuthenticated = req.isAuthenticated;

    // console.log('Custom Header:', customHeader);
  
    if (customHeader === undefined || customHeader !== 'gibby-frontend' || isAuthenticated){
        
        return res.status(309).json({redirectTo : '/'});
    };
    
    next();
};
