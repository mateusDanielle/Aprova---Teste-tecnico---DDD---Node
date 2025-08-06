const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    await prisma.loan.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.user.deleteMany({});

    // Criar usuários de exemplo
    console.log('👥 Criando usuários...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: 'TEACHER',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Pedro Oliveira',
          city: 'Belo Horizonte',
          category: 'LIBRARIAN',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Ana Costa',
          city: 'Salvador',
          category: 'STUDENT',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Carlos Ferreira',
          city: 'Brasília',
          category: 'TEACHER',
        },
      }),
    ]);

    console.log(`✅ ${users.length} usuários criados`);

    // Criar livros de exemplo
    console.log('📚 Criando livros...');
    const books = await Promise.all([
      prisma.book.create({
        data: {
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        },
      }),
      prisma.book.create({
        data: {
          name: 'Dom Casmurro',
          year: 1899,
          publisher: 'Livraria Garnier',
        },
      }),
      prisma.book.create({
        data: {
          name: '1984',
          year: 1949,
          publisher: 'Secker & Warburg',
        },
      }),
      prisma.book.create({
        data: {
          name: 'O Pequeno Príncipe',
          year: 1943,
          publisher: 'Reynal & Hitchcock',
        },
      }),
      prisma.book.create({
        data: {
          name: 'Cem Anos de Solidão',
          year: 1967,
          publisher: 'Editorial Sudamericana',
        },
      }),
      prisma.book.create({
        data: {
          name: 'A Revolução dos Bichos',
          year: 1945,
          publisher: 'Secker & Warburg',
        },
      }),
      prisma.book.create({
        data: {
          name: 'O Hobbit',
          year: 1937,
          publisher: 'Allen & Unwin',
        },
      }),
      prisma.book.create({
        data: {
          name: 'Grande Sertão: Veredas',
          year: 1956,
          publisher: 'José Olympio',
        },
      }),
    ]);

    console.log(`✅ ${books.length} livros criados`);

    // Criar alguns empréstimos de exemplo
    console.log('📖 Criando empréstimos...');
    const loans = await Promise.all([
      prisma.loan.create({
        data: {
          userId: users[0].id, // João Silva (STUDENT)
          bookId: books[0].id, // O Senhor dos Anéis
          returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 dias
          status: 'ACTIVE',
        },
      }),
      prisma.loan.create({
        data: {
          userId: users[1].id, // Maria Santos (TEACHER)
          bookId: books[1].id, // Dom Casmurro
          returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          status: 'ACTIVE',
        },
      }),
      prisma.loan.create({
        data: {
          userId: users[2].id, // Pedro Oliveira (LIBRARIAN)
          bookId: books[2].id, // 1984
          returnDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
          status: 'ACTIVE',
        },
      }),
    ]);

    console.log(`✅ ${loans.length} empréstimos criados`);

    // Resumo final
    const finalUsers = await prisma.user.count();
    const finalBooks = await prisma.book.count();
    const finalLoans = await prisma.loan.count();

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   👥 Usuários: ${finalUsers}`);
    console.log(`   📚 Livros: ${finalBooks}`);
    console.log(`   📖 Empréstimos: ${finalLoans}`);
    console.log('\n🚀 Agora você pode testar as APIs com dados reais!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
