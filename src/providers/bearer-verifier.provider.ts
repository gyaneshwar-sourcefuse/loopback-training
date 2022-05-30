import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {UsersRepository} from '../repositories';


export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(UsersRepository) public usersRepository: UsersRepository
  ) { }

  value(): VerifyFunction.BearerFn {
    return async token => {
      const tokenInfo = verify(token, process.env.JWT_SECRET as string);

      const user = await this.usersRepository.findOne({
        include: ['role'],
        where: {
          email: tokenInfo.sub as string
        }
      })
      return user;
    };
  }
}
