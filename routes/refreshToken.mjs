import express from "express";
import jwt from 'jsonwebtoken'
import UserToken from "../models/UserToken.mjs";
import { jwtConstants } from "../constants.mjs";

const router = express.Router();

// получить все возможные значения
router.post("/", async (req, res) => {
    const refreshToken = req.body.refreshToken;

    jwt.verify(refreshToken, jwtConstants.secret, (err, tokenDetails) => {
      if(err){
        res.status(400).send('Невалидный рефреш токен');
        return;
      }
      const payload = {login: tokenDetails.login};
      const accessToken = jwt.sign(payload, jwtConstants.secret, {expiresIn: '14m'})
      res.send({token: accessToken})
    })
});

router.delete("/", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  jwt.verify(refreshToken, jwtConstants.secret, async (err) => {
    if(err){
      res.status(400).send('Невалидный рефреш токен');
      return;
    }
   
    const userToken = await UserToken.findOneAndRemove({token: req.body.refreshToken});
    if (!userToken){ 
      return res.status(200).send({ 
        error: false, 
        message: "Logged Out Sucessfully" 
      })
    }
    res.status(200).send({ error: false, message: "Logged Out Sucessfully" });
  })
})

export default router