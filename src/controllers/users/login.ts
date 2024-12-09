import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";
import mailObj from "./sendMail";
import { encryptDecrypt } from "./register";
import { v4 as uuidv4 } from "uuid";

interface Body {
    email : string;
    password : string;
}

interface User {
    firstName : string;
    lastName : string;
    email : string;
    password? : string;
    emailIsVerified : boolean;
}

export default async function login(req:Request, res:Response) : Promise<any> {
    const body = req.body;
    const {email, password} = body;
    if (!email || !password) return res.status(400).json({error : 'Invalid credentials provided'});
    let user : User;
    try {
        user = await db('users').where({email}).first().select('firstName', 'lastName', 'email', 'password', 'emailIsVerified');

        if(!user || password !== user.password) return res.status(400).json({error : 'Incorrect email or password'});

        const isVerifified = user.emailIsVerified;
        if(!isVerifified){
            const cookie = req.cookies.user;
            if (!cookie) {
                const code = await mailObj.sendMail(email, user.firstName);
                const encrypted = await encryptDecrypt(code);
                res.cookie('user', encrypted, {
                    httpOnly : true,
                    expires: new Date(Date.now() + 5 * 60 * 1000),
                    sameSite : 'none',
                    secure : true
                });
            };
            return res.status(215).json({message : 'verify your email', email});
        };
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
        return res.status(500).json({error : 'An error occured while trying to login user'});
    };
    delete user.password;
    res.status(200).json({
        ...user
    });
};
