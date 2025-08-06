import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('Health Check (e2e)', () => {
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

  it('should return 404 for unknown route', async () => {
    await request(app.getHttpServer()).get('/unknown-route').expect(404);
  });

  it('should return 404 for root route', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });
});
