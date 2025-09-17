import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Package, 
  DollarSign, 
  AlertTriangle,
  Save,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const FormProduto = ({ 
  produto = null, 
  onSave, 
  onCancel, 
  categorias = [] 
}) => {
  const { canEdit } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria_id: '',
    subcategoria: '',
    preco: '',
    preco_promocional: '',
    estoque: '',
    estoque_minimo: '',
    peso: '',
    comprimento: '',
    largura: '',
    altura: '',
    ativo: true,
    destaque: false,
    tags: '',
    imagens: [],
    variacoes: []
  });

  const [imagensPreview, setImagensPreview] = useState([]);
  const [novaVariacao, setNovaVariacao] = useState({
    nome: '',
    tipo: 'cor',
    opcoes: []
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        categoria_id: produto.categoria_id || '',
        subcategoria: produto.subcategoria || '',
        preco: produto.preco || '',
        preco_promocional: produto.preco_promocional || '',
        estoque: produto.estoque || '',
        estoque_minimo: produto.estoque_minimo || '',
        peso: produto.peso || '',
        comprimento: produto.comprimento || '',
        largura: produto.largura || '',
        altura: produto.altura || '',
        ativo: produto.ativo !== false,
        destaque: produto.destaque || false,
        tags: produto.tags || '',
        imagens: produto.imagens || [],
        variacoes: produto.variacoes || []
      });
      setImagensPreview(produto.imagens || []);
    }
  }, [produto]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...imagensPreview];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            url: e.target.result,
            file: file,
            isNew: true
          });
          setImagensPreview([...newImages]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = imagensPreview.filter((_, i) => i !== index);
    setImagensPreview(newImages);
    setFormData(prev => ({
      ...prev,
      imagens: newImages
    }));
  };

  const addVariacao = () => {
    if (novaVariacao.nome && novaVariacao.opcoes.length > 0) {
      setFormData(prev => ({
        ...prev,
        variacoes: [...prev.variacoes, { ...novaVariacao }]
      }));
      setNovaVariacao({
        nome: '',
        tipo: 'cor',
        opcoes: []
      });
    }
  };

  const removeVariacao = (index) => {
    setFormData(prev => ({
      ...prev,
      variacoes: prev.variacoes.filter((_, i) => i !== index)
    }));
  };

  const addOpcaoVariacao = () => {
    setNovaVariacao(prev => ({
      ...prev,
      opcoes: [...prev.opcoes, { nome: '', valor: '' }]
    }));
  };

  const updateOpcaoVariacao = (index, field, value) => {
    setNovaVariacao(prev => ({
      ...prev,
      opcoes: prev.opcoes.map((opcao, i) => 
        i === index ? { ...opcao, [field]: value } : opcao
      )
    }));
  };

  const removeOpcaoVariacao = (index) => {
    setNovaVariacao(prev => ({
      ...prev,
      opcoes: prev.opcoes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canEdit()) {
      toast.error('Você não tem permissão para criar/editar produtos');
      return;
    }

    setLoading(true);
    
    try {
      const data = {
        ...formData,
        preco: parseFloat(formData.preco),
        preco_promocional: formData.preco_promocional ? parseFloat(formData.preco_promocional) : null,
        estoque: parseInt(formData.estoque),
        estoque_minimo: parseInt(formData.estoque_minimo),
        peso: formData.peso ? parseFloat(formData.peso) : null,
        comprimento: formData.comprimento ? parseFloat(formData.comprimento) : null,
        largura: formData.largura ? parseFloat(formData.largura) : null,
        altura: formData.altura ? parseFloat(formData.altura) : null,
        imagens: imagensPreview,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      let response;
      if (produto) {
        response = await api.put(`/admin/products/${produto.id}`, data);
      } else {
        response = await api.post('/admin/products', data);
      }

      if (response.data.success) {
        toast.success(produto ? 'Produto atualizado!' : 'Produto criado!');
        onSave(response.data.data);
      }
    } catch (error) {
      toast.error('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Informações Básicas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="input-field"
                placeholder="Ex: Sedinha Morning Flix X-Large"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className="input-field"
                rows="4"
                placeholder="Descrição detalhada do produto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) => handleInputChange('categoria_id', e.target.value)}
                className="input-field"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategoria
              </label>
              <input
                type="text"
                value={formData.subcategoria}
                onChange={(e) => handleInputChange('subcategoria', e.target.value)}
                className="input-field"
                placeholder="Ex: Papéis de Seda"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="input-field"
                placeholder="Ex: sedinha, papel, smoking, premium"
              />
            </div>
          </div>
        </div>

        {/* Preços e Estoque */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-secondary" />
            Preços e Estoque
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Regular *
              </label>
              <input
                type="number"
                value={formData.preco}
                onChange={(e) => handleInputChange('preco', e.target.value)}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Promocional
              </label>
              <input
                type="number"
                value={formData.preco_promocional}
                onChange={(e) => handleInputChange('preco_promocional', e.target.value)}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque Atual *
              </label>
              <input
                type="number"
                value={formData.estoque}
                onChange={(e) => handleInputChange('estoque', e.target.value)}
                className="input-field"
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque Mínimo
              </label>
              <input
                type="number"
                value={formData.estoque_minimo}
                onChange={(e) => handleInputChange('estoque_minimo', e.target.value)}
                className="input-field"
                placeholder="5"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Imagens */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-accent" />
            Imagens do Produto
          </h3>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arraste e solte imagens aqui ou clique para selecionar
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn-outline cursor-pointer"
              >
                Selecionar Imagens
              </label>
            </div>

            {imagensPreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagensPreview.map((imagem, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imagem.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dimensões e Peso */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-dark" />
            Dimensões e Peso
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                value={formData.peso}
                onChange={(e) => handleInputChange('peso', e.target.value)}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento (cm)
              </label>
              <input
                type="number"
                value={formData.comprimento}
                onChange={(e) => handleInputChange('comprimento', e.target.value)}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largura (cm)
              </label>
              <input
                type="number"
                value={formData.largura}
                onChange={(e) => handleInputChange('largura', e.target.value)}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                value={formData.altura}
                onChange={(e) => handleInputChange('altura', e.target.value)}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Variações */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-primary" />
            Variações do Produto
          </h3>
          
          <div className="space-y-4">
            {/* Nova Variação */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Adicionar Nova Variação</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Variação
                  </label>
                  <input
                    type="text"
                    value={novaVariacao.nome}
                    onChange={(e) => setNovaVariacao(prev => ({...prev, nome: e.target.value}))}
                    className="input-field"
                    placeholder="Ex: Cor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={novaVariacao.tipo}
                    onChange={(e) => setNovaVariacao(prev => ({...prev, tipo: e.target.value}))}
                    className="input-field"
                  >
                    <option value="cor">Cor</option>
                    <option value="tamanho">Tamanho</option>
                    <option value="sabor">Sabor</option>
                    <option value="material">Material</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addOpcaoVariacao}
                    className="btn-outline w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Opção
                  </button>
                </div>
              </div>

              {/* Opções da Variação */}
              {novaVariacao.opcoes.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h5 className="font-medium text-gray-700">Opções:</h5>
                  {novaVariacao.opcoes.map((opcao, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={opcao.nome}
                        onChange={(e) => updateOpcaoVariacao(index, 'nome', e.target.value)}
                        className="input-field flex-1"
                        placeholder="Nome da opção"
                      />
                      <input
                        type="text"
                        value={opcao.valor}
                        onChange={(e) => updateOpcaoVariacao(index, 'valor', e.target.value)}
                        className="input-field flex-1"
                        placeholder="Valor (ex: #FF0000 para cor)"
                      />
                      <button
                        type="button"
                        onClick={() => removeOpcaoVariacao(index)}
                        className="btn-danger p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={addVariacao}
                className="btn-primary"
                disabled={!novaVariacao.nome || novaVariacao.opcoes.length === 0}
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Variação
              </button>
            </div>

            {/* Variações Existentes */}
            {formData.variacoes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Variações Adicionadas:</h4>
                {formData.variacoes.map((variacao, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">{variacao.nome}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({variacao.opcoes.length} opções)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariacao(index)}
                      className="text-danger hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Configurações */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
            Configurações
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => handleInputChange('ativo', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Produto ativo (visível na loja)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.destaque}
                onChange={(e) => handleInputChange('destaque', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Produto em destaque
              </span>
            </label>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <>
                <div className="spinner mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {produto ? 'Atualizar' : 'Criar'} Produto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProduto;