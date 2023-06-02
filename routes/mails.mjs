import express from "express";
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    host: "smtp.gmail.com",
    auth: {
        user: 'task.hub7@gmail.com',
        pass: 'RIRA14pauy$c',
    },
    secure: true,
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
            return console.log(err);
        }
        res.send({message: "Mail send", message_id: info.message_id}).status(200);
    });
});

export default router
