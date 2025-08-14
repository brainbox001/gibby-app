import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

async function transfer(req:Request, res:Response) : Promise<any> {

    const {amount, sender_id} = req.body;

    let balance : {balance: number};
  
    try {
        balance = await db('users').where({sender_id}).first().select("balance");
        
        if (amount > balance.balance) return res.status(400).json({error : 'Insufficient Funds'});
        const newBalance = balance.balance - amount;
        balance = await db('users').where({sender_id}).first().update({balance : newBalance});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error : "An error occured, don't panic, it's not your fault"})
    };
    res.status(200).json(balance);
};
export default transfer;