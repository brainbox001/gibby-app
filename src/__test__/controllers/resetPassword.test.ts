import db from "../../dbConfig/dbConfig";
import resetPassword from "../../controllers/users/resetPassword";
import mailObj from "../../controllers/users/sendMail";
import { Request, Response } from "express";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue({password : 'string 123'}),
        update : jest.fn().mockResolvedValue(1)
    }));
});

afterAll(() => {
    jest.clearAllMocks();
});

test('initial request for password reset 1', async() => {
    const sendMailSpy = jest.spyOn(mailObj, 'sendMail').mockResolvedValue('12345');

    let req, res;
    req = {
        body : {
            email : 'test@example.com',
        },
        cookies : {
        
        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        cookie : jest.fn()
    } as unknown as Response;

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(100);
    expect(res.cookie).toHaveBeenCalled();
    expect(sendMailSpy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({message : 'check your mail for a verification code'});
});

test('initial request for password reset 2', async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
        },
        cookies : {
            user : '12345'
        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        cookie : jest.fn()
    } as unknown as Response;

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(100);
    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({message : 'check your mail for a verification code'});
});

test('verifies correct code', async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
            code : '12345'
        },
        cookies : {
            user : '67890'
        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        cookie : jest.fn()
    } as unknown as Response;

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(102);
    expect(res.json).toHaveBeenCalledWith({message : 'set new password'});
});

test("checks if user didn't repeat former password", async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
            password : 'string 123'
        },
        cookies : {

        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        cookie : jest.fn()
    } as unknown as Response;

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message : 'password must be different from the previous'});
});

test("updates the user's password with the new one", async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
            password : 'string 125'
        },
        cookies : {

        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        cookie : jest.fn()
    } as unknown as Response;

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({message : 'password updated'});
});
