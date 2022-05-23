import {Middleware, MiddlewareContext} from '@loopback/rest';
import * as jwt from "jsonwebtoken";

export const TokenMiddleware: Middleware = async (middlewareCtx: MiddlewareContext, next: any) => {

  const {request, response} = middlewareCtx;
  const user_id = request.headers?.cookie?.split(";").find(c => c.includes("user_id"))?.split('=')[1];

  if (user_id) {
    const token = jwt.sign({user_id: user_id}, 'secret');
    request.headers.authorization = `Bearer ${token}`;
  }

  return await next();


}
