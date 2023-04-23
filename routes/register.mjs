import express from "express";
import { Users } from "../models/Users.mjs";


const router = express.Router();

router.post("/register", async (req, res) => {
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
        password: req.body.password
    };
    await Users.create(new_user)
    res.send("ok")
    //добавить проверку повторением пароля
});

export default router