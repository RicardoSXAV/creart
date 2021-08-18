import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  ObjectType,
} from 'type-graphql';
import { User } from '../models/User';
import { hash, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserInput } from '../inputs/CreateUserInput';
import { UpdateUserInput } from '../inputs/UpdateUserInput';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: CreateUserInput) {
    data.password = await hash(data.password, 12);

    const user = User.create(data);
    await user.save();
    return user;
  }

  @Query(() => User)
  user(@Arg('id') id: string) {
    return User.findOne({ where: { id } });
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<LoginResponse> {
    console.log(email);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Could not find user.');
    }

    console.log(password, user.password);

    const validPassword = compareSync(password, user.password);

    console.log(validPassword);

    if (!validPassword) {
      throw new Error('Invalid password.');
    }

    return {
      accessToken: sign({ userId: user.id }, 'secret', {
        expiresIn: '15m',
      }),
    };
  }

  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') data: UpdateUserInput) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error(`The user with id: ${id} does not exist!`);
    }

    Object.assign(user, data);
    await user.save();

    return user;
  }
}
