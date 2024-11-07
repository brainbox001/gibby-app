import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "momsdboy@gmail.com",
      pass: "one-time-password",
    },
  });

export default async function sendMail(email:string, firstName:string) {
    let code = '';
    for (let i = 0; i< 6; i++) {
        let generated = Math.floor(Math.random() *10)
       code += generated
    }
    await transporter.sendMail({
        from: '"Novel-app" <momsdboy@gmail.com>',
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
