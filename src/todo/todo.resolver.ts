import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { CreateTodoInput, TodoFilterInput, UpdateTodoInput } from './todo.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => Todo)
  @UseGuards(GqlAuthGuard)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @Context() context,
  ) {
    return this.todoService.createTodo(createTodoInput);
  }

  @Mutation(() => Todo)
  @UseGuards(GqlAuthGuard)
  async updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
  ) {
    return this.todoService.updateTodo(updateTodoInput);
  }

  @Query(() => [Todo])
  @UseGuards(GqlAuthGuard)
  async todos(@Context() context) {
    return this.todoService.findTodosByUser({
      ...context.req.user,
      id: context.req.user.id,
    });
  } 

  @Query(() => [Todo])
  @UseGuards(GqlAuthGuard)
  async todosFiltered(@Args('filter') filter: TodoFilterInput): Promise<Todo[]> {
    return this.todoService.findAllFiltered(filter);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteTodo(
    @Args('id') id: number
  ): Promise<boolean> {
    return this.todoService.deleteTodo(id);
  }
}
