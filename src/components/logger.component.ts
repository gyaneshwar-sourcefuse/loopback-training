import {BindingKey, Component, Provider, ProviderMap} from '@loopback/core';
import winston, {createLogger, Logger, transports} from 'winston';

export class MyValueProvider implements Provider<Logger> {
  value() {
    return this.log();
  }

  log() {
    return createLogger({
      transports: new transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(info => {
            return `${info.level}: ${info.message}`;
          }),
        ),
      })
    })
  }
}


export namespace LoggerComponentKeys {
  export const LOGGER = BindingKey.create<LoggerComponent>('LoggingComponent.Logger');
}

export class LoggerComponent implements Component {
  providers?: ProviderMap;
  constructor() {
    this.providers = {
      [LoggerComponentKeys.LOGGER.key]: MyValueProvider,
    };
  }
}
