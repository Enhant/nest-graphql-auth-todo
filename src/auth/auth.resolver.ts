import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { RegisterInput, LoginInput } from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const user = await this.authService.register(registerInput);
    return user;
  }

  @Mutation(() => String)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const user = await this.authService.validateUser(loginInput.username, loginInput.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const data = await this.authService.login(user);
    return data.access_token;
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async profile(@Context() context) {
    return context.req.user;
  }
}
