
import React, { useState } from 'react';
import { MinuteData } from '../types/index.ts';
import { generateLegislativeMinute } from '../services/openai.ts';

interface Props {
  onGenerate: (text: string) => void;
}

export const MinutesForm: React.FC<Props> = ({ onGenerate }) => {
  // Fix: Removed MinuteData generic as it does not match the form fields.
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    participants: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Fix: Construct a descriptive string to pass to the service which expects a string argument.
      const summaryString = `Sessão: ${formData.title}. Data: ${formData.date}. Local: ${formData.location}. Participantes: ${formData.participants}. Resumo: ${formData.content}`;
      const generatedData = await generateLegislativeMinute(summaryString);
      // Fix: Stringify the response object to match the onGenerate(text: string) prop requirement.
      onGenerate(JSON.stringify(generatedData));
    } catch (error) {
      alert("Falha ao gerar ata. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Nova Ata Legislativa</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Título da Sessão</label>
          <input
            name="title"
            className="input-field"
            placeholder="Ex: 42ª Sessão Ordinária"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            name="date"
            type="date"
            className="input-field"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Local</label>
          <input
            name="location"
            className="input-field"
            placeholder="Ex: Plenário Principal"
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Participantes</label>
          <input
            name="participants"
            className="input-field"
            placeholder="Vereador João, Secretária Maria..."
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Relato das Discussões</label>
          <textarea
            name="content"
            rows={6}
            className="input-field resize-none"
            placeholder="Descreva o que aconteceu na sessão de forma resumida..."
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? 'Processando com IA...' : 'Gerar Ata Formal'}
          </button>
        </div>
      </form>
    </div>
  );
};
