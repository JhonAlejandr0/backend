// Looking to send emails in production? Check out our Email API/SMTP product!
import nodemailer from "nodemailer";
process.loadEnvFile();
const config = () => {
  return {
    host: process.env.STMP_HOST,
    port: +process.env.STMP_PORT,
    secure: true,
    auth: {
      user: process.env.STMP_USER,
      pass: process.env.STMP_PASS,
    },
  };
};

export const transporter = nodemailer.createTransport(config());
