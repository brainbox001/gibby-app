import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

export default async function verifyPayment(req: Request, res: Response): Promise<any> {
	const body = req.body;
	let { target, startAmount, reference, goal, duration, add, email, _transRef } = body;
	console.log('verifify paymeny received');

	if (!startAmount || !reference || !goal || !email) return res.status(400).json({ error: 'Incomplete request' });

	const transaction = await db('transactions').where({ reference }).first();
	if (transaction) return res.status(319).json({ error: 'redirect transaction already completed' });

	const status = await verify(reference);

	if (!status.status) return res.status(400).json({ error: 'Request could not be completed' });
	startAmount = parseInt(startAmount);

	if (add && _transRef) {
		const currAmount = await db('transactions').where({ sender : email, reference : _transRef }).first().select('startAmount');
		const amount = currAmount.startAmount + startAmount;
		const userBalance = await db('users').where({ email }).first().select('balance');
		const balance = userBalance.balance + startAmount;
		if (userBalance) await db('users').where({ email }).first().update({ balance });
		if (currAmount) await db('transactions').where({ sender : email, reference : _transRef }).first().update({ startAmount: amount });
		return res.status(200).json({ message: 'payment completed' });
	};

	if (!target || !duration) return res.status(400).json({ error: 'Incomplete request' });

	duration = parseInt(duration);
	target = parseInt(target);

	const newTransaction = {
		goal,
		sender: email,
		transType: 'credit',
		reference,
		target,
		startAmount,
		duration: Date.now() + duration,
		created_at: new Date(),
		updated_at: new Date()
	};

	await db('transactions').insert(newTransaction);
	const userBalance = await db('users').where({ email }).first().select('balance');
	const balance = userBalance.balance + startAmount;
	if (userBalance) await db('users').where({ email }).first().update({ balance });
	console.log('verify payment - ', res.getHeaders())
	res.status(200).json({ message: 'payment completed' });
};

async function verify(reference: string) {
	const config = {
		method: "get",
		url: `https://api.paystack.co/transaction/verify/${reference}`,
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_TOKEN}`,
			"Content-Type": "application/json",
		},
	};
	let data: any;
	try {
		const response = await axios(config);
		data = response.data;
		return { status: data.status, data }
	} catch (error: any) {

		return { status: 400, data: { error: 'Request could not be completed' } };
	}
};
