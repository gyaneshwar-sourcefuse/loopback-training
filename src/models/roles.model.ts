import {Entity, model, property} from '@loopback/repository';
import {Permissions} from 'loopback4-authorization';
import {RolesEnum} from '../enums/roles.enum';

@model({
  name: 'roles'
})
export class Roles extends Entity implements Permissions<string> {

  @property({
    id: true,
    generated: true,
    type: 'number'
  })
  id: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.keys(RolesEnum)
    },
    required: true
  })
  key: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];


  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
