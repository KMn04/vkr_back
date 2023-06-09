import jwt from 'jsonwebtoken';
import { jwtConstants } from '../constants.mjs';
import {User} from '../models/User.mjs'

export const checkJWTMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization
  if(!token){
    res.status(401)
    res.send('not authorized')
    return;
  }
  try{
    const payload = jwt.verify(token, jwtConstants.secret);
    const userLogin = await User.findOne({
      where: {
        login: payload.login
      },
      raw: true
    })
    if(!userLogin){
      throw ''
    }
    
    req.body.user = userLogin
  }catch{
    res.status(401);
    res.send('not authorized');
    return;
  }
  next()
}