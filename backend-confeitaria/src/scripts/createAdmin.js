const { createFirstAdmin } = require('../middleware/adminAuth');
const { testConnection } = require('../config/database');
require('dotenv').config();

/**
 * Script para criar o primeiro administrador do sistema
 * Execute: node src/scripts/createAdmin.js
 */
async function main() {
  try {
    console.log('🚀 Iniciando criação do primeiro administrador...');
    
    // Testa conexão com banco
    await testConnection();
    
    // Cria o super administrador
    await createFirstAdmin();
    
    console.log('🎉 Processo concluído com sucesso!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. Acesse o painel admin em: http://localhost:3001');
    console.log('2. Faça login com as credenciais criadas');
    console.log('3. Altere a senha padrão');
    console.log('4. Configure as permissões de outros usuários');
    console.log('');
    console.log('⚠️  IMPORTANTE:');
    console.log('- Mantenha as credenciais seguras');
    console.log('- Use HTTPS em produção');
    console.log('- Configure 2FA se possível');
    console.log('- Faça backup regular do banco');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
    process.exit(1);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = main;