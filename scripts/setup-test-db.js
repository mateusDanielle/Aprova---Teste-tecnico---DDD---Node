const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Configurando banco de dados de testes...');

// Criar .env.test se não existir
if (!fs.existsSync('.env.test')) {
  console.log('📝 Criando arquivo .env.test...');
  const envTestContent = `# Test Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/library_test_db?schema=public"

# Application
PORT=3000
NODE_ENV=test
`;
  fs.writeFileSync('.env.test', envTestContent);
  console.log('✅ Arquivo .env.test criado!');
} else {
  console.log('✅ Arquivo .env.test já existe!');
}

// Iniciar container de teste
console.log('🐳 Iniciando container de teste...');
try {
  execSync('docker compose up -d postgres_test', { stdio: 'inherit' });
  console.log('✅ Container de teste iniciado!');
} catch (error) {
  console.error('❌ Erro ao iniciar container de teste:', error.message);
  process.exit(1);
}

// Aguardar banco estar pronto
console.log('⏳ Aguardando banco de teste estar pronto...');
setTimeout(() => {
  try {
    // Executar migrações no banco de teste usando .env.test
    console.log('📦 Executando migrações no banco de teste...');
    execSync('npx dotenv -e .env.test -- npx prisma migrate deploy', {
      stdio: 'inherit',
    });

    console.log('✅ Banco de dados de testes configurado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao configurar banco de teste:', error.message);
    process.exit(1);
  }
}, 5000);
