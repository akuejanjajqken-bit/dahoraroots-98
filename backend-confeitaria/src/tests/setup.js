const { sequelize } = require('../config/database');

// Configuração global para testes
beforeAll(async () => {
  // Conecta ao banco de dados de teste
  await sequelize.authenticate();
});

afterAll(async () => {
  // Fecha conexão com banco
  await sequelize.close();
});

// Limpa dados entre testes
beforeEach(async () => {
  // Limpa todas as tabelas antes de cada teste
  await sequelize.sync({ force: true });
});

// Configuração de timeout para testes
jest.setTimeout(10000);