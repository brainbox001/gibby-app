import { Request, Response } from "express";
import { encryptDecrypt } from "./register";
import db from "../../dbConfig/dbConfig";
import { v4 as uuidv4 } from 'uuid';

interface User {
    firstName : string;
    lastName : string;
    email : string;
}

async function verifyEmail(req:Request, res:Response) {
    const {code, email} = req.body;
    if(!code || !email) return res.status(400).json({message : 'code not provided'});
    const cookie = req.cookies.user;
    if(!cookie) return res.redirect(307, '/login');
    const decrypted = await encryptDecrypt(code);
    if (cookie !== decrypted) return res.status(400).json({message : 'Incorrect code'});
    let user : User;
    try {
        const userExists  = await db('users').where({email}).first();
        if(!userExists) return res.redirect(303, '/');
        user = await db('users').update({emailIsVerified : true}).select('firstName', 'lastName', 'email');

        const uuid = uuidv4();
        await db('session').insert({email, uuid}).onConflict().merge();

        res.clearCookie('user',{
            httpOnly: true
        });

        res.cookie('session', uuid,{
            httpOnly: true,
            expires : new Date(Date.now() + (60 * 60 * 24 * 7 * 1000))
        });

    } catch (error) {
        return res.status(500).json({error : 'An error occured while trying to verify user'});
    };
    res.status(200).json({
        ...user
    });
};
