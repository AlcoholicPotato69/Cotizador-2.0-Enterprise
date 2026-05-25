import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new (require('../src/common/interceptors/transform.interceptor').TransformInterceptor)(),
    );
    app.setGlobalPrefix('api/v1');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/login (POST) - should return 200 with JWT', async () => {
    const credentials = {
      email: 'admin_cp@cotizador.com',
      password: 'Password123!',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(credentials)
      .expect(200);

    // TransformInterceptor wraps response in { statusCode, message, data }
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user.email).toBe(credentials.email);
  });

  it('/api/v1/auth/login (POST) - should fail with invalid email', async () => {
    const credentials = {
      email: 'invalid@cotizador.com',
      password: 'Password123!',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(credentials)
      .expect(401);
  });
});
