import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import initializePayment from "./payStackInit";

async function newDeposit (req:Request, res:Response) : Promise<any> {
    const body = req.body;
	let {target, startAmount, goal, duration, add, _transRef} = body;
	const session = req.cookies.session;
    if(!session) return res.status(400).json({error : 'Bad request'});
    const {email} = JSON.parse(session);
    const uuid = uuidv4();

    let callback : string;

    if(add && _transRef) {
        callback = `https://gibby-frontend.onrender.com/trans/verify?startAmount=${startAmount}&goal=${encodeURIComponent(goal)}&email=${email}&_transRef=${_transRef}&add=${add}`;
    }
    else {
        if(!startAmount || !target || !duration || !goal) return res.status(400).json({error : 'Bad request'});

     callback = `https://gibby-frontend.onrender.com/trans/verify?target=${target}&startAmount=${startAmount}&duration=${duration}&goal=${encodeURIComponent(goal)}&email=${email}`;
    };
    
    const response = await initializePayment(email, startAmount, callback, uuid);
    res.status(response.status).json(response.data)
};

export default newDeposit;
