import db from "../../dbConfig/dbConfig";
import register from "../../controllers/users/register";
import mailObj from "../../controllers/users/sendMail";
import { encryptDecrypt } from "../../controllers/users/register";
import { Request, Response } from "express";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementationOnce(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        count : jest.fn().mockResolvedValue(0)
    }))
    .mockImplementationOnce(() => ({
        insert: jest.fn().mockResolvedValue(true),
    }))
    .mockImplementation(() => ({
        insert: jest.fn().mockResolvedValue(true),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        count : jest.fn().mockResolvedValue(1)
    }));
});

const sendMailSpy = jest.spyOn(mailObj, 'sendMail').mockResolvedValue('12345');

afterAll(() => {
    jest.clearAllMocks();
});

test('can register new users successfully', async () => {

    let req: Request, res: Response;
    const firstName : string = 'tested';
    const lastName : string = 'last';
    const email : string = 'test@example.com';
    const password : string = 'string123';

    req = {
        body : {
            firstName,
            lastName,
            email,
            password,
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(sendMailSpy).toHaveBeenCalled();
});

test('returns an error message if user with email already exists', async () => {

    let req: Request, res: Response;
    const firstName : string = 'tested';
    const lastName : string = 'last';
    const email : string = 'test@example.com';
    const password : string = 'string123';

    req = {
        body : {
            firstName,
            lastName,
            email,
            password,
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error : 'User with email address already exists'});
});

describe('testing encrypting and decrypting code', () => {
    it('can encrypt code', async() => {
        let code = '12345';
        let encrypted = await encryptDecrypt(code);
        expect (encrypted).toBe('67890');
    });

    it('can decrypt code', async() => {
        let code = '67890';
        let encrypted = await encryptDecrypt(code);
        expect (encrypted).toBe('12345');
    });
});
