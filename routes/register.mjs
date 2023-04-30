import express from "express";
import { Users } from "../models/Users.mjs";
import jwt from 'jsonwebtoken'
import {jwtConstants} from '../constants.mjs'


const router = express.Router();

router.post("/", async (req, res) => {
    const user_login = await Users.findOne({
        where: {login: req.body.login}});
    console.log(user_login)
    //проверка по логину что пользователя нет
    if(user_login){
        const err = new Error("Такой пользователь уже зарегистрирован");
        err.status = 400;
        res.send(err)
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
    //добавить проверку повторением пароля
});

router.post("/login", async (req, res) => {
    const user_login = await Users.findOne({
        where: {
            login: req.body.login, 
            password: req.body.password
        }
    });
    //проверка по логину что пользователя нет
    if(!user_login){
        const err = new Error("Такой пользователь не существует");
        res.send(err).status(400);
    }
    const payload = {login: user_login.login};
    res.send({token: jwt.sign(payload, jwtConstants.secret )})
    //добавить проверку повторением пароля
});

export default router