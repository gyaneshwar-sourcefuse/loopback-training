import {Getter, inject} from '@loopback/core';
import {HasOneRepositoryFactory, repository} from '@loopback/repository';
import {AuthenticationBindings, IAuthUser} from 'loopback4-authentication';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {PgDataSource} from '../datasources';
import {Roles, Users, UsersRelations} from '../models';
import {RolesRepository} from './roles.repository';

export class UsersRepository extends SoftCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {

  public readonly role: HasOneRepositoryFactory<Roles, typeof Users.prototype.roleId>

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
    @repository.getter('RolesRepository')
    protected rolesRepository: Getter<RolesRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER, {optional: true})
    protected readonly getCurrentUser: Getter<IAuthUser | undefined>,
  ) {
    super(Users, dataSource, getCurrentUser);
    this.role = this.createHasOneRepositoryFactoryFor('role', rolesRepository);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
