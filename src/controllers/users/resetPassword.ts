import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";
import mailObj from "./sendMail";
import { encryptDecrypt } from "./register";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  password?: string;
}

export default async function resetPassword(
  req: Request,
  res: Response
): Promise<any> {
  const { email, isVerified, password } = req.body;
  if (!email) return res.status(400).json({ message: "invalid credentials" });

  let user: User;
  try {
    user = await db("users")
      .where({ email })
      .first()
      .select("firstName", "lastName", "email", "password");
    if (!user) return res.status(404).json({ message: "user not found" });

    const cookie = req.cookies.user;

    if (!isVerified) {
      if (!cookie) {
        const sentCode = await mailObj.sendMail(email, user.firstName);
        const encrypted = await encryptDecrypt(sentCode);

        res.cookie("user", encrypted, {
          httpOnly: true,
          expires: new Date(Date.now() + 5 * 60 * 1000),
          sameSite : 'none',
          secure : true
        });
      };
      return res
        .status(210)
        .json({ message: "check your mail for a verification code" });
    }

    if (isVerified && !!password) {
      if (password === user.password)
        return res
          .status(400)
          .json({ message: "password must be different from the previous" });

      await db("users").where({ email }).first().update({ password });
    };

  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "An error occured while trying to reset password" });
  }

  res.status(200).json({ message: "password updated" });
};
