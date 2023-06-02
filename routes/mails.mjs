import express from "express";
import nodemailer, { createTestAccount } from 'nodemailer';

const router = express.Router();

const testAccount = await createTestAccount()

const transporter = nodemailer.createTransport({
    port: 587,
    host: "smtp.ethereal.email",
    auth: {
        user: testAccount.user,
        pass: testAccount.pass,
    },
    secure: false,
});

router.post("/", async(req, res) => {
    const { to, subject, text } = req.body;
    const mailData = {
        from: 'task.hub7@gmail.com',
        to: to,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailData,  (err, info) => {
        if (err) {
            res.status(400);
            return console.log(err);
        }
        res.send({message: "Mail send", message_id: info.message_id}).status(200);
    });
});

export default router
