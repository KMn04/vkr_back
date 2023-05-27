import express from "express";
import { User } from "../models/User.mjs";
import jwt from 'jsonwebtoken'
import {jwtConstants} from '../constants.mjs'
import { hashSync, genSaltSync} from 'bcrypt'
import UserToken from "../models/UserToken.mjs";

const router = express.Router();

// регистрация
router.post("/", async (req, res) => {
    const user_login = await User.findOne({
        where: {login: req.body.login}
    });
    console.log(user_login)
    //проверка по логину что пользователя нет
    if(user_login){
        const err = new Error("Такой пользователь уже зарегистрирован");
        res.status(400);
        res.send(err).status(400);
        return;
    }
    const user_email= await User.findOne({
        where: {email: req.body.email}
    });
    console.log(user_email)
    //проверка что почта не использовалась ранее
    if(user_email){
        const err = new Error("Пользователь с такой почтой уже зарегистрирован");
        res.status(400).send(err);
        return;
    }
    const passwordSalt = await genSaltSync(jwtConstants.saltNumber)
    //добавить пользователя с указанными логин/пароль
    const hashedPassword = hashSync(req.body.password, passwordSalt);
    const new_user = {
        login: req.body.login,
        password: hashedPassword,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        email: req.body.email,
    };
    const user = await User.create(new_user)
    const payload = {login: user.login};

    const accessToken = jwt.sign(payload, jwtConstants.secret, {expiresIn: '14m'});
    const refreshToken = jwt.sign(payload, jwtConstants.secret, {expiresIn: '30d'});

    const userToken = await UserToken.findOne({userId: user.userId});
    if(userToken){
        await userToken.remove();
    }

    await new UserToken({userId: user.userId, token: refreshToken}).save();

    res.send({token: accessToken, refreshToken})
});

export default router