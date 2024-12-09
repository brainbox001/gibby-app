import { Request, Response, NextFunction } from "express";
import db from "../../dbConfig/dbConfig";
import { setAuthStatus } from "../../middlewares/setAuthStatus";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({email : 'test@example.com', uuid : 'eyry34-hhh5yf-ngnn5'}),
    }))
});

afterAll(() => {
    jest.clearAllMocks();
});

test('set authentication of user to true', async() => {
    let req, res, next;
    req = {
        cookies : {
            session : JSON.stringify({email : 'test@example.com', uuid : 'eyry34-hhh5yf-ngnn5'})
        }
    } as unknown as Request;
    res = {

    } as unknown as Response;
    next = jest.fn();
    await setAuthStatus(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.isAuthenticated).toBe(true);
});

test('set authentication of user to false', async() => {
    let req, res, next;
    req = {
        cookies : {
            
        }
    } as unknown as Request;
    res = {

    } as unknown as Response;
    next = jest.fn();
    await setAuthStatus(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.isAuthenticated).toBe(false);
});

test('authentication of user remains false still', async() => {
    let req, res, next;
    req = {
        cookies : {
            session : JSON.stringify({uuid : 'eyry34-hhh5yf-ngnn5'})
        }
    } as unknown as Request;
    res = {

    } as unknown as Response;
    next = jest.fn();
    await setAuthStatus(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.isAuthenticated).toBe(false);
});

test('set authentication of user to false once again', async() => {
    let req, res, next;
    req = {
        cookies : {
            session : JSON.stringify({email : 'test@example.com',})
        }
    } as unknown as Request;
    res = {

    } as unknown as Response;
    next = jest.fn();
    await setAuthStatus(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.isAuthenticated).toBe(false);
});
