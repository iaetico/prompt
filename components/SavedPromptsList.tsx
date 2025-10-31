import React, { useState } from 'react';
import type { SavedPrompt, PromptType } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SavedPromptsListProps {
  prompts: SavedPrompt[];
  onDelete: (id: string) => void;
  onSelect: (prompt: SavedPrompt) => void;
}

const typeColors: { [key in PromptType]: string } = {
  TEXTO: 'bg-blue-500',
  IMAGEN: 'bg-purple-500',
  VIDEO: 'bg-red-500',
  SONIDO: 'bg-green-500',
  CODIGO: 'bg-yellow-500 text-slate-900',
};


export const SavedPromptsList: React.FC<SavedPromptsListProps> = ({ prompts, onDelete, onSelect }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, prompt: SavedPrompt) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  };

  if (prompts.length === 0) {
    return (
      <div className="text-center text-slate-400 p-8 bg-slate-800 rounded-lg">
        <p>Aún no has guardado ningún prompt.</p>
        <p>¡Ve a la pestaña Generador para crear y guardar tu primer prompt!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => {
        // Usa una clave del formData como título, por ejemplo la primera.
        const titleKey = Object.keys(prompt.formData)[0];
        const title = prompt.formData[titleKey] || 'Prompt sin título';
        
        return (
            <div 
              key={prompt.id} 
              className="bg-slate-800 p-4 rounded-lg shadow-md relative group transition-all duration-200 hover:bg-slate-700/50 cursor-pointer"
              onClick={() => onSelect(prompt)}
            >
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-purple-400 pr-20">{title}</h3>
                 <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeColors[prompt.type]}`}>
                   {prompt.type}
                 </span>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap text-sm">{prompt.prompt}</p>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleCopy(e, prompt)}
                  className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
                  title={copiedId === prompt.id ? '¡Copiado!' : 'Copiar prompt'}
                >
                  <ClipboardIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, prompt.id)}
                  className="p-2 rounded-full bg-slate-700 hover:bg-red-500/50 text-slate-300 hover:text-white transition"
                  title="Eliminar prompt"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
        )
      })}
    </div>
  );
};
