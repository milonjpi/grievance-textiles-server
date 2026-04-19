/* eslint-disable no-console */
import nodemailer from 'nodemailer';

export const sendEmail = async (
  to: string[],
  cc: string[],
  bcc: string[],
  subject: string,
  html: string
) => {
  // Configure your SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // tls: {
    //   rejectUnauthorized: false, // ⚠️ only if needed
    // },
  });

  // ✅ Test connection once
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transporter.verify((error, success) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error('SMTP connection failed:', error);
    } else {
      console.log('SMTP server is ready to take messages!');
    }
  });

  // Email options
  const mailOptions = {
    from: `"Grievance Management System" <${process.env.SMTP_USER}>`,
    to: to.join(','),
    cc: cc?.length ? cc.join(',') : undefined,
    bcc: bcc?.length ? bcc.join(',') : undefined,
    subject,
    html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};
