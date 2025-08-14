import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";


export default async function connect_telegram(req:Request, res:Response) : Promise<any> {
    const body = req.body;
    const {sender_id, user_id } = body;

    if (!sender_id || !user_id) return res.status(400).json({error : 'Invalid credentials provided'});
    let user : any
    try {
        user = await db('users').where({id : parseInt(user_id)}).first().select('id');

        // console.log('user found', user);

        if(!user) return res.status(400).json({error : 'User not found'});

        await db('users').where({id : parseInt(user_id)}).first().update({sender_id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : 'An error occured while trying to login user'});
    };

    res.status(200).json({ message: { sender_id} });
};
