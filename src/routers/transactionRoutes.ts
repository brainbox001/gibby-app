import express from 'express';
import newDeposit from '../controllers/transactions/newDeposit';
import verifyPayment from '../controllers/transactions/payStackVerify';
import getSavings from '../controllers/transactions/getSavings';
import getTransactions from '../controllers/transactions/getTransactions';
import cors from 'cors';

const transactionRoutes = express.Router();

transactionRoutes.use(cors({
  origin: 'https://gibby-frontend.onrender.com',
  credentials: true,
}));

transactionRoutes.get('/', getTransactions);
transactionRoutes.get('/savings', getSavings);
transactionRoutes.post('/pay', newDeposit);
transactionRoutes.post('/verify', verifyPayment);

 export default transactionRoutes;
