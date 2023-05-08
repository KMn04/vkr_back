import express from "express";
import { Users } from "../models/Users.mjs";
import jwt from 'jsonwebtoken'
import {jwtConstants} from '../constants.mjs'

const router = express.Router();

// регистрация
router.post("/", async (req, res) => {
    const user_login = await Users.findOne({
        where: {login: req.body.login}});
    console.log(user_login)
    //проверка по логину что пользователя нет
    if(user_login){
        const err = new Error("Такой пользователь уже зарегистрирован");
        err.status = 400;
        res.send(err).status(400);
        return;
    }
    const user_email= await Users.findOne({
        where: {email: req.body.email}});
    console.log(user_email)
    //проверка что почта не использовалась ранее
    if(user_email){
        const err = new Error("Пользователь с такой почтой уже зарегистрирован");
        err.status = 400;
        res.send(err).status(400);
        return;
    }
    //добавить пользователя с указанными логин/пароль
    const new_user = {
        login: req.body.login,
        password: req.body.password,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        email: req.body.email,
    };
    const user = await Users.create(new_user)
    const payload = {login: user.login};
    res.send({token: jwt.sign(payload, jwtConstants.secret )})
});

export default router