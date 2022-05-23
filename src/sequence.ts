import {inject} from '@loopback/core';
import {MiddlewareSequence, RequestContext, RestBindings} from '@loopback/rest';
import {Logger} from 'winston';
import {LoggerComponentKeys} from './components/logger.component';

export class MySequence extends MiddlewareSequence {
  @inject(LoggerComponentKeys.LOGGER.key)
  private logger: Logger;
  async handle(context: RequestContext): Promise<void> {
    const req = await context.get(RestBindings.Http.REQUEST);
    const res = await context.get(RestBindings.Http.RESPONSE);

    console.log("-----------------------------------");

    const start: any = new Date();
    console.log("Log request start time:", start);
    console.log("Referer:", req.headers.referer);
    console.log("User-Agent:", req.headers['user-agent'])
    console.log("Request IP:", req.ip)

    // if (process.env.ALLOWED_ORIGIN !== req.headers.origin) {
    //   res.status(400).send({statusCode: 400, message: "Bad request"});
    //   console.log("Error time:", new Date());
    // } else {
    await super.handle(context);
    // }
    const end: any = new Date();
    console.log("Completion time:", end);
    console.log("-----------------------------------");

    this.logger.log("info", `${req.method} ${req.url}`)

  }

}
