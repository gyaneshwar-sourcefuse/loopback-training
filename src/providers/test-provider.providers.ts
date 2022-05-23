import {Provider, ValueOrPromise} from '@loopback/core';

export class TestProvider implements Provider<string> {
  value(): ValueOrPromise<string> {
    return new Date().toString();
  }
}
