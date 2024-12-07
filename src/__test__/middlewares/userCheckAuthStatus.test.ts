import { Request, Response, NextFunction } from "express";

import { checkAuthStatus } from "../../middlewares/userCheckAuthStatus";

afterAll(() => {
    jest.clearAllMocks();
});

test('calls next function for unauthenticated user request from the frontend', async() => {
    let req, res, next;
    req = {
        headers : {
            "user-agent" : "gibby-frontend"
        },
        isAuthenticated : false
    } as unknown as Request;
    res = {
        redirect : jest.fn()
    } as unknown as Response;
    next = jest.fn();
    await checkAuthStatus(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
});

test('redirects an authenticated user', async() => {
    let req, res, next;
    req = {
        headers : {
            "user-agent" : "gibby-frontend"
        },
        isAuthenticated : true
    } as unknown as Request;
    res = {
        redirect : jest.fn()
    } as unknown as Response;
    next = jest.fn();
    await checkAuthStatus(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(303, '/');
});

test('redirects a request not coming from the frontend', async() => {
    let req, res, next;
    req = {
        headers : {
            
        },
        isAuthenticated : true
    } as unknown as Request;
    res = {
        redirect : jest.fn()
    } as unknown as Response;
    next = jest.fn();
    await checkAuthStatus(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalled();
});

test('redirects a request with wrong user agent', async() => {
    let req, res, next;
    req = {
        headers : {
           "user-agent" : "my-user"
        },
        isAuthenticated : true
    } as unknown as Request;
    res = {
        redirect : jest.fn()
    } as unknown as Response;
    next = jest.fn();
    await checkAuthStatus(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(303, '/');
});
