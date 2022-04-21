import { DataSource } from 'typeorm';
import User from '../database/entities/user.entity.js';
import { setAppDataSource } from '../database/data-source.js';
import { Test } from '@nestjs/testing';
import UserService from '../database/user.service.js';
import { JwtModule } from '@nestjs/jwt';
import LocalStrategy from './local.strategy.js';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthModule', () => {
  const testDataSource = new DataSource({
    type: 'sqljs',
    synchronize: true,
    entities: [User],
  });

  beforeAll(async () => {
    setAppDataSource(testDataSource);
    await testDataSource.initialize();
  });

  afterAll(async () => {
    await testDataSource.destroy();
  });

  let userService: UserService;
  let localStrategy: LocalStrategy;
  let rootUser: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
        }),
      ],
      providers: [UserService, LocalStrategy],
    }).compile();
    userService = moduleRef.get(UserService);
    localStrategy = moduleRef.get(LocalStrategy);

    rootUser = await userService.createUser('root', 'pass');
  });

  describe('LocalStrategy', () => {
    it('should return user if username and password matches', async () => {
      const p = localStrategy.validate(rootUser.username, 'pass');
      await expect(p).resolves.toBeTruthy();
    });

    it('should return null if password is incorrect', async () => {
      const p = localStrategy.validate(rootUser.username, 'wrong');
      await expect(p).rejects.toThrow(UnauthorizedException);
    });

    it('should return null if username does not exist', async () => {
      const p = localStrategy.validate('not-exist', 'wrong');
      await expect(p).rejects.toThrow(UnauthorizedException);
    });
  });
});
