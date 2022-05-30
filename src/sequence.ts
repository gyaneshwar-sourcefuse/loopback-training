import {inject} from '@loopback/core';
import {FindRoute, HttpErrors, InvokeMethod, InvokeMiddleware, ParseParams, Reject, RequestContext, RestBindings, Send, SequenceHandler} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizationBindings, AuthorizeErrorKeys, AuthorizeFn} from 'loopback4-authorization';
import {Logger} from 'winston';
import {LoggerComponentKeys} from './components/logger.component';
import {Users} from './models';

export class MySequence implements SequenceHandler {

  @inject(RestBindings.SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false

  constructor(
    @inject(RestBindings.SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(RestBindings.SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(RestBindings.SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(RestBindings.SequenceActions.SEND) public send: Send,
    @inject(RestBindings.SequenceActions.REJECT) public reject: Reject,
    @inject(LoggerComponentKeys.LOGGER.key) private logger: Logger,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<Users>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn
  ) {

  }

  async handle(context: RequestContext): Promise<void> {
    const origins = process.env?.ALLOWED_ORIGIN?.split(",");

    try {
      const {request, response} = context;
      this.start(context);

      if (!origins?.includes(request?.headers?.referer ?? '')) {
        throw new Error('Origin not allowed')
      }

      const finished = await this.invokeMiddleware(context);
      if (finished) return;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);


      const authUser: Users = await this.authenticateRequest(request);

      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authUser?.role?.permissions ?? [],
        request
      );

      if (!isAccessAllowed) {
        this.logger.log('error', 'Not Allowed')
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      const result = await this.invoke(route, args);
      this.send(response, result);

      this.end();
    } catch (error) {
      this.error();
      this.reject(context, error);
    }

  }

  start(context: RequestContext) {
    this.logger.log('info', `Start time: ${new Date()}`);
    this.logger.log('info', `Referer: ${context.request.headers.referer}`);
    this.logger.log('info', `User-Agent: ${context.request.headers['user-agent']}`)
    this.logger.log('info', `IP: ${context.request.ip}`)
  }

  end() {
    this.logger.log('info', `End time: ${new Date()}`)
  }
  error() {
    this.logger.log('error', `Error time: ${new Date()}`)
  }

}
