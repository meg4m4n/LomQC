import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DeleteConfirmation from '../components/DeleteConfirmation';
import toast from 'react-hot-toast';
import type { QualityControl } from '../types';

function QualityControlList() {
  const [controls, setControls] = useState<QualityControl[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadControls();
  }, []);

  const loadControls = async () => {
    try {
      const { data, error } = await supabase
        .from('quality_controls')
        .select(`
          *,
          product_type:product_types(description),
          controller:controllers(name),
          measurements(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setControls(data || []);
    } catch (error) {
      console.error('Error loading controls:', error);
      toast.error('Erro ao carregar controles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('quality_controls')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setControls(controls.filter(control => control.id !== deleteId));
      toast.success('Controle excluído com sucesso');
    } catch (error) {
      console.error('Error deleting control:', error);
      toast.error('Erro ao excluir controle');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredControls = controls.filter(control => 
    control.control_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.model_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (result: string | null) => {
    switch (result) {
      case 'OK':
        return 'bg-green-100 text-green-800';
      case 'NOK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadExcelTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template_medidas.xlsx';
    link.download = 'template_medidas.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Controle de Qualidade</h1>
        <div className="flex space-x-4">
          <button
            onClick={downloadExcelTemplate}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700"
          >
            <FileText size={20} />
            <span>Template Excel</span>
          </button>
          <Link
            to="/quality-control/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Novo Controle</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar controles..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ref. Controle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ref. Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Controlador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medidas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredControls.map((control) => (
                  <tr
                    key={control.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                        to={`/quality-control/${control.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {control.control_ref}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(control.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {control.model_ref}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {control.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {control.product_type?.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {control.controller?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {control.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {control.measurements?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(control.result)}`}
                      >
                        {control.result || 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setDeleteId(control.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmation
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Controle de Qualidade"
        message="Tem certeza que deseja excluir este controle de qualidade? Esta ação não pode ser desfeita."
      />
    </div>
  );
}

export default QualityControlList;