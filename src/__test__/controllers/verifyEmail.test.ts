import db from "../../dbConfig/dbConfig";
import verifyEmail from "../../controllers/users/verifyEmail";

import { Request, Response } from "express";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementationOnce(() => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        first : jest.fn().mockResolvedValue({email : 'test@example.com'})
    }))
    .mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        update : jest.fn().mockResolvedValue(1),
        insert: jest.fn().mockReturnThis(),
        onConflict : jest.fn().mockReturnThis(),
        merge : jest.fn()
    }))
});

afterAll(() => {
    jest.clearAllMocks();
});

test("verifies user's email", async() => {
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
        cookie : jest.fn(),
        clearCookie : jest.fn()
    } as unknown as Response;

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.clearCookie).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({email : 'test@example.com'});
});

test("checks for incorrect codes", async() => {
    let req, res;
    req = {
        body : {
            email : 'test@example.com',
            code : '12345'
        },
        cookies : {
            user : '12345'
        }
    } as unknown as Request;
    res = {
        redirect : jest.fn(),
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    } as unknown as Response;

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message : 'Incorrect code'});
});

test("checks if user exist", async() => {
    (db as unknown as jest.Mock).mockImplementationOnce(() => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        first : jest.fn().mockResolvedValue(null)
    }))
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
        redirect : jest.fn()
    } as unknown as Response;

    await verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(303, '/');
});
