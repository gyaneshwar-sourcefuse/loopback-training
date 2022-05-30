// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import * as bcrypt from "bcrypt";
import {sign} from "jsonwebtoken";
import {AuthErrorKeys} from 'loopback4-authentication';
import {Users} from '../models';
import {UsersRepository} from '../repositories';

// import {inject} from '@loopback/core';


export class AuthController {
  constructor(
    @repository(UsersRepository) public usersRepository: UsersRepository
  ) { }

  @post('/auth/signup')
  async signUp(
    @requestBody() body: any
  ): Promise<Users> {

    try {
      const userExists = await this.usersRepository.findOne({where: {email: body.email}});

      if (userExists) {
        throw new HttpErrors.BadRequest('User already exists')
      }

      const password = await bcrypt.hash(body.password, 10);

      const newUser = new Users({
        name: body.name,
        username: body.email,
        email: body.email,
        password: password,
        authProvider: body.auth_provider,
        roleId: body.role_id
      })

      const user = await this.usersRepository.create(newUser);

      return new Users({
        name: user.name,
        username: user.username,
        email: user.email,
        authProvider: user.authProvider,
        roleId: user.roleId
      })

    } catch (error) {
      throw new HttpErrors.BadRequest()
    }

  }

  @post('/auth/login')
  async login(
    @requestBody() credentials: Pick<Users, 'username' | 'password'>
  ) {

    try {
      const user = await this.usersRepository.findOne({
        where: {username: credentials.username}
      });

      if (!user) {
        throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials)
      }

      const validPassword = await bcrypt.compare(credentials?.password!, user?.password!);

      if (!validPassword) {
        throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials)
      }

      const secret: string = process.env.JWT_SECRET!;
      const token = sign({id: user.id, username: user.username, roleId: user.roleId, sub: user.email, permissions: user.permissions}, secret)

      return {token}
    } catch (error) {
      throw new HttpErrors.BadRequest()
    }

  }
}
