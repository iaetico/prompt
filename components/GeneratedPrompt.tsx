import React, { useState } from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { SaveIcon } from './icons/SaveIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface GeneratedPromptProps {
  prompt: string;
  isLoading: boolean;
  onSave: () => void;
  onImprove: () => void;
}

export const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ prompt, isLoading, onSave, onImprove }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <LoadingSpinner className="w-8 h-8 text-purple-400" />
          <p className="mt-4 text-slate-300">Procesando...</p>
        </div>
      );
    }

    if (!prompt) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-slate-400 text-center">Aquí aparecerá tu prompt generado o mejorado.</p>
        </div>
      );
    }

    return (
      <>
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Resultado</h2>
        <p className="text-slate-200 whitespace-pre-wrap flex-grow">{prompt}</p>
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end gap-2">
           <button
                onClick={handleCopy}
                disabled={isLoading}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                title={copied ? "¡Copiado!" : "Copiar"}
            >
                <ClipboardIcon className="w-5 h-5" />
                <span>{copied ? "¡Copiado!" : "Copiar"}</span>
            </button>
            <button
                onClick={onSave}
                disabled={isLoading}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                title="Guardar prompt"
            >
                <SaveIcon className="w-5 h-5" />
                <span>Guardar</span>
            </button>
             <button
                onClick={onImprove}
                disabled={isLoading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:bg-purple-900 disabled:cursor-not-allowed"
                title="Mejorar con IA"
            >
                <SparklesIcon className="w-5 h-5" />
                <span>Mejorar con IA</span>
            </button>
        </div>
      </>
    );
  };
  
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg relative flex flex-col">
      {renderContent()}
    </div>
  );
};
