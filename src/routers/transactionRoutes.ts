import express from 'express';
import newDeposit from '../controllers/transactions/newDeposit';
import verifyPayment from '../controllers/transactions/payStackVerify';
import getSavings from '../controllers/transactions/getSavings';
import getTransactions from '../controllers/transactions/getTransactions';
import getBalance from '../controllers/transactions/getBalance';
import connect_telegram from '../controllers/users/connect_telegram';
import transfer from '../controllers/transactions/transfer';
import cors from 'cors';

const transactionRoutes = express.Router();

// transactionRoutes.use(cors({
//   origin: 'https://gibby-frontend.onrender.com',
//   credentials: true,
// }));

transactionRoutes.get('/', getTransactions);
transactionRoutes.get('/savings', getSavings);
transactionRoutes.get('/balance', getBalance);
transactionRoutes.post('/pay', newDeposit);
transactionRoutes.post('/verify', verifyPayment);
transactionRoutes.post('/transfer', transfer);
transactionRoutes.post('/connect_telegram', connect_telegram);

 export default transactionRoutes;
