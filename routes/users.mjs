import express from 'express';
import {User} from "../models/User.mjs";

// каскадное удаление проектов, перевод задач на автора задачи

const router = express.Router();

router.get("/allUsers", async (req, res) => {
    const allUsers = await User.findAll({
        where: {
            deletedAt: null
        },
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
        },
        raw: true
    })
    res.send(allUsers)
})

// получение информации о пользователе
router.get("/", async (req, res) => {
    const user = await User.findOne({
        where: {
            userId: req.body.user.userId,
            deletedAt: null
        }
    });
    if (user){
        const preparedResult = {
            userId: req.body.user.userId,
            secondName: user.secondName,
            firstName: user.firstName,
            middleName: user.thirdName ?? '',
            login: user.login,
            email: user.email
        };
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("Такого пользователя не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

// создание пользователя происходит при регистрации

// обновление информации о пользователе
router.put("/", async (req, res) => {
    const userInfo = await User.findOne({
        where: {
            userId: req.body.user.userId,
            deletedAt: null
        }
    });
    if (userInfo){
        const {user, ...newBody} = req.body;
        await userInfo.update(newBody);
        await userInfo.save();
        const preparedResult = {
            userId: req.body.user.userId,
            secondName: userInfo.secondName,
            name: userInfo.firstName,
            middleName: userInfo.thirdName ?? '',
            login: userInfo.login,
            email: userInfo.email
        };
        res.send(preparedResult).status(200);
    }
    else {
        const err = new Error("Такого пользователя не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

// удаление аккаунта
router.delete("/", async (req, res) => {
    const user = await User.findOne({
        where: {
            userId: req.body.user.userId,
            deletedAt: null
        }
    });
    if (user){
        await user.update({
            deletedAt: Date.now()
            // авто логаут
        });
        res.send().status(200);
    }
    else {
        const err = new Error("Такого пользователя не существует");
        res.status(400);
        res.send(err).status(400);
    }
});

export default router