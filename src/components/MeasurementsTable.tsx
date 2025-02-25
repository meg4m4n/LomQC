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
    sizes: ['P']
  });

  const handleAddMeasurement = () => {
    if (!newMeasurement.code || !newMeasurement.description) return;

    onAddMeasurement({
      id: Date.now().toString(),
      code: newMeasurement.code || '',
      description: newMeasurement.description || '',
      expectedValue: newMeasurement.expectedValue || 0,
      actualValues: {},
      tolerance: 3,
      unit: 'cm',
      sizes: ['P']
    });

    setNewMeasurement({
      code: '',
      description: '',
      expectedValue: 0,
      tolerance: 3,
      unit: 'cm',
      sizes: ['P']
    });
  };

  const handleAddSizeColumn = () => {
    const newSize = prompt('Digite o novo tamanho:');
    if (!newSize) return;

    measurements.forEach(measurement => {
      if (!measurement.sizes.includes(newSize)) {
        onUpdateMeasurement(measurement.id, {
          sizes: [...measurement.sizes, newSize]
        });
      }
    });
  };

  const isWithinTolerance = (expected: number, actual: number | null, tolerance: number) => {
    if (actual === null) return null;
    const toleranceValue = expected * (tolerance / 100);
    return Math.abs(expected - actual) <= toleranceValue;
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

  // Get unique sizes across all measurements
  const allSizes = Array.from(
    new Set(measurements.flatMap(m => m.sizes))
  ).sort();

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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tolerância (%)
              </th>
              {allSizes.map(size => (
                <React.Fragment key={size}>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {size}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Controle {size}
                  </th>
                </React.Fragment>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={handleAddSizeColumn}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus size={20} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={newMeasurement.code || ''}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Código"
                />
              </td>
              <td className="px-4 py-2">
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
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={3}
                  disabled
                  className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                />
              </td>
              {allSizes.map(size => (
                <React.Fragment key={size}>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      disabled
                      className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">-</td>
                </React.Fragment>
              ))}
              <td className="px-4 py-2">
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
                <td className="px-4 py-2">
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
                <td className="px-4 py-2">
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
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={3}
                    disabled
                    className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </td>
                {allSizes.map(size => (
                  <React.Fragment key={size}>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={measurement.actualValues?.[size] || ''}
                        onChange={(e) => {
                          const newValue = e.target.value ? parseFloat(e.target.value) : null;
                          onUpdateMeasurement(measurement.id, {
                            actualValues: {
                              ...measurement.actualValues,
                              [size]: newValue
                            }
                          });
                        }}
                        placeholder="Medida"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      {measurement.actualValues?.[size] !== undefined && measurement.actualValues?.[size] !== null && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          isWithinTolerance(measurement.expectedValue, measurement.actualValues[size], measurement.tolerance)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isWithinTolerance(measurement.expectedValue, measurement.actualValues[size], measurement.tolerance)
                            ? 'OK'
                            : 'NOK'}
                        </span>
                      )}
                    </td>
                  </React.Fragment>
                ))}
                <td className="px-4 py-2">
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