import {Interceptor, InvocationContext, Next} from '@loopback/core';

export const log: Interceptor = async (invokationCtx: InvocationContext, next: Next) => {
  console.log('Log Interceptor Start -', invokationCtx.methodName);
  try {
    const result = await next();
    console.log('Log Interceptor End -', invokationCtx.methodName);
    return result;
  } catch (error) {
    console.log('Log Interceptor Error -', invokationCtx.methodName);
    throw error;
  }
}
