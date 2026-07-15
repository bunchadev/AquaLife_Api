import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD
  }
})

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"AquaLife" <${env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  }

  return await transporter.sendMail(mailOptions)
}

export const EmailProvider = {
  sendEmail
}
