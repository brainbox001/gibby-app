import { Request, Response } from "express";
import logout from "../../controllers/users/logout";

afterAll(() => {
    jest.clearAllMocks();
});

test('can logout user', async() => {

    let req, res;
    req = {
        cookies : {
            session : '12fjr4-fnnrn4nd-sjj4'
        }
    } as unknown as Request;
    res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn(),
        clearCookie : jest.fn()
    } as unknown as Response;

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.clearCookie).toHaveBeenCalledWith('session', {
            httpOnly: true
        });
    expect(res.json).toHaveBeenCalledWith({message: 'Logout successful'});
});

test("returns a redirect if user wasn't logged in", async() => {

    let req, res;
    req = {
        cookies : {
            
        }
    } as unknown as Request;
    res = {
        redirect : jest.fn()
    } as unknown as Response;

    await logout(req, res);

    expect(res.redirect).toHaveBeenCalledWith(303, '/');
});
