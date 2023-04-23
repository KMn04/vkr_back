import express from "express";
import { Users } from "../models/Users.mjs";

const router = express.Router();

router.post("/register", (req, res,err) => {
    const allUsers = Users.findAll();
    //проверка по логину что пользователя нет
    if(allUsers.login.includes(req.body.login)){
        const err = new Error("Такой пользователь уже зарегистрирован");
        err.status = 400;
        throw err;
    }
    //добавить пользователя с указанными логин/пароль
    const new_user = {
        login: req.body.login,
        passqord: req.body.login
    };
    db
        .add('users', new_user)
        .then((results)=>{
            res.json({
                message: 'Пользователь добавлен'
            })
        })
    //добавить проверку повторением пароля
});

export default router