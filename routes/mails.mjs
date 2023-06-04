import express from "express";
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.mail.ru",
    auth: {
        user: 'task.hub@mail.ru',
        pass: 'ymgcckBzLrJtgeqRGfbP'
    },
});

router.post("/", async(req, res) => {
    const { to, subject, text } = req.body;
    const mailData = {
        from: 'task.hub@mail.ru',
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
