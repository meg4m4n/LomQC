import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Upload, Save } from 'lucide-react';
import type { QualityControl, Measurement, Photo } from '../types';

function QualityControlForm() {
  const { id } = useParams();
  const isNew = !id;

  const [formData, setFormData] = useState<Partial<QualityControl>>({
    controlRef: '',
    date: new Date().toISOString().split('T')[0],
    modelRef: '',
    brand: '',
    description: '',
    state: 'proto1',
    color: '',
    size: '',
    productTypeId: '',
    controllerId: '',
    measurements: [],
    photos: [],
    observations: '',
    result: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle Excel file upload for measurements
  };

  const handlePhotoCapture = () => {
    // Handle photo capture
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isNew ? 'Novo Controle de Qualidade' : 'Editar Controle de Qualidade'}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ref. Controle
              <input
                type="text"
                name="controlRef"
                value={formData.controlRef}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ref. Modelo
              <input
                type="text"
                name="modelRef"
                value={formData.modelRef}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marca
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Descrição
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="proto1">1º Proto</option>
                <option value="proto2">2º Proto</option>
                <option value="proto3">3º Proto</option>
                <option value="proto4">4º Proto</option>
                <option value="sms">SMS</option>
                <option value="size-set">Size Set</option>
                <option value="pre-production">Pré-produção</option>
                <option value="production">Produção</option>
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cor
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Medidas</h2>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => document.getElementById('excel-upload')?.click()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload size={20} />
              <span>Importar Excel</span>
            </button>
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Measurements table will go here */}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Fotos</h2>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handlePhotoCapture}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Camera size={20} />
              <span>Capturar Foto</span>
            </button>
          </div>

          {/* Photo gallery will go here */}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Observações</h2>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleInputChange}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save size={20} />
            <span>Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QualityControlForm;