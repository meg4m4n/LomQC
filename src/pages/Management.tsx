import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProductType, Controller } from '../types';

function Management() {
  const [activeTab, setActiveTab] = useState<'products' | 'controllers'>('products');
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductType> | null>(null);
  const [editingController, setEditingController] = useState<Partial<Controller> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

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
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleSaveController = async () => {
    if (!editingController) return;

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
    } catch (error) {
      console.error('Error saving controller:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteController = async (id: string) => {
    try {
      const { error } = await supabase
        .from('controllers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting controller:', error);
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
                          URL da Imagem
                          <input
                            type="text"
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
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
                    <img
                      src={type.imageUrl}
                      alt={type.description}
                      className="w-full h-48 object-cover"
                    />
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
                          onClick={() => handleDeleteProduct(type.id)}
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
                              onClick={() => handleDeleteController(controller.id)}
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
    </div>
  );
}

export default Management;