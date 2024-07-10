import { InputType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum TodoStatus {
  OPEN = 0,
  COMPLETED = 1,
}

registerEnumType(TodoStatus, {
  name: 'TodoStatus',
});

@InputType()
export class UserInput {
  @Field(() => ID)
  id: number;
}

@InputType()
export class CreateTodoInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TodoStatus, { defaultValue: TodoStatus.OPEN })
  status: TodoStatus;

  @Field(() => UserInput)
  user: UserInput; // Обновляем поле user
}

@InputType()
export class UpdateTodoInput {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: TodoStatus;
}


@InputType()
export class TodoFilterInput {
  @Field(() => ID)
  id?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  status?: TodoStatus;
}
