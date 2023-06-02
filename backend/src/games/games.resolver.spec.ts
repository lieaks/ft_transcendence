import { Test, TestingModule } from '@nestjs/testing';
import { GamesResolver } from './games.resolver';

describe('GamesResolver', () => {
  let resolver: GamesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesResolver],
    }).compile();

    resolver = module.get<GamesResolver>(GamesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
