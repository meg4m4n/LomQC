import React, { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Measurement } from '../types';

type MeasurementsTableProps = {
  measurements: Measurement[];
  onAddMeasurement: (measurement: Measurement) => void;
  onRemoveMeasurement: (id: string) => void;
  onUpdateMeasurement: (id: string, measurement: Partial<Measurement>) => void;
};

function MeasurementsTable({
  measurements,
  onAddMeasurement,
  onRemoveMeasurement,
  onUpdateMeasurement,
}: MeasurementsTableProps) {
  const [newMeasurement, setNewMeasurement] = useState<Partial<Measurement>>({
    description: '',
    expectedValue: 0,
    tolerance: 0,
    unit: 'cm',
  });

  const handleAddMeasurement = () => {
    if (!newMeasurement.description) return;

    onAddMeasurement({
      id: Date.now().toString(),
      description: newMeasurement.description || '',
      expectedValue: newMeasurement.expectedValue || 0,
      actualValue: 0,
      tolerance: newMeasurement.tolerance || 0,
      unit: newMeasurement.unit || 'cm',
    });

    setNewMeasurement({
      description: '',
      expectedValue: 0,
      tolerance: 0,
      unit: 'cm',
    });
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Descrição', 'Tamanho', 'Medida (cm)', 'Tolerância (cm)'],
      ['Exemplo: Largura Peito', 'M', '50', '1'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_medidas.xlsx');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700"
        >
          <Download size={20} />
          <span>Download Template</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medida Esperada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medida Atual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tolerância
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={newMeasurement.description || ''}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nova medida"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  value={newMeasurement.expectedValue || ''}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({
                      ...prev,
                      expectedValue: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  disabled
                  className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  value="0"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  value={newMeasurement.tolerance || ''}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({
                      ...prev,
                      tolerance: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={newMeasurement.unit || 'cm'}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={handleAddMeasurement}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus size={20} />
                </button>
              </td>
            </tr>
            {measurements.map((measurement) => (
              <tr key={measurement.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={measurement.description}
                    onChange={(e) =>
                      onUpdateMeasurement(measurement.id, {
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={measurement.expectedValue}
                    onChange={(e) =>
                      onUpdateMeasurement(measurement.id, {
                        expectedValue: parseFloat(e.target.value),
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={measurement.actualValue}
                    onChange={(e) =>
                      onUpdateMeasurement(measurement.id, {
                        actualValue: parseFloat(e.target.value),
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={measurement.tolerance}
                    onChange={(e) =>
                      onUpdateMeasurement(measurement.id, {
                        tolerance: parseFloat(e.target.value),
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={measurement.unit}
                    onChange={(e) =>
                      onUpdateMeasurement(measurement.id, { unit: e.target.value })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onRemoveMeasurement(measurement.id)}
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
    </div>
  );
}

export default MeasurementsTable;