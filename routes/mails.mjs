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
    if (req.body.type < 6) { // проекты
        const projectId = req.body.id;
        const allNotif = await Notification.find({id: projectId})
    } else if (req.body.type > 5) { // задачи
        const taskId = req.body.id;
    }
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
        res.send({message: "Email sent", message_id: info.message_id}).status(200);
    });
});

export default router
