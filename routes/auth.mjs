import express from "express";
import { User } from "../models/User.mjs";
import jwt from 'jsonwebtoken'
import {jwtConstants} from '../constants.mjs'
import {hashSync, compare} from 'bcrypt'

const router = express.Router();

// аутентификация + авторизация
router.post("/", async (req, res) => {
    const user_login = await User.findOne({
        where: {
            login: req.body.login,
        }
    });

    //проверка по логину что пользователь есть
    if(!user_login){
        res.status(401).send("Такой пользователь не зарегистрирован");
        return;
    }
    if(compare(user_login.dataValues.password, req.body.password)){
        // добавить вывод ошибки, что пароль неверный
        const payload = {login: user_login.login};
        res.send({token: jwt.sign(payload, jwtConstants.secret )})
    }else{
        res.status(403).send('Пароль не совпадает')
    }
    
});

export default router