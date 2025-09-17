const { sequelize, syncDatabase } = require('../config/database');

/**
 * Script de migração do banco de dados
 * Cria todas as tabelas e relacionamentos
 */
async function migrate() {
  try {
    console.log('🔄 Iniciando migração do banco de dados...');
    
    // Força a sincronização (cria/atualiza tabelas)
    await syncDatabase(true);
    
    console.log('✅ Migração concluída com sucesso!');
    console.log('📊 Tabelas criadas:');
    console.log('   • usuarios');
    console.log('   • categorias');
    console.log('   • produtos');
    console.log('   • pedidos');
    console.log('   • itens_pedido');
    console.log('   • enderecos');
    console.log('   • carrinho');
    console.log('   • avaliacoes');
    console.log('   • cupons');
    console.log('   • usuario_cupons');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

// Executa migração se chamado diretamente
if (require.main === module) {
  migrate();
}

module.exports = migrate;