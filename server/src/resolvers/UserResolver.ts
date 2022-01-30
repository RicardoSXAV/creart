import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { hash } from 'bcrypt';

import { User } from '../models/User';
import { CreateUserInput } from '../inputs/CreateUserInput';
import { UpdateUserInput } from '../inputs/UpdateUserInput';
@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => User)
  async createUser(@Arg('userData') userData: CreateUserInput) {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('This email is already being used!');
    }

    userData.password = await hash(userData.password, 12);

    const user = User.create(userData);
    await user.save();
    return user;
  }

  @Query(() => User)
  user(@Arg('id') id: string) {
    return User.findOne({ where: { id } });
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id') id: string,
    @Arg('userData') userData: UpdateUserInput
  ) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error(`The user with id: ${id} does not exist!`);
    }

    Object.assign(user, userData);
    await user.save();

    return user;
  }
}
