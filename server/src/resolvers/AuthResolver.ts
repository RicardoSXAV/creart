import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Arg, Field, Mutation, ObjectType } from 'type-graphql';
import { User } from '../models/User';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

export class AuthResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Could not find user.');
    }

    const validPassword = compareSync(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid password.');
    }

    return {
      accessToken: sign({ userId: user.id }, String(process.env.JWT_SECRET), {
        expiresIn: '15m',
      }),
    };
  }

  @Mutation(() => User)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {}
}
