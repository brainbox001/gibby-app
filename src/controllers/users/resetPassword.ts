import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";
import mailObj from "./sendMail";
import { encryptDecrypt } from "./register";

interface User {
    firstName : string;
    lastName : string;
    email : string;
    balance : number;
    password? : string;
}

export default async function resetPassword(req:Request, res:Response) : Promise<any> {
    const {email, code, password} = req.body;
    if(!email) return res.status(400).json({message : 'invalid credentials'});

    let user : User;
    try {
        user = await db('users').where({email}).first().select('firstName', 'lastName', 'email', 'password');
        if(!user) return res.status(404).json({message : 'user not found'});

        const cookie = req.cookies.user;

        if(!code && !password) {
            if(!cookie) {
                const sentCode = await mailObj.sendMail(email, user.firstName);
                const encrypted = await encryptDecrypt(sentCode);
                
                res.cookie('user', encrypted, {
                httpOnly : true,
                expires : new Date(Date.now() + 5 * 60 *1000)
            });
            };    
            return res.status(100).json({message : 'check your mail for a verification code'});
        };
        if(code) {
            if(!cookie) return res.status(400).json({message : 'unknown request'});
            const decrypted = await encryptDecrypt(cookie);
            if(decrypted !== code) return res.status(400).json({message : 'Invalid code'});
            return res.status(102).json({message : 'set new password'});
        };
        /* If you observe this function, you'll discover that the next two lines of code poses 
        a potential leak for an attacker, but a middleware will get it covered!!
        */
        if(password === user.password) return res.status(400).json({message : 'password must be different from the previous'});
        
        await db('users').where({email}).first().update({password});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error : 'An error occured while trying to reset password'});
    };
    
    res.status(200).json({message : 'password updated'});
};
