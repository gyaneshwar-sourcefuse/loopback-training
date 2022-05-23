import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Customers} from './customers.model';

@model()
export class Roles extends Entity {
  // @property({
  //   type: 'number',
  //   required: true,
  // })
  @belongsTo(() => Customers)
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;


  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
