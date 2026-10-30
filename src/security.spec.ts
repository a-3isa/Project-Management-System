import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { JwtStrategy } from './auth/jwt.strategy';
import { ProjectService } from './project/project.service';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { Project } from './project/entities/project.entity';
import { Task } from './task/entities/task.entity';
import { JwtService } from '@nestjs/jwt';

const userWith = (role: string) => Object.assign(new User(), { role });

describe('JwtStrategy', () => {
  const findOne = jest.fn().mockResolvedValue({ id: 'u1' });
  const users = { findOne } as unknown as Repository<User>;
  const config = { get: () => 'test-secret' } as unknown as ConfigService;

  beforeEach(() => findOne.mockClear());

  it('refuses to start without JWT_SECRET', () => {
    expect(
      () => new JwtStrategy(users, { get: () => undefined } as never),
    ).toThrow('JWT_SECRET');
  });

  it.each([
    [{ email: 'a@x.io', typ: 'reset' }],
    [{ email: 'a@x.io' }],
    [{ username: 'a@x.io', typ: 'access' }],
  ])('rejects %p without querying', async (payload) => {
    const strategy = new JwtStrategy(users, config);
    await expect(strategy.validate(payload as never)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(findOne).not.toHaveBeenCalled();
  });

  it('finds the user by the email of an access token', async () => {
    const strategy = new JwtStrategy(users, config);
    await strategy.validate({ email: 'a@x.io', typ: 'access' });
    expect(findOne).toHaveBeenCalledWith({ where: { email: 'a@x.io' } });
  });
});

describe('role checks', () => {
  const projects = {
    findOne: jest.fn().mockResolvedValue({ id: 'p1' }),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const projectService = new ProjectService(
    projects as unknown as Repository<Project>,
    {} as Repository<User>,
    {} as Repository<Task>,
  );
  const userRepo = { delete: jest.fn() };
  const userService = new UserService(
    userRepo as unknown as Repository<User>,
    {} as JwtService,
  );

  it('stops developers changing or deleting projects', async () => {
    const dev = userWith('Developer');
    await expect(
      projectService.update('p1', { title: 'x' }, dev),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(projectService.remove('p1', dev)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(projects.save).not.toHaveBeenCalled();
    expect(projects.delete).not.toHaveBeenCalled();
  });

  it('lets managers change projects', async () => {
    await projectService.update('p1', { title: 'x' }, userWith('Manager'));
    expect(projects.save).toHaveBeenCalled();
  });

  it('lets only admins delete users', () => {
    expect(() => userService.remove('u2', userWith('Manager'))).toThrow(
      UnauthorizedException,
    );
    expect(userRepo.delete).not.toHaveBeenCalled();
    void userService.remove('u2', userWith('Admin'));
    expect(userRepo.delete).toHaveBeenCalledWith('u2');
  });
});

describe('User serialisation', () => {
  it('never includes secrets', () => {
    const user = Object.assign(new User(), {
      id: 'u1',
      email: 'a@x.io',
      password: 'hash',
      otp: '123456',
      otpExpiry: new Date(),
      resetToken: 'token',
      resetTokenExpiry: new Date(),
      role: 'Developer',
    });
    const plain = instanceToPlain(user);
    for (const key of [
      'password',
      'otp',
      'otpExpiry',
      'resetToken',
      'resetTokenExpiry',
    ]) {
      expect(plain).not.toHaveProperty(key);
    }
    expect(plain).toMatchObject({ id: 'u1', email: 'a@x.io' });
  });
});
