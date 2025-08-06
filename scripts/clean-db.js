const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Limpando banco de dados...');

    // Deletar em ordem (respeitando foreign keys)
    const loansDeleted = await prisma.loan.deleteMany({});
    const booksDeleted = await prisma.book.deleteMany({});
    const usersDeleted = await prisma.user.deleteMany({});

    console.log('✅ Banco limpo com sucesso!');
    console.log(`- Empréstimos deletados: ${loansDeleted.count}`);
    console.log(`- Livros deletados: ${booksDeleted.count}`);
    console.log(`- Usuários deletados: ${usersDeleted.count}`);

    // Verificar se ficou limpo
    const remainingUsers = await prisma.user.count();
    const remainingBooks = await prisma.book.count();
    const remainingLoans = await prisma.loan.count();

    console.log('\n📊 Status final:');
    console.log(`- Usuários restantes: ${remainingUsers}`);
    console.log(`- Livros restantes: ${remainingBooks}`);
    console.log(`- Empréstimos restantes: ${remainingLoans}`);

  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
