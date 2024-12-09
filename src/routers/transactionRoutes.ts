import express from 'express';
import newDeposit from '../controllers/transactions/newDeposit';
import verifyPayment from '../controllers/transactions/payStackVerify';
import getSavings from '../controllers/transactions/getSavings';
import getTransactions from '../controllers/transactions/getTransactions';

const transactionRoutes = express.Router();

transactionRoutes.get('/', getTransactions);
transactionRoutes.get('/savings', getSavings);
transactionRoutes.post('/pay', newDeposit);
transactionRoutes.post('/verify', verifyPayment);

 export default transactionRoutes;
