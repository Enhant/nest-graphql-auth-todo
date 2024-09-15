import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { TodoStatus } from './todo.dto';

@ObjectType()
@Entity()
export class Todo {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  status: TodoStatus;

  @Field()
  completed: boolean;

  @ManyToOne(() => User, user => user.todos, { eager: true })
  user: User;
}
