import express from "express";
import nodemailer from 'nodemailer';

const router = express.Router();
const nodemailer = nodemailer();

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

transporter.sendMail(mailOptions,  (err, info) => {
    if(err)
        console.log(err)
    else
        console.log(info);
});

router.post("/mail", async(req, res) => {
    const { to, subject, text } = req.body;
    const mailData = {
        from: 'task.hub7@gmail.com',
        to: to,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions,  (err, info) => {
        if (err) {
            return console.log(err);
        }
        res.send({message: "Mail send", message_id: info.message_id}).status(200);
    });
});

export default router
