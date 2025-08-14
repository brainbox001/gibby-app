import express, { Request, Response, NextFunction } from "express";
import { setAuthStatus } from "./middlewares/setAuthStatus";
import cookieParser from "cookie-parser";
import userRoutes from "./routers/userRoutes";
import cors from 'cors';
import transactionRoutes from "./routers/transactionRoutes";

const app = express();
const port = 3001;

app.use(cors({
  origin: 'https://gibby-frontend.onrender',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(setAuthStatus);

app.get('/', (req, res) => {
  const userAgent = req.headers["user-agent"];
  res.status(200).json({message : `welcome to gibby ${userAgent}`});
});

app.use('/user', userRoutes);
app.use('/transaction', transactionRoutes);

app.use((err: any, req:Request, res:Response, next:NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});
