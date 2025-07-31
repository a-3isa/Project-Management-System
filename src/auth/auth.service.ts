/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(createUserDto: UserAuthDto, user: User) {
    if (user.role !== 'Admin') throw new UnauthorizedException();
    const existingUser = await this.authRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) throw new ConflictException('Username already exists');
    const { username, password, role } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.authRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    await this.authRepository.save(newUser);
    // const accessToken: string = this.jwtService.sign({ username });
    // return { accessToken };
  }

  async login(userDto: UserAuthDto): Promise<{ accessToken: string }> {
    const { username, password } = userDto;
    // console.log(userDto);

    const user = await this.authRepository.findOne({ where: { username } });
    // console.log(user);

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(password, user.password);
      const payload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException();
  }
}
