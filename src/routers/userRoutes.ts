import express from 'express';
import register from '../controllers/users/register';
import login from '../controllers/users/login';
import logout from '../controllers/users/logout';
import verifyEmail from '../controllers/users/verifyEmail';
import resetPassword from '../controllers/users/resetPassword';
import { checkAuthStatus } from '../middlewares/userCheckAuthStatus';

const userRoutes = express.Router();
userRoutes.use(express.json());

userRoutes.post('/logout', logout);

userRoutes.use(checkAuthStatus);

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.post('/verify-user', verifyEmail);
userRoutes.post('/user-password-reset', resetPassword);

export default userRoutes;
