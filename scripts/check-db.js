const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const users = await prisma.user.findMany();
    const books = await prisma.book.findMany();
    const loans = await prisma.loan.findMany();

    console.log('=== DADOS NO BANCO ===');
    console.log(`Usuários: ${users.length}`);
    console.log(`Livros: ${books.length}`);
    console.log(`Empréstimos: ${loans.length}`);

    if (users.length > 0) {
      console.log('\n=== ÚLTIMOS USUÁRIOS ===');
      users.slice(-5).forEach(user => {
        console.log(`- ${user.name} (${user.category}) - ${user.createdAt}`);
      });
    }

    if (books.length > 0) {
      console.log('\n=== ÚLTIMOS LIVROS ===');
      books.slice(-5).forEach(book => {
        console.log(`- ${book.name} (${book.year}) - ${book.createdAt}`);
      });
    }

    if (loans.length > 0) {
      console.log('\n=== ÚLTIMOS EMPRÉSTIMOS ===');
      loans.slice(-5).forEach(loan => {
        console.log(`- User: ${loan.userId}, Book: ${loan.bookId} - ${loan.createdAt}`);
      });
    }

  } catch (error) {
    console.error('Erro ao verificar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
