import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/create-auth.dto';
import { GetUser } from './get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  // @UseGuards(AuthGuard())
  register(@Body() createAuthDto: UserAuthDto, @GetUser() user: User) {
    return this.authService.register(createAuthDto, user);
  }
  @Post('/login')
  login(@Body() userAuthDto: UserAuthDto) {
    return this.authService.login(userAuthDto);
  }
}
