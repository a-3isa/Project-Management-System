/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import e from 'express';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}
  async register(createUserDto: UserAuthDto, user: User) {
    if (user.role !== 'Admin') throw new UnauthorizedException();
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    const { email, password, role } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.authRepository.create({
      email,
      otp,
      otpExpiry,
      password: hashedPassword,
      role,
    });
    const savedUser = await this.authRepository.save(newUser);

    if (!savedUser) {
      throw new InternalServerErrorException('User could not be saved');
    }

    await this.mailerService.sendMail({
      to: 'a7med3isa000@gmail.com',
      from: 'smtp@demomailtrap.co',
      subject: 'Welcome to My App!',
      text: 'Thanks for registering. Please verify your email',
      html: `<p>Your verification code is: <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });
    // .then((success) => {
    //   console.log('horray');
    //   console.log(success);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
    const payload = { email };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken, message: 'OTP sent to email' };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await this.authRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async login(userDto: UserAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = userDto;

    const user = await this.authRepository.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(password, user.password);
      const payload = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException();
  }

  async requestPasswordReset(email: string) {
    const user = await this.authRepository.findOne({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    const token = this.jwtService.sign(
      { email: user.email },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await this.authRepository.save(user);
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: 'a7med3isa000@gmail.com',
      from: 'smtp@demomailtrap.co',
      subject: 'Reset your password',
      html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });
    // .then((success) => {
    //   console.log('horray');
    //   console.log(success);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const email = payload.email;
      const user = await this.authRepository.findOne({
        where: { email, resetToken: token },
      });

      if (
        !user ||
        !user.resetTokenExpiry ||
        user.resetTokenExpiry < new Date()
      ) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      console.log(user.password);
      console.log(newPassword);
      user.password = await bcrypt.hash(newPassword, 10);
      console.log(user.password);
      user.resetToken = null;
      user.resetTokenExpiry = null;
      const suc = await this.authRepository.save(user);
      console.log(suc);

      return { message: 'Password reset successfully' };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
