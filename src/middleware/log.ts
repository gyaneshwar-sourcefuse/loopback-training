import {Next} from '@loopback/core';
import {Middleware, MiddlewareContext} from '@loopback/rest';

const log: Middleware = async (ctx: MiddlewareContext, next: Next) => {

  const req = ctx.request;

  console.log("Log request start time:", new Date());
  console.log("Referer:", req.headers.referer);
  console.log("User-Agent:", req.headers['user-agent'])
  console.log("Request IP", req.ip)

  return next();
}

export default log;
