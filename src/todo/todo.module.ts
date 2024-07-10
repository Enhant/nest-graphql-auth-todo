import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  providers: [TodoService, TodoResolver],
})
export class TodoModule {}
