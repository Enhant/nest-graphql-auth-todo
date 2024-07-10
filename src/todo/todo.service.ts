import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../user/user.entity';
import { CreateTodoInput, TodoFilterInput, TodoStatus, UpdateTodoInput } from './todo.dto';

const generateUniqueId = require('generate-unique-id');

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'user')
      .select(['todo', 'user.id', 'user.username'])
      .where('todo.id = :id', { id })
      .getOne();

    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }

    return todo;
  }

  async createTodo(createTodoInput: CreateTodoInput): Promise<Todo> {
    const { title, description, status, user } = createTodoInput;

    const existingUser = await this.userRepository.findOne({ where: { id: user.id } })
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${user.id}" not found`);
    }

    const todo = this.todosRepository.create({
      title,
      description,
      status,
      user: existingUser,
    });

    return this.todosRepository.save(todo);
  }

  async updateTodo(updateTodoInput: UpdateTodoInput): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id: updateTodoInput.id } });
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.title = updateTodoInput.title;
    todo.description = updateTodoInput.description;
    todo.status = updateTodoInput.status;
    return this.todosRepository.save(todo);
  }

  async findTodosByUser(user: User): Promise<Todo[]> {
    const data = await this.todosRepository.find({ where: { user: { id: user.id } } });
    return data;
  }

  async findAllFiltered(filter: TodoFilterInput): Promise<Todo[]> {
    const query = this.todosRepository.createQueryBuilder('todo');

    if (filter.id) {
      query.andWhere('todo.id = :id', { id: filter.id });
    }
    if (filter.title) {
      query.andWhere('todo.title LIKE :title', { title: `%${filter.title}%` });
    }
    if (filter.status) {
      query.andWhere('todo.status = :status', { status: filter.status });
    }

    return await query.getMany();
  }

  async deleteTodo(id: number): Promise<boolean> {
    const result = await this.todosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
    return true;
  }
}
