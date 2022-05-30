import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from "dotenv";
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {AuthorizationBindings, AuthorizationComponent} from 'loopback4-authorization';
import path from 'path';
import {LoggerComponent} from './components/logger.component';
import {TokenMiddleware} from './middleware/token.middleware';
import {BearerTokenVerifyProvider} from './providers/bearer-verifier.provider';
import {TestProvider} from './providers/test-provider.providers';
import {MySequence} from './sequence';


export {ApplicationConfig};


export class LoopbackRestApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    super(options);

    this.middleware(TokenMiddleware);
    this.bind('test.provider').toProvider(TestProvider);
    this.bind('test.date').toDynamicValue(() => new Date().toString());

    // Set up the custom sequence
    this.sequence(MySequence);
    this.component(LoggerComponent);

    this.component(AuthenticationComponent);

    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider
    );

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer', '/auth/login', '/auth/signup']
    });
    this.component(AuthorizationComponent);


    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/docs',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
