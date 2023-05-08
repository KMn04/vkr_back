import express from "express";
import { Users } from "../models/Users.mjs";
import jwt from 'jsonwebtoken'
import {jwtConstants} from '../constants.mjs'

const router = express.Router();

// аутентификация + авторизация
router.post("/", async (req, res) => {
    const user_login = await Users.findOne({
        where: {
            login: req.body.login,
            password: req.body.password
        }
    });
    //проверка по логину что пользователь есть
    if(!user_login){
        const err = new Error("Такой пользователь не зарегистрирован");
        res.status(400);
        res.send(err).status(400);
    }
    const payload = {login: user_login.login};
    res.send({token: jwt.sign(payload, jwtConstants.secret )})
});

export default router