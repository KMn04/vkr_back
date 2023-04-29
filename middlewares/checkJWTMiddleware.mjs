import jwt from 'jsonwebtoken';
import { jwtConstants } from '../constants.mjs';
import {Users} from '../models/Users.mjs'

export const checkJWTMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization
  if(!token){
    res.send('not authorized')
    return;
  }
  try{
    const payload = jwt.verify(token, jwtConstants.secret);
    const user_login = await Users.findOne({
      where: {
        login: payload.login
      },
      raw: true
    })
    if(!user_login){
      throw ''
    }
    
    req.body.user = user_login
  }catch{
    res.send('not authorized')
    return;
  }
  next()
}