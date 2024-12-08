import { Request, Response } from "express";

export default async function logout(req:Request, res:Response) : Promise<any> {
    const cookies = req.cookies;
    if (cookies['session']){
        res.clearCookie('session', {
            httpOnly: true,
            sameSite : 'none',
            secure : true
        });
        return res.status(200).json({message: 'Logout successful'});
    };
    res.status(319).json({message : 'redirect'});
};
