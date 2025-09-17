import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Tag,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api, formatCurrency, formatNumber } from '../services/api';
import toast from 'react-hot-toast';

const Cupons = () => {
  const { canEdit, canDelete } = useAuth();
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    tipo: 'percentual',
    valor: '',
    valor_minimo_pedido: '',
    usos_maximo: '',
    usos_por_usuario: '1',
    data_inicio: '',
    data_fim: '',
    ativo: true
  });

  // Carrega cupons
  const loadCupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/coupons');
      
      if (response.data.success) {
        setCupons(response.data.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar cupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canEdit()) {
      toast.error('Você não tem permissão para criar/editar cupons');
      return;
    }

    try {
      const data = {
        ...formData,
        valor: parseFloat(formData.valor),
        valor_minimo_pedido: parseFloat(formData.valor_minimo_pedido) || 0,
        usos_maximo: formData.usos_maximo ? parseInt(formData.usos_maximo) : null,
        usos_por_usuario: parseInt(formData.usos_por_usuario)
      };

      let response;
      if (editingCoupon) {
        response = await api.put(`/admin/coupons/${editingCoupon.codigo}`, data);
      } else {
        response = await api.post('/admin/coupons', data);
      }

      if (response.data.success) {
        toast.success(editingCoupon ? 'Cupom atualizado!' : 'Cupom criado!');
        setShowModal(false);
        setEditingCoupon(null);
        resetForm();
        loadCupons();
      }
    } catch (error) {
      toast.error('Erro ao salvar cupom');
    }
  };

  const handleDelete = async (codigo) => {
    if (!canDelete()) {
      toast.error('Você não tem permissão para deletar cupons');
      return;
    }

    if (window.confirm('Tem certeza que deseja deletar este cupom?')) {
      try {
        const response = await api.delete(`/admin/coupons/${codigo}`);
        if (response.data.success) {
          toast.success('Cupom deletado!');
          loadCupons();
        }
      } catch (error) {
        toast.error('Erro ao deletar cupom');
      }
    }
  };

  const handleEdit = (cupom) => {
    setEditingCoupon(cupom);
    setFormData({
      codigo: cupom.codigo,
      nome: cupom.nome,
      descricao: cupom.descricao || '',
      tipo: cupom.tipo,
      valor: cupom.valor.toString(),
      valor_minimo_pedido: cupom.valor_minimo_pedido.toString(),
      usos_maximo: cupom.usos_maximo?.toString() || '',
      usos_por_usuario: cupom.usos_por_usuario.toString(),
      data_inicio: cupom.data_inicio ? cupom.data_inicio.split('T')[0] : '',
      data_fim: cupom.data_fim ? cupom.data_fim.split('T')[0] : '',
      ativo: cupom.ativo
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      tipo: 'percentual',
      valor: '',
      valor_minimo_pedido: '',
      usos_maximo: '',
      usos_por_usuario: '1',
      data_inicio: '',
      data_fim: '',
      ativo: true
    });
  };

  const getStatusBadge = (cupom) => {
    const now = new Date();
    const inicio = new Date(cupom.data_inicio);
    const fim = new Date(cupom.data_fim);

    if (!cupom.ativo) {
      return <span className="badge badge-danger">Inativo</span>;
    }

    if (now < inicio) {
      return <span className="badge badge-info">Agendado</span>;
    }

    if (now > fim) {
      return <span className="badge badge-danger">Expirado</span>;
    }

    if (cupom.usos_maximo && cupom.usos_atual >= cupom.usos_maximo) {
      return <span className="badge badge-warning">Esgotado</span>;
    }

    return <span className="badge badge-success">Ativo</span>;
  };

  const getTipoText = (tipo) => {
    const tipos = {
      'percentual': 'Percentual',
      'valor_fixo': 'Valor Fixo',
      'frete_gratis': 'Frete Grátis'
    };
    return tipos[tipo] || tipo;
  };

  const formatValor = (tipo, valor) => {
    if (tipo === 'percentual') {
      return `${valor}%`;
    } else if (tipo === 'valor_fixo') {
      return formatCurrency(valor);
    } else {
      return 'Grátis';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display mb-2">
              🎫 Gerenciamento de Cupons
            </h1>
            <p className="text-white/80">
              Crie e gerencie cupons de desconto para seus clientes
            </p>
          </div>
          {canEdit() && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusCircle size={20} />
              <span>Criar Cupom</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-white/80">Cupons Ativos</p>
                <p className="text-2xl font-bold text-white">
                  {cupons.filter(c => c.ativo && new Date(c.data_fim) > new Date()).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-white/80">Usos Hoje</p>
                <p className="text-2xl font-bold text-white">45</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-white/80">Economia Total</p>
                <p className="text-2xl font-bold text-white">R$ 1.234</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-white/80">Taxa de Uso</p>
                <p className="text-2xl font-bold text-white">67%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Cupons */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Usos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Validade
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
                    <p className="text-gray-600">Carregando cupons...</p>
                  </td>
                </tr>
              ) : cupons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum cupom encontrado</p>
                  </td>
                </tr>
              ) : (
                cupons.map((cupom) => (
                  <tr key={cupom.id} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-primary">
                        {cupom.codigo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cupom.nome}
                        </div>
                        {cupom.descricao && (
                          <div className="text-sm text-gray-500">
                            {cupom.descricao}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {getTipoText(cupom.tipo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatValor(cupom.tipo, cupom.valor)}
                      </div>
                      {cupom.valor_minimo_pedido > 0 && (
                        <div className="text-sm text-gray-500">
                          Min: {formatCurrency(cupom.valor_minimo_pedido)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cupom.usos_atual || 0}
                        {cupom.usos_maximo && ` / ${cupom.usos_maximo}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cupom.usos_por_usuario} por cliente
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(cupom.data_inicio).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        até {new Date(cupom.data_fim).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(cupom)}
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
                            onClick={() => handleEdit(cupom)}
                            className="text-primary hover:text-primary-dark"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        
                        {canDelete() && (
                          <button
                            onClick={() => handleDelete(cupom.codigo)}
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

      {/* Modal de Cupom */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingCoupon ? 'Editar Cupom' : 'Criar Novo Cupom'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Código */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código do Cupom *
                      </label>
                      <input
                        type="text"
                        value={formData.codigo}
                        onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                        className="input-field"
                        placeholder="Ex: PRIMEIRACOMPRA"
                        required
                      />
                    </div>

                    {/* Nome */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Cupom *
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="input-field"
                        placeholder="Ex: Desconto para novos clientes"
                        required
                      />
                    </div>

                    {/* Tipo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Desconto *
                      </label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                        className="input-field"
                        required
                      >
                        <option value="percentual">Percentual (%)</option>
                        <option value="valor_fixo">Valor Fixo (R$)</option>
                        <option value="frete_gratis">Frete Grátis</option>
                      </select>
                    </div>

                    {/* Valor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor do Desconto *
                      </label>
                      <input
                        type="number"
                        value={formData.valor}
                        onChange={(e) => setFormData({...formData, valor: e.target.value})}
                        className="input-field"
                        placeholder="10"
                        step="0.01"
                        required
                      />
                    </div>

                    {/* Valor Mínimo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor Mínimo do Pedido
                      </label>
                      <input
                        type="number"
                        value={formData.valor_minimo_pedido}
                        onChange={(e) => setFormData({...formData, valor_minimo_pedido: e.target.value})}
                        className="input-field"
                        placeholder="50.00"
                        step="0.01"
                      />
                    </div>

                    {/* Usos Máximo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Máximo de Usos
                      </label>
                      <input
                        type="number"
                        value={formData.usos_maximo}
                        onChange={(e) => setFormData({...formData, usos_maximo: e.target.value})}
                        className="input-field"
                        placeholder="100"
                      />
                    </div>

                    {/* Usos por Usuário */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usos por Cliente
                      </label>
                      <input
                        type="number"
                        value={formData.usos_por_usuario}
                        onChange={(e) => setFormData({...formData, usos_por_usuario: e.target.value})}
                        className="input-field"
                        placeholder="1"
                        min="1"
                        required
                      />
                    </div>

                    {/* Data de Início */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Início
                      </label>
                      <input
                        type="date"
                        value={formData.data_inicio}
                        onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    {/* Data de Fim */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Expiração
                      </label>
                      <input
                        type="date"
                        value={formData.data_fim}
                        onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    {/* Descrição */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        className="input-field"
                        rows="3"
                        placeholder="Descrição do cupom..."
                      />
                    </div>

                    {/* Ativo */}
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.ativo}
                          onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Cupom ativo
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn-primary mr-3"
                  >
                    {editingCoupon ? 'Atualizar' : 'Criar'} Cupom
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCoupon(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cupons;