import db from "../../dbConfig/dbConfig";
import login from "../../controllers/users/login";
import mailObj from "../../controllers/users/sendMail";
import { Request, Response } from "express";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementationOnce(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue({password : 'string 123', emailIsVerified : true})
    }))
    .mockImplementationOnce(() => ({
        insert: jest.fn().mockReturnThis(),
        onConflict : jest.fn().mockReturnThis(),
        merge : jest.fn()
    }))
    .mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue({password : 'string 123', emailIsVerified : false})
    }));
});

afterAll(() => {
    jest.clearAllMocks();
});

test('can login a verified user', async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
            password : 'string 123'
        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        cookie : jest.fn()
    } as unknown as Response;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({emailIsVerified : true});
});

test('prompts unverified users to verify their email if they have the cookie', async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
            password : 'string 123'
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

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(100);
    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({message : 'verify your email'});
});

test('sends a verification code for unverified users without a cookie', async() => {
    const sendMailSpy = jest.spyOn(mailObj, 'sendMail').mockResolvedValue('12345');

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

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(100);
    expect(res.cookie).toHaveBeenCalled();
    expect(sendMailSpy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({message : 'verify your email'});
});

test('rejects request with incorrect password', async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
            password : 'string 12'
        },
        cookies : {
        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        cookie : jest.fn()
    } as unknown as Response;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error : 'Incorrect email or password'});
});
