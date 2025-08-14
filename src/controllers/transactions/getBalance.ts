import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

async function getBalance(req:Request, res:Response) : Promise<any> {

    const {sender_id} = req.query;
  
    let balance : number;
    try {
        balance = await db('users').where({sender_id}).first().select("balance");

        if (!balance) return res.status(404).json({error: "Can't find your balance"});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error : "An error occured, don't panic, it's not your fault"})
    };
    res.status(200).json(balance);
};
export default getBalance;
