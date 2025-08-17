import { Injectable, NotFoundException } from '@nestjs/common';
// import { UserDto } from './dto/user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findTasks(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    console.log(user);
    if (!user) throw new NotFoundException();
    return user.tasks;
  }
  findAll() {
    return this.userRepository.find();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, userDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
