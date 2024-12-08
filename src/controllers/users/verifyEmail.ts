import { Request, Response } from "express";
import { encryptDecrypt } from "./register";
import db from "../../dbConfig/dbConfig";
import { v4 as uuidv4 } from 'uuid';

interface User {
    firstName : string;
    lastName : string;
    email : string;
}

export default async function verifyEmail(req:Request, res:Response) : Promise<any> {
    const {code, email, forPasswordChange} = req.body;
    if(!code || !email) return res.status(400).json({error : 'code not provided'});
    const cookie = req.cookies.user;
    console.log(req.cookies);
    if(!cookie) return res.status(309).json({redirectTo : '/'});
    const decrypted = await encryptDecrypt(cookie);
    if (code !== decrypted) return res.status(400).json({error : 'Incorrect code'});
    let user : User;
    try {
        user  = await db('users').where({email}).select('firstName', 'lastName', 'email').first();
        if(!user) return res.status(404).json({error: 'user not found'});

        res.clearCookie('user',{
            httpOnly: true,
            sameSite : 'none',
            secure : true
        });
        if(forPasswordChange) {
            return res.status(215).json({message : 'code verified'});
        };

        await db('users').where({email}).first().update({emailIsVerified : true});
        const uuid = uuidv4();
        await db('session').insert({email, uuid}).onConflict('email').merge();

        res.cookie('session', JSON.stringify({email, uuid}),{
            httpOnly: true,
            expires : new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)),
            sameSite : 'none',
            secure : true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({error : 'An error occured while trying to verify user'});
    };
    res.status(200).json({
        ...user
    });
};
