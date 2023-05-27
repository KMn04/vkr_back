import express from "express";
import { User } from "../models/User.mjs";
import jwt from 'jsonwebtoken'
import {jwtConstants} from '../constants.mjs'
import {compare} from 'bcrypt';
import UserToken from '../models/UserToken.mjs'

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

        const accessToken = jwt.sign(payload, jwtConstants.secret, {expiresIn: '14m'} )
        const refreshToken = jwt.sign(payload, jwtConstants.secret, {expiresIn: '30d'});

        const userToken = await UserToken.findOne({userId: user_login.dataValues.userId});
        if(userToken){
            await userToken.remove();
        }

        await new UserToken({userId: user_login.dataValues.userId, token: refreshToken}).save();

        res.send({token:accessToken, refreshToken })
    }else{
        res.status(403).send('Пароль не совпадает')
    }
    
});

export default router