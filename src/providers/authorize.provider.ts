import {Constructor, CoreBindings, Getter, inject, MetadataInspector, Provider} from '@loopback/core';
import {Request} from '@loopback/rest';
import {AuthorizationBindings, AuthorizationMetadata, AUTHORIZATION_METADATA_ACCESSOR, AuthorizeFn} from 'loopback4-authorization';

export class MyAuthorizer implements Provider<AuthorizeFn> {

  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getMetadata: Getter<AuthorizationMetadata>
  ) {

  }

  value(): any {
    return this.action.bind(this);
  }

  async action(permissions: string[], request?: Request) {
    const metadata: AuthorizationMetadata = await this.getMetadata();

    const allowed = metadata.permissions.some((permission: string) => {
      return permissions.includes(permission);
    });

    return allowed;
  }

}


export class MyAuthorizationMetadataProvider
  implements Provider<AuthorizationMetadata | undefined>
{
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, {optional: true})
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, {optional: true})
    private readonly methodName: string,
  ) { }

  value(): AuthorizationMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    return getAuthorizeMetadata(this.controllerClass, this.methodName);
  }
}

export function getAuthorizeMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): AuthorizationMetadata | undefined {
  return MetadataInspector.getMethodMetadata<AuthorizationMetadata>(
    AUTHORIZATION_METADATA_ACCESSOR,
    controllerClass.prototype,
    methodName,
  );
}
