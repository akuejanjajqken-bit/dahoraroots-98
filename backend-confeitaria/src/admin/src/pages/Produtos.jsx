import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Search,
  Filter,
  MoreVertical,
  Package,
  DollarSign,
  Archive,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api, formatCurrency, formatNumber } from '../services/api';
import toast from 'react-hot-toast';
import FormProduto from '../components/FormProduto';

const Produtos = () => {
  const { canEdit, canDelete } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Carrega produtos
  const loadProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', {
        params: {
          search: searchTerm,
          categoria: selectedCategory,
          ativo: selectedStatus === 'ativo' ? true : selectedStatus === 'inativo' ? false : undefined
        }
      });

      if (response.data.success) {
        setProdutos(response.data.data.produtos);
      }
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  // Carrega categorias
  const loadCategorias = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategorias(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useEffect(() => {
    loadProdutos();
    loadCategorias();
  }, [searchTerm, selectedCategory, selectedStatus]);

  const handleDelete = async (id) => {
    if (!canDelete()) {
      toast.error('Você não tem permissão para deletar produtos');
      return;
    }

    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        const response = await api.delete(`/products/${id}`);
        if (response.data.success) {
          toast.success('Produto deletado com sucesso!');
          loadProdutos();
        }
      } catch (error) {
        toast.error('Erro ao deletar produto');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!canEdit()) {
      toast.error('Você não tem permissão para editar produtos');
      return;
    }

    try {
      const response = await api.put(`/products/${id}`, {
        ativo: !currentStatus
      });
      
      if (response.data.success) {
        toast.success('Status do produto atualizado!');
        loadProdutos();
      }
    } catch (error) {
      toast.error('Erro ao atualizar status do produto');
    }
  };

  const getStatusBadge = (produto) => {
    if (!produto.ativo) {
      return <span className="badge badge-danger">Inativo</span>;
    }
    
    if (produto.estoque <= produto.estoque_minimo) {
      return <span className="badge badge-warning">Estoque Baixo</span>;
    }
    
    if (produto.estoque === 0) {
      return <span className="badge badge-danger">Sem Estoque</span>;
    }
    
    return <span className="badge badge-success">Ativo</span>;
  };

  const handleSaveProduct = (produto) => {
    setShowModal(false);
    setEditingProduct(null);
    loadProdutos();
  };

  const handleCancelProduct = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display mb-2">
              📦 Gerenciamento de Produtos
            </h1>
            <p className="text-white/80">
              Gerencie seu catálogo de produtos e estoque
            </p>
          </div>
          {canEdit() && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-accent flex items-center space-x-2"
            >
              <PlusCircle size={20} />
              <span>Adicionar Produto</span>
            </button>
          )}
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Categoria */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Todas as Categorias</option>
              <option value="1">Bolos</option>
              <option value="2">Doces</option>
              <option value="3">Tortas</option>
              <option value="4">Cookies</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="">Status: Todos</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>

            {/* Botão de Filtros */}
            <button className="btn-outline flex items-center justify-center space-x-2">
              <Filter size={20} />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Imagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando produtos...</p>
                  </td>
                </tr>
              ) : produtos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum produto encontrado</p>
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => (
                  <tr key={produto.id} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{produto.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {produto.imagens && produto.imagens.length > 0 ? (
                          <img
                            src={produto.imagens[0]}
                            alt={produto.nome}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {produto.nome}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {produto.descricao_curta || produto.descricao}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {produto.categoria?.nome || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(produto.preco_atual || produto.preco)}
                        </div>
                        {produto.em_promocao && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatCurrency(produto.preco)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {formatNumber(produto.estoque)}
                        </span>
                        {produto.estoque <= produto.estoque_minimo && (
                          <AlertTriangle className="h-4 w-4 text-warning ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(produto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* Implementar visualização */}}
                          className="text-accent hover:text-accent-dark"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {canEdit() && (
                          <button
                            onClick={() => {
                              setEditingProduct(produto);
                              setShowModal(true);
                            }}
                            className="text-primary hover:text-primary-dark"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        
                        {canEdit() && (
                          <button
                            onClick={() => handleToggleStatus(produto.id, produto.ativo)}
                            className={`${
                              produto.ativo 
                                ? 'text-warning hover:text-yellow-600' 
                                : 'text-success hover:text-green-600'
                            }`}
                            title={produto.ativo ? 'Desativar' : 'Ativar'}
                          >
                            <Archive size={16} />
                          </button>
                        )}
                        
                        {canDelete() && (
                          <button
                            onClick={() => handleDelete(produto.id)}
                            className="text-danger hover:text-red-600"
                            title="Deletar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Produto */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                <FormProduto
                  produto={editingProduct}
                  categorias={categorias}
                  onSave={handleSaveProduct}
                  onCancel={handleCancelProduct}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;