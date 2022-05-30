import {hasOne, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {SoftDeleteEntity} from 'loopback4-soft-delete';
import {RolesEnum} from '../enums/roles.enum';
import {Roles, RolesRelations} from './roles.model';

@model()
export class Users extends SoftDeleteEntity implements IAuthUser {

  @property({
    type: "number",
    id: true,
    generated: true,
  })
  id?: number

  @property({
    type: 'string',
    required: true,
    name: "name"
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    name: "phone_number"
  })
  phoneNumber?: string;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'created_on'
  })
  createdOn?: string;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'modified_on'
  })
  modifiedOn?: string;


  // @property({
  //   type: 'number',
  //   required: true,
  //   name: 'customer_id'
  // })
  // customerId: number;

  // @belongsTo(() => Customers, {keyTo: 'id'})
  // customer?: Customers;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.keys(RolesEnum)
    },
    required: true,
    name: 'role_id'
  })
  roleId: string;

  @hasOne(() => Roles, {keyTo: 'id', keyFrom: 'roleId'})
  role?: Roles;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
    required: true,
    name: 'auth_provider',
  })
  authProvider: string;

  // Id from external provider
  @property({
    type: 'string',
    name: 'auth_id',
  })
  authId?: string;

  @property({
    type: 'string',
    name: 'auth_token',
  })
  authToken?: string;

  @property({
    type: 'array',
    itemType: 'string',
    name: 'permissions',
  })
  permissions: string[];

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
  role?: RolesRelations
}

export type UsersWithRelations = Users & UsersRelations;
