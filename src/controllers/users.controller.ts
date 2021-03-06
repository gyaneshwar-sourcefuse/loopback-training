import {Application, CoreBindings, inject, intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permissions.enum';
import {log} from '../interceptors/log.interceptor';
import {Users} from '../models';
import {UsersRepository} from '../repositories';

export class UsersController {


  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected app: Application
  ) { }

  @intercept(log)
  @post('/users')

  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    users: Omit<Users, 'id'>,
  ): Promise<Users> {
    return this.usersRepository.create(users);
  }

  @get('/users/count')
  @response(200, {
    description: 'Users model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewUser]})
  @get('/users')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Users) filter?: Filter<Users>,
  ): Promise<Users[]> {
    return this.usersRepository.find({...filter, fields: {password: false}});
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateUser]})
  @patch('/users')
  @response(200, {
    description: 'Users PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewUser]})
  @get('/users/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
    @param.filter(Users, {exclude: 'where'}) filter?: FilterExcludingWhere<Users>
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateUser]})
  @patch('/users/{id}')
  @response(204, {
    description: 'Users PATCH success',
  })
  async updateById(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
  ): Promise<void> {
    console.log(users);

    await this.usersRepository.updateById(id, users);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateUser]})
  @put('/users/{id}')
  @response(204, {
    description: 'Users PUT success',
  })
  async replaceById(
    @param.path.string('id') id: number,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteUser]})
  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(@param.path.string('id') id: number): Promise<void> {
    await this.usersRepository.deleteById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteUser]})
  @del('/users')
  @response(204, {
    description: 'Delete all users'
  })
  deleteAll(): Promise<Count> {
    return this.usersRepository.deleteAll();
  }

}
