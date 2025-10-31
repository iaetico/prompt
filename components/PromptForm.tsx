import React, { useState, useEffect } from 'react';
import type { FormField } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptFormProps {
  fields: FormField[];
  onPromptGenerated: (data: { [key: string]: string }) => void;
  isLoading: boolean;
  initialData?: { [key: string]: string };
}

export const PromptForm: React.FC<PromptFormProps> = ({ fields, onPromptGenerated, isLoading, initialData }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Inicializa o resetea el formulario cuando cambian los campos o los datos iniciales
    const defaultData = fields.reduce((acc, field) => {
      acc[field.id] = initialData?.[field.id] || field.defaultValue || '';
      return acc;
    }, {} as { [key: string]: string });
    setFormData(defaultData);
  }, [fields, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPromptGenerated(formData);
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      value: formData[field.id] || '',
      onChange: handleChange,
      className: "w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={3} />;
      case 'select':
        return (
          <select {...commonProps}>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case 'input':
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-slate-300 mb-1">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-purple-900 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          Generar Prompt
        </button>
      </form>
    </div>
  );
};
