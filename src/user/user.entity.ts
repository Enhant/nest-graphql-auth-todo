import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Todo } from 'src/todo/todo.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, todo => todo.user)
  todos: Todo[];
}
