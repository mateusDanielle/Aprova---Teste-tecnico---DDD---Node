import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { UserCategory } from '../../domain';

describe('LoansController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let bookId: string;

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

  beforeEach(async () => {
    // Criar usuário e livro para os testes
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      })
      .expect(201);

    userId = userResponse.body.id;

    const bookResponse = await request(app.getHttpServer())
      .post('/books')
      .send({
        name: 'O Senhor dos Anéis',
        year: 1954,
        publisher: 'Editora Martins Fontes',
      })
      .expect(201);

    bookId = bookResponse.body.id;
  });

  describe('POST /loans', () => {
    it('should create a loan for a student', async () => {
      const loanData = {
        userId,
        bookId,
      };

      const response = await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(201);

      expect(response.body).toHaveProperty('returnDate');
      expect(typeof response.body.returnDate).toBe('string');

      // Verificar se a data de devolução está no futuro
      const returnDate = new Date(response.body.returnDate);
      const now = new Date();
      expect(returnDate.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should create a loan for a teacher', async () => {
      // Criar um professor
      const teacherResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: UserCategory.TEACHER,
        })
        .expect(201);

      const teacherId = teacherResponse.body.id;

      const loanData = {
        userId: teacherId,
        bookId,
      };

      const response = await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(201);

      expect(response.body).toHaveProperty('returnDate');

      // Verificar se a data de devolução está no futuro (30 dias para professores)
      const returnDate = new Date(response.body.returnDate);
      const now = new Date();
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 30);

      // Permitir uma pequena diferença de tempo
      const timeDiff = Math.abs(
        returnDate.getTime() - expectedReturnDate.getTime(),
      );
      expect(timeDiff).toBeLessThan(24 * 60 * 60 * 1000); // 1 dia
    });

    it('should create a loan for a librarian', async () => {
      // Criar um bibliotecário
      const librarianResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Pedro Costa',
          city: 'Belo Horizonte',
          category: UserCategory.LIBRARIAN,
        })
        .expect(201);

      const librarianId = librarianResponse.body.id;

      const loanData = {
        userId: librarianId,
        bookId,
      };

      const response = await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(201);

      expect(response.body).toHaveProperty('returnDate');

      // Verificar se a data de devolução está no futuro (60 dias para bibliotecários)
      const returnDate = new Date(response.body.returnDate);
      const now = new Date();
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 60);

      // Permitir uma pequena diferença de tempo
      const timeDiff = Math.abs(
        returnDate.getTime() - expectedReturnDate.getTime(),
      );
      expect(timeDiff).toBeLessThan(24 * 60 * 60 * 1000); // 1 dia
    });

    it('should return 400 for non-existent user', async () => {
      const loanData = {
        userId: 'non-existent-user-id',
        bookId,
      };

      await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(400);
    });

    it('should return 400 for non-existent book', async () => {
      const loanData = {
        userId,
        bookId: 'non-existent-book-id',
      };

      await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(400);
    });

    it('should return 400 for already loaned book', async () => {
      // Primeiro empréstimo
      const loanData = {
        userId,
        bookId,
      };

      await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(201);

      // Tentar emprestar o mesmo livro novamente
      await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteLoanData = {
        userId,
        // bookId missing
      };

      await request(app.getHttpServer())
        .post('/loans')
        .send(incompleteLoanData)
        .expect(400);
    });

    it('should return 400 for invalid user ID format', async () => {
      const loanData = {
        userId: 'invalid-id-format',
        bookId,
      };

      await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(400);
    });

    it('should return 400 for invalid book ID format', async () => {
      const loanData = {
        userId,
        bookId: 'invalid-id-format',
      };

      await request(app.getHttpServer())
        .post('/loans')
        .send(loanData)
        .expect(400);
    });
  });
});
