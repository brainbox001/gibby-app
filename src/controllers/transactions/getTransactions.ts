import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

async function getTransactions(req:Request, res:Response) : Promise<any> {
    const session = req.cookies.session;
    if(!session) return res.status(315).json({message : 'redirect user, no session'});
    const {email} = JSON.parse(session);
    let transactions : any;
    try {
        transactions = await db('transactions').where({sender : email});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error : "An error occured, don't panic, it's not your fault"})
    };
    res.status(200).json(transactions);
};
export default getTransactions;
