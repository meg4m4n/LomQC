import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProductType, Controller } from '../types';
import DeleteConfirmation from '../components/DeleteConfirmation';
import toast from 'react-hot-toast';

function Management() {
  const [activeTab, setActiveTab] = useState<'products' | 'controllers'>('products');
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductType> | null>(null);
  const [editingController, setEditingController] = useState<Partial<Controller> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'product' | 'controller' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
    ensureStorageBucket();
  }, []);

  const ensureStorageBucket = async () => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const productImagesBucket = buckets?.find(b => b.name === 'product-images');
      
      if (!productImagesBucket) {
        const { error } = await supabase.storage.createBucket('product-images', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
        });
        
        if (error) {
          console.error('Error creating bucket:', error);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking storage bucket:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [{ data: products }, { data: controllers }] = await Promise.all([
        supabase.from('product_types').select('*'),
        supabase.from('controllers').select('*')
      ]);

      if (products) setProductTypes(products);
      if (controllers) setControllers(controllers);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct({
      description: '',
      imageUrl: ''
    });
  };

  const handleAddController = () => {
    setEditingController({
      name: '',
      active: true
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setEditingProduct(prev => ({
        ...prev,
        imageUrl: publicUrl
      }));
      
      toast.success('Imagem carregada com sucesso');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Erro ao fazer upload da imagem');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.description) {
      toast.error('Descrição é obrigatória');
      return;
    }

    try {
      if (editingProduct.id) {
        const { error } = await supabase
          .from('product_types')
          .update({
            description: editingProduct.description,
            image_url: editingProduct.imageUrl
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_types')
          .insert({
            description: editingProduct.description,
            image_url: editingProduct.imageUrl
          });

        if (error) throw error;
      }

      await loadData();
      setEditingProduct(null);
      toast.success('Tipo de peça salvo com sucesso');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erro ao salvar tipo de peça');
    }
  };

  const handleSaveController = async () => {
    if (!editingController?.name) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      if (editingController.id) {
        const { error } = await supabase
          .from('controllers')
          .update({
            name: editingController.name,
            active: editingController.active
          })
          .eq('id', editingController.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('controllers')
          .insert({
            name: editingController.name,
            active: editingController.active
          });

        if (error) throw error;
      }

      await loadData();
      setEditingController(null);
      toast.success('Controlador salvo com sucesso');
    } catch (error) {
      console.error('Error saving controller:', error);
      toast.error('Erro ao salvar controlador');
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      if (deleteItem.type === 'product') {
        // Delete the image from storage if it exists
        const product = productTypes.find(p => p.id === deleteItem.id);
        if (product?.imageUrl) {
          const fileName = product.imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('product-images')
              .remove([fileName]);
          }
        }

        const { error } = await supabase
          .from('product_types')
          .delete()
          .eq('id', deleteItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('controllers')
          .delete()
          .eq('id', deleteItem.id);

        if (error) throw error;
      }

      await loadData();
      toast.success('Item excluído com sucesso');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erro ao excluir item');
    } finally {
      setDeleteItem(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestão</h1>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tipos de Peça
            </button>
            <button
              onClick={() => setActiveTab('controllers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'controllers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Controladores
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Tipos de Peça</h2>
                <button
                  onClick={handleAddProduct}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700"
                >
                  <Plus size={20} />
                  <span>Novo Tipo</span>
                </button>
              </div>

              {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingProduct.id ? 'Editar Tipo de Peça' : 'Novo Tipo de Peça'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Descrição
                          <input
                            type="text"
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Imagem
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            disabled={isUploading}
                            className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100
                              disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </label>
                        {isUploading && (
                          <div className="mt-2 text-sm text-blue-600">
                            Fazendo upload...
                          </div>
                        )}
                        {editingProduct.imageUrl && (
                          <img
                            src={editingProduct.imageUrl}
                            alt="Preview"
                            className="mt-2 h-32 w-32 object-cover rounded-md"
                          />
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveProduct}
                        disabled={isUploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productTypes.map((type) => (
                  <div key={type.id} className="border rounded-lg overflow-hidden">
                    {type.imageUrl && (
                      <img
                        src={type.imageUrl}
                        alt={type.description}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{type.description}</h3>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => setEditingProduct(type)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => setDeleteItem({ id: type.id, type: 'product' })}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Controladores</h2>
                <button
                  onClick={handleAddController}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700"
                >
                  <Plus size={20} />
                  <span>Novo Controlador</span>
                </button>
              </div>

              {editingController && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingController.id ? 'Editar Controlador' : 'Novo Controlador'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nome
                          <input
                            type="text"
                            value={editingController.name || ''}
                            onChange={(e) => setEditingController(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <input
                            type="checkbox"
                            checked={editingController.active}
                            onChange={(e) => setEditingController(prev => ({ ...prev, active: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                          />
                          Ativo
                        </label>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingController(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveController}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {controllers.map((controller) => (
                      <tr key={controller.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {controller.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              controller.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {controller.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingController(controller)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => setDeleteItem({ id: controller.id, type: 'controller' })}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmation
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title={`Excluir ${deleteItem?.type === 'product' ? 'Tipo de Peça' : 'Controlador'}`}
        message={`Tem certeza que deseja excluir este ${deleteItem?.type === 'product' ? 'tipo de peça' : 'controlador'}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}

export default Management;