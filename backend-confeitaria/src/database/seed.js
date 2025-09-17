const { 
  Usuario, 
  Categoria, 
  Produto, 
  Cupom 
} = require('../models');

/**
 * Script de seed para popular o banco com dados de exemplo
 */
async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Cria usuário administrador
    const admin = await Usuario.findOrCreate({
      where: { email: 'admin@dahoraroots.com' },
      defaults: {
        nome_completo: 'Administrador',
        email: 'admin@dahoraroots.com',
        senha_hash: 'admin123', // Será criptografada pelo hook
        tipo_usuario: 'admin',
        status: 'ativo',
        termos_aceitos: true,
        data_aceite_termos: new Date()
      }
    });

    // Cria usuário cliente de exemplo
    const cliente = await Usuario.findOrCreate({
      where: { email: 'cliente@exemplo.com' },
      defaults: {
        nome_completo: 'João Silva',
        email: 'cliente@exemplo.com',
        senha_hash: 'cliente123', // Será criptografada pelo hook
        telefone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        tipo_usuario: 'cliente',
        status: 'ativo',
        termos_aceitos: true,
        data_aceite_termos: new Date()
      }
    });

    // Cria categorias
    const categorias = await Promise.all([
      Categoria.findOrCreate({
        where: { slug: 'bolos' },
        defaults: {
          nome: 'Bolos',
          descricao: 'Bolos artesanais feitos com ingredientes selecionados',
          slug: 'bolos',
          icone: 'cake',
          cor_hex: '#E16A3D',
          ordem_exibicao: 1,
          ativa: true
        }
      }),
      Categoria.findOrCreate({
        where: { slug: 'doces' },
        defaults: {
          nome: 'Doces',
          descricao: 'Doces tradicionais e inovadores',
          slug: 'doces',
          icone: 'candy',
          cor_hex: '#FEA450',
          ordem_exibicao: 2,
          ativa: true
        }
      }),
      Categoria.findOrCreate({
        where: { slug: 'tortas' },
        defaults: {
          nome: 'Tortas',
          descricao: 'Tortas doces e salgadas para todas as ocasiões',
          slug: 'tortas',
          icone: 'pie',
          cor_hex: '#016A6D',
          ordem_exibicao: 3,
          ativa: true
        }
      }),
      Categoria.findOrCreate({
        where: { slug: 'cookies' },
        defaults: {
          nome: 'Cookies',
          descricao: 'Cookies crocantes e macios',
          slug: 'cookies',
          icone: 'cookie',
          cor_hex: '#043E52',
          ordem_exibicao: 4,
          ativa: true
        }
      })
    ]);

    // Cria produtos de exemplo
    const produtos = await Promise.all([
      // Bolos
      Produto.findOrCreate({
        where: { slug: 'bolo-chocolate-premium' },
        defaults: {
          nome: 'Bolo de Chocolate Premium',
          descricao: 'Bolo de chocolate com recheio de ganache e cobertura de chocolate belga',
          descricao_curta: 'Bolo de chocolate artesanal com ingredientes premium',
          preco: 89.90,
          preco_promocional: 79.90,
          categoria_id: categorias[0][0].id,
          estoque: 10,
          estoque_minimo: 2,
          peso: 1200,
          dimensoes: { largura: 25, altura: 8, profundidade: 25 },
          imagens: ['/images/bolo-chocolate-1.jpg', '/images/bolo-chocolate-2.jpg'],
          slug: 'bolo-chocolate-premium',
          destaque: true,
          ativo: true,
          ingredientes: 'Farinha de trigo, açúcar, chocolate belga, ovos, manteiga, leite',
          alergenos: ['gluten', 'lactose', 'ovos'],
          tempo_preparo: 180,
          validade_dias: 3,
          temperatura_conservacao: 'refrigerado',
          sku: 'BOL-CHOC-001',
          meta_title: 'Bolo de Chocolate Premium - Dahora Roots',
          meta_description: 'Bolo de chocolate artesanal com ingredientes premium. Perfeito para ocasiões especiais.',
          palavras_chave: 'bolo, chocolate, premium, artesanal, confeitaria'
        }
      }),
      Produto.findOrCreate({
        where: { slug: 'bolo-morango-creme' },
        defaults: {
          nome: 'Bolo de Morango com Creme',
          descricao: 'Bolo de baunilha com recheio de creme e morangos frescos',
          descricao_curta: 'Bolo clássico de morango com creme',
          preco: 75.90,
          categoria_id: categorias[0][0].id,
          estoque: 8,
          estoque_minimo: 2,
          peso: 1000,
          dimensoes: { largura: 22, altura: 7, profundidade: 22 },
          imagens: ['/images/bolo-morango-1.jpg'],
          slug: 'bolo-morango-creme',
          destaque: true,
          ativo: true,
          ingredientes: 'Farinha de trigo, açúcar, morangos, creme de leite, ovos',
          alergenos: ['gluten', 'lactose', 'ovos'],
          tempo_preparo: 150,
          validade_dias: 2,
          temperatura_conservacao: 'refrigerado',
          sku: 'BOL-MOR-001'
        }
      }),
      // Doces
      Produto.findOrCreate({
        where: { slug: 'brigadeiro-gourmet' },
        defaults: {
          nome: 'Brigadeiro Gourmet',
          descricao: 'Brigadeiro artesanal com chocolate belga e granulado premium',
          descricao_curta: 'Brigadeiro gourmet com ingredientes selecionados',
          preco: 2.50,
          categoria_id: categorias[1][0].id,
          estoque: 100,
          estoque_minimo: 20,
          peso: 25,
          dimensoes: { largura: 3, altura: 3, profundidade: 3 },
          imagens: ['/images/brigadeiro-1.jpg'],
          slug: 'brigadeiro-gourmet',
          destaque: true,
          ativo: true,
          ingredientes: 'Chocolate belga, leite condensado, manteiga, granulado',
          alergenos: ['lactose'],
          tempo_preparo: 30,
          validade_dias: 7,
          temperatura_conservacao: 'refrigerado',
          sku: 'DOC-BRI-001'
        }
      }),
      Produto.findOrCreate({
        where: { slug: 'beijinho-coco' },
        defaults: {
          nome: 'Beijinho de Coco',
          descricao: 'Beijinho tradicional com coco ralado e cravo',
          descricao_curta: 'Beijinho clássico de coco',
          preco: 2.00,
          categoria_id: categorias[1][0].id,
          estoque: 80,
          estoque_minimo: 15,
          peso: 20,
          imagens: ['/images/beijinho-1.jpg'],
          slug: 'beijinho-coco',
          ativo: true,
          ingredientes: 'Leite condensado, coco ralado, manteiga, cravo',
          alergenos: ['lactose'],
          tempo_preparo: 25,
          validade_dias: 7,
          temperatura_conservacao: 'refrigerado',
          sku: 'DOC-BEI-001'
        }
      }),
      // Tortas
      Produto.findOrCreate({
        where: { slug: 'torta-limao' },
        defaults: {
          nome: 'Torta de Limão',
          descricao: 'Torta de limão com massa crocante e creme azedinho',
          descricao_curta: 'Torta refrescante de limão',
          preco: 45.90,
          categoria_id: categorias[2][0].id,
          estoque: 15,
          estoque_minimo: 3,
          peso: 800,
          dimensoes: { largura: 20, altura: 6, profundidade: 20 },
          imagens: ['/images/torta-limao-1.jpg'],
          slug: 'torta-limao',
          destaque: true,
          ativo: true,
          ingredientes: 'Farinha de trigo, açúcar, limão, ovos, manteiga',
          alergenos: ['gluten', 'ovos'],
          tempo_preparo: 120,
          validade_dias: 4,
          temperatura_conservacao: 'refrigerado',
          sku: 'TOR-LIM-001'
        }
      }),
      // Cookies
      Produto.findOrCreate({
        where: { slug: 'cookie-chocolate-chip' },
        defaults: {
          nome: 'Cookie de Chocolate Chip',
          descricao: 'Cookie crocante com gotas de chocolate',
          descricao_curta: 'Cookie clássico de chocolate',
          preco: 3.50,
          categoria_id: categorias[3][0].id,
          estoque: 50,
          estoque_minimo: 10,
          peso: 60,
          dimensoes: { largura: 8, altura: 1, profundidade: 8 },
          imagens: ['/images/cookie-chocolate-1.jpg'],
          slug: 'cookie-chocolate-chip',
          ativo: true,
          ingredientes: 'Farinha de trigo, açúcar, chocolate, ovos, manteiga',
          alergenos: ['gluten', 'ovos'],
          tempo_preparo: 45,
          validade_dias: 10,
          temperatura_conservacao: 'ambiente',
          sku: 'COO-CHOC-001'
        }
      })
    ]);

    // Cria cupons de exemplo
    const cupons = await Promise.all([
      Cupom.findOrCreate({
        where: { codigo: 'BEMVINDO10' },
        defaults: {
          codigo: 'BEMVINDO10',
          nome: 'Bem-vindo - 10% OFF',
          descricao: 'Desconto de 10% para novos clientes',
          tipo: 'percentual',
          valor: 10,
          valor_minimo_pedido: 50,
          usos_maximo: 1000,
          usos_atual: 0,
          usos_por_usuario: 1,
          data_inicio: new Date(),
          data_fim: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
          ativo: true,
          tipo_usuario: 'novos',
          primeira_compra: true,
          prioridade: 10
        }
      }),
      Cupom.findOrCreate({
        where: { codigo: 'FRETE15' },
        defaults: {
          codigo: 'FRETE15',
          nome: 'Frete Grátis',
          descricao: 'Frete grátis para pedidos acima de R$ 150',
          tipo: 'frete_gratis',
          valor: 0,
          valor_minimo_pedido: 150,
          usos_maximo: 500,
          usos_atual: 0,
          usos_por_usuario: 3,
          data_inicio: new Date(),
          data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 meses
          ativo: true,
          prioridade: 5
        }
      }),
      Cupom.findOrCreate({
        where: { codigo: 'DESCONTO20' },
        defaults: {
          codigo: 'DESCONTO20',
          nome: '20% OFF',
          descricao: 'Desconto de 20% em todo o pedido',
          tipo: 'percentual',
          valor: 20,
          valor_maximo_desconto: 50,
          valor_minimo_pedido: 100,
          usos_maximo: 100,
          usos_atual: 0,
          usos_por_usuario: 1,
          data_inicio: new Date(),
          data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 mês
          ativo: true,
          prioridade: 8
        }
      })
    ]);

    console.log('✅ Seed concluído com sucesso!');
    console.log('👤 Usuários criados:');
    console.log(`   • Admin: admin@dahoraroots.com (senha: admin123)`);
    console.log(`   • Cliente: cliente@exemplo.com (senha: cliente123)`);
    console.log('📦 Categorias criadas:');
    categorias.forEach(([categoria]) => {
      console.log(`   • ${categoria.nome}`);
    });
    console.log('🍰 Produtos criados:');
    produtos.forEach(([produto]) => {
      console.log(`   • ${produto.nome} - R$ ${produto.preco}`);
    });
    console.log('🎫 Cupons criados:');
    cupons.forEach(([cupom]) => {
      console.log(`   • ${cupom.codigo} - ${cupom.nome}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
}

// Executa seed se chamado diretamente
if (require.main === module) {
  seed();
}

module.exports = seed;