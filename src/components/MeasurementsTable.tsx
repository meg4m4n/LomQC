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
    code: '',
    description: '',
    expectedValue: 0,
    tolerance: 3,
    unit: 'cm',
    size: ''
  });

  const handleAddMeasurement = () => {
    if (!newMeasurement.code || !newMeasurement.description) return;

    onAddMeasurement({
      id: Date.now().toString(),
      code: newMeasurement.code || '',
      description: newMeasurement.description || '',
      expectedValue: newMeasurement.expectedValue || 0,
      actualValue: null,
      tolerance: newMeasurement.tolerance || 3,
      unit: newMeasurement.unit || 'cm',
      size: newMeasurement.size || ''
    });

    setNewMeasurement({
      code: '',
      description: '',
      expectedValue: 0,
      tolerance: 3,
      unit: 'cm',
      size: ''
    });
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Sigla', 'Descrição', 'Medida (cm)', 'Tolerância (%)'],
      ['LP', 'Largura Peito', '50', '3'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_medidas.xlsx');
  };

  const isWithinTolerance = (expected: number, actual: number | null) => {
    if (actual === null) return null;
    const tolerance = 3; // Fixed 3% tolerance
    const toleranceValue = expected * (tolerance / 100);
    return Math.abs(expected - actual) <= toleranceValue;
  };

  const getDifference = (expected: number, actual: number | null) => {
    if (actual === null) return null;
    return (actual - expected).toFixed(2);
  };

  const getRowStyle = (measurement: Measurement) => {
    if (measurement.actualValue === null) return '';
    return isWithinTolerance(measurement.expectedValue, measurement.actualValue)
      ? 'bg-green-50'
      : 'bg-red-50';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700"
        >
          <Download size={20} />
          <span>Download Template</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sigla
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medida Pedida
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medida Controlada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tolerância (%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diferença
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
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={newMeasurement.code || ''}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Sigla"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={newMeasurement.description || ''}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Descrição"
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
                  value=""
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  value={3}
                  disabled
                  className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                -
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

            {measurements.map((measurement) => {
              const difference = getDifference(measurement.expectedValue, measurement.actualValue);
              const withinTolerance = isWithinTolerance(measurement.expectedValue, measurement.actualValue);

              return (
                <tr key={measurement.id} className={getRowStyle(measurement)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={measurement.code}
                      onChange={(e) =>
                        onUpdateMeasurement(measurement.id, {
                          code: e.target.value,
                        })
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
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
                      value={measurement.actualValue || ''}
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
                      value={3}
                      disabled
                      className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {difference ? `${difference} cm` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {measurement.actualValue !== null && (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        withinTolerance
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {withinTolerance ? 'OK' : 'NOK'}
                      </span>
                    )}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MeasurementsTable;