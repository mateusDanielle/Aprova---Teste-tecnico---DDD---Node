import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('Simple Routes Test (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 for /api/users', async () => {
    await request(app.getHttpServer()).get('/api/users').expect(200);
  });

  it('should return 200 for /api/books', async () => {
    await request(app.getHttpServer()).get('/api/books').expect(200);
  });

  it('should return 200 for /api/loans', async () => {
    await request(app.getHttpServer()).get('/api/loans').expect(200);
  });
});
