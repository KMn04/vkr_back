import express from "express";
import { User } from "../models/User.mjs";
import jwt from 'jsonwebtoken'
import {jwtConstants} from '../constants.mjs'

const router = express.Router();

// регистрация
router.post("/", async (req, res) => {
    const user_login = await User.findOne({
        where: {login: req.body.login}});
    console.log(user_login)
    //проверка по логину что пользователя нет
    if(user_login){
        const err = new Error("Такой пользователь уже зарегистрирован");
        res.status(400);
        res.send(err).status(400);
        return;
    }
    const user_email= await User.findOne({
        where: {email: req.body.email}});
    console.log(user_email)
    //проверка что почта не использовалась ранее
    if(user_email){
        const err = new Error("Пользователь с такой почтой уже зарегистрирован");
        res.status(400);
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
    const user = await User.create(new_user)
    const payload = {login: user.login};
    res.send({token: jwt.sign(payload, jwtConstants.secret )})
});

export default router