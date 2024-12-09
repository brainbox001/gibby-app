import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "momsdboy@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

interface MailObj{
  sendMail : (email : string, firstName : string) => Promise<string> 
};

const  mailObj : MailObj  = {
  sendMail
};

async function sendMail(email:string, firstName:string) : Promise<string>{
    let code = '';
    for (let i = 0; i< 6; i++) {
        let generated = Math.floor(Math.random() *9) + 1;
       code += generated
    }
    await transporter.sendMail({
        from: '"Gibby" <momsdboy@gmail.com>',
        to: email, 
        subject: "User verification code",
        html: `
        <p>Dear ${firstName}, your verification code is;</p>
        <h2>${code}</h2>
        <br />
        <b> This code expires in 5 minutes</b>
        `,
      });
      return code;
};
export default mailObj;
