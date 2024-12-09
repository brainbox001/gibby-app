import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";
import mailObj from "./sendMail";

interface Body {
    firstName : string;
    lastName : string;
    email : string;
    password : string;   
}

export default async function register(req:Request, res:Response) : Promise<any> {
    const body : Body = req.body;
    let {firstName, lastName, email, password} = body;
    if (!firstName || !lastName || !email || !password) return res.status(400).json({error : 'Invalid credentials provided'});
    
    let encrypted: string;
    try{

        let userExists = await db('users').where({ email }).first().count();
        userExists = typeof userExists['count'] === 'string' ? parseInt(userExists['count']) : userExists['count'];
        console.log(userExists);
        if(userExists) return res.status(400).json({error : 'User with email address already exists, login'});
        
        email = email.toLowerCase();
        const newUser = {
            firstName,
            lastName,
            email,
            emailIsVerified : false,
            password, // For the purpose of testing, passwords are not hashed
            created_at : new Date(),
            updated_at : new Date()
        };
        await db('users').insert(newUser);
        const code = await mailObj.sendMail(email, firstName);
        encrypted = await encryptDecrypt(code);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : 'An error occured while trying to signup user'});
    };

    res.cookie('user', encrypted, {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 60 * 1000),
        sameSite : 'none',
        secure : true
    });

    res.status(201).json({message: 'successfully registered, please verify your email', email});
};

export async function encryptDecrypt(code : string) {
    let crypted = '';
    const data = {
        '1' : '5',
        '2' : '6',
        '3' : '7',
        '4' : '8',
        '5' : '1',
        '6' : '2',
        '7' : '3',
        '8' : '4',
    };
    for (const char of code) {
        if(char in data) crypted += data[char as keyof typeof data];
        else crypted += char
    }
    return crypted;
};
