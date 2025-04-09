import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Printer, Plus, Trash2 } from 'lucide-react';
import { ServiceOrderPDF } from './components/ServiceOrderPDF';
import { ServiceOrder, Part } from './types';

function App() {
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder>({
    technician: '',
    client: '',
    equipment: '',
    model: '',
    serialNumber: '',
    defect: '',
    solution: '',
    observations: '',
    parts: [],
    serviceValue: 0,
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: '',
  });

  const [newPart, setNewPart] = useState<Part>({
    description: '',
    value: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'serviceValue') {
      setServiceOrder((prev) => ({
        ...prev,
        [name]: value ? Number(value) : 0,
      }));
    } else {
      setServiceOrder((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddPart = () => {
    if (newPart.description && typeof newPart.value === 'number' && newPart.value > 0) {
      setServiceOrder((prev) => ({
        ...prev,
        parts: [...prev.parts, { ...newPart, value: Number(newPart.value) }],
      }));
      setNewPart({ description: '', value: 0 });
    }
  };

  const handleRemovePart = (index: number) => {
    setServiceOrder((prev) => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    const partsTotal = serviceOrder.parts.reduce((sum, part) => {
      const value = typeof part.value === 'number' ? part.value : 0;
      return sum + value;
    }, 0);
    const serviceValue = typeof serviceOrder.serviceValue === 'number' ? Number(serviceOrder.serviceValue) : 0;
    return partsTotal + serviceValue;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Relatório de Serviço</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Técnico</label>
            <input
              type="text"
              name="technician"
              value={serviceOrder.technician}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input
              type="text"
              name="client"
              value={serviceOrder.client}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipamento</label>
            <input
              type="text"
              name="equipment"
              value={serviceOrder.equipment}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input
              type="text"
              name="model"
              value={serviceOrder.model}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Série</label>
            <input
              type="text"
              name="serialNumber"
              value={serviceOrder.serialNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrada</label>
            <input
              type="date"
              name="entryDate"
              value={serviceOrder.entryDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Saída</label>
            <input
              type="date"
              name="exitDate"
              value={serviceOrder.exitDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Defeito Apresentado</label>
          <textarea
            name="defect"
            value={serviceOrder.defect}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Solução</label>
          <textarea
            name="solution"
            value={serviceOrder.solution}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            name="observations"
            value={serviceOrder.observations}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Peças Utilizadas</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Descrição da peça"
              value={newPart.description}
              onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Valor"
              value={newPart.value || ''}
              onChange={(e) => setNewPart({ ...newPart, value: e.target.value ? Number(e.target.value) : 0 })}
              min="0"
              step="0.01"
              className="w-32 p-2 border rounded"
            />
            <button
              onClick={handleAddPart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <Plus size={20} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Serviço (R$)</label>
            <input
              type="number"
              name="serviceValue"
              value={serviceOrder.serviceValue || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            {serviceOrder.parts.map((part, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>{part.description}</span>
                <div className="flex items-center gap-4">
                  <span>R$ {part.value.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemovePart(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-6">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold">R$ {calculateTotal().toFixed(2)}</span>
        </div>

        <div className="flex justify-center">
          <PDFDownloadLink
            document={<ServiceOrderPDF serviceOrder={serviceOrder} />}
            fileName={`ordem-servico-${serviceOrder.client.toLowerCase().replace(/\s+/g, '-')}.pdf`}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer size={20} />
            Gerar Relatório PDF
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}

export default App;