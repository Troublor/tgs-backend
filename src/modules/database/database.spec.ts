import { setAppDataSource, TestDataSource } from './data-source.js';
import { Test } from '@nestjs/testing';
import UserService from './user.service.js';

describe('DatabaseModule', () => {
  beforeAll(async () => {
    setAppDataSource(TestDataSource);
    await TestDataSource.initialize();
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [UserService],
      }).compile();

      userService = moduleRef.get<UserService>(UserService);
    });

    it('should return undefined if user is not found', async () => {
      const user = await userService.getUser('not-exist');
      expect(user).toBe(undefined);
    });

    it('should return user if the username exists', async () => {
      const user = await userService.createUser('test', 'pass');
      const u = await userService.getUser('test');
      expect(u).not.toBe(undefined);
      expect(u?.username).toBe(user.username);
    });
  });
});
