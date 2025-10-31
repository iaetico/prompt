import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PromptForm } from './components/PromptForm';
import { GeneratedPrompt } from './components/GeneratedPrompt';
import { SavedPromptsList } from './components/SavedPromptsList';
import { TabButton } from './components/TabButton';
import type { PromptType, FormConfig, SavedPrompt } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SparklesIcon } from './components/icons/SparklesIcon';

// As per guidelines, API key is handled externally via environment variables.
// FIX: Initialize GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Placeholder icons for different prompt types
const TextIcon = () => <span>📝</span>;
const ImageIcon = () => <span>🖼️</span>;
const VideoIcon = () => <span>🎬</span>;
const SoundIcon = () => <span>🎵</span>;
const CodeIcon = () => <span>💻</span>;


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');
  const [promptType, setPromptType] = useState<PromptType>('TEXTO');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>('saved-prompts', []);
  const [currentFormData, setCurrentFormData] = useState<{ [key: string]: string } | undefined>(undefined);

  const formConfigs: { [key in PromptType]: FormConfig } = useMemo(() => ({
    'TEXTO': {
      icon: <TextIcon />,
      fields: [
        { id: 'tema', label: 'Tema principal', placeholder: 'Ej: El futuro de la inteligencia artificial', type: 'input' },
        { id: 'estilo', label: 'Estilo de escritura', placeholder: 'Ej: Formal, amigable, técnico, poético', type: 'input' },
        { id: 'objetivo', label: 'Objetivo del texto', placeholder: 'Ej: Explicar un concepto complejo de forma sencilla', type: 'textarea' },
        { id: 'audiencia', label: 'Audiencia objetivo', placeholder: 'Ej: Estudiantes universitarios, público general', type: 'input' },
      ],
      promptBuilder: (data) => `Escribe un texto sobre "${data.tema}" con un estilo ${data.estilo}. El objetivo es ${data.objetivo} para una audiencia de ${data.audiencia}.`
    },
    'IMAGEN': {
      icon: <ImageIcon />,
      fields: [
        { id: 'descripcion', label: 'Descripción de la imagen', placeholder: 'Ej: Un astronauta montando a caballo en Marte, estilo fotorrealista', type: 'textarea' },
        { id: 'estilo', label: 'Estilo artístico', placeholder: 'Ej: Van Gogh, Cyberpunk, Acuarela', type: 'input' },
        { id: 'colores', label: 'Paleta de colores', placeholder: 'Ej: Colores cálidos, tonos pastel, neón', type: 'input' },
      ],
      promptBuilder: (data) => `Genera una imagen de ${data.descripcion}, con un estilo artístico de ${data.estilo}. La paleta de colores principal debe ser de ${data.colores}.`
    },
    'VIDEO': {
      icon: <VideoIcon />,
      fields: [
        { id: 'escena', label: 'Descripción de la escena', placeholder: 'Ej: Una persecución de coches en una ciudad futurista de noche', type: 'textarea' },
        { id: 'ambiente', label: 'Ambiente / Mood', placeholder: 'Ej: Lleno de suspense, cómico, épico', type: 'input' },
        { id: 'duracion', label: 'Duración aproximada', placeholder: 'Ej: 15 segundos', type: 'input' },
      ],
      promptBuilder: (data) => `Crea un clip de video de una escena de ${data.escena}. El ambiente debe ser ${data.ambiente}. Duración aproximada: ${data.duracion}.`
    },
    'SONIDO': {
      icon: <SoundIcon />,
      fields: [
        { id: 'tipo', label: 'Tipo de sonido o música', placeholder: 'Ej: Efecto de sonido, loop de batería, melodía de piano', type: 'input' },
        { id: 'genero', label: 'Género / Estilo', placeholder: 'Ej: Lo-fi, cinemático, ciencia ficción, naturaleza', type: 'input' },
        { id: 'descripcion', label: 'Descripción detallada', placeholder: 'Ej: Sonido de lluvia cayendo sobre una ventana, con truenos lejanos', type: 'textarea' },
      ],
      promptBuilder: (data) => `Genera un ${data.tipo} de estilo ${data.genero}. Descripción: ${data.descripcion}.`
    },
    'CODIGO': {
      icon: <CodeIcon />,
      fields: [
        { id: 'lenguaje', label: 'Lenguaje de programación', placeholder: 'Ej: JavaScript, Python, Rust', type: 'input' },
        { id: 'funcionalidad', label: 'Funcionalidad a implementar', placeholder: 'Ej: Una función que ordene un array de objetos por una propiedad', type: 'textarea' },
        { id: 'framework', label: 'Framework o librería (opcional)', placeholder: 'Ej: React, Django, Express', type: 'input' },
      ],
      promptBuilder: (data) => `Escribe código en ${data.lenguaje} ${data.framework ? `usando ${data.framework}` : ''} para implementar la siguiente funcionalidad: ${data.funcionalidad}. Añade comentarios explicando las partes clave.`
    },
  }), []);

  const currentFormConfig = formConfigs[promptType];

  const handleGeneratePrompt = useCallback(async (formData: { [key: string]: string }) => {
    setIsLoading(true);
    setGeneratedPrompt('');
    setCurrentFormData(formData);
    const prompt = currentFormConfig.promptBuilder(formData);

    try {
        // FIX: Use ai.models.generateContent with correct parameters and model.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Eres un experto en la creación de prompts para IA. Basado en la siguiente idea, genera un prompt detallado y efectivo en español. Idea del usuario: "${prompt}"`,
        });
        // FIX: Extract text directly from the response object.
        setGeneratedPrompt(response.text);
    } catch (error) {
      console.error("Error al generar prompt:", error);
      setGeneratedPrompt("Hubo un error al conectar con la IA. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [currentFormConfig]);

  const handleImprovePrompt = useCallback(async () => {
    if (!generatedPrompt) return;
    setIsLoading(true);

    try {
        // FIX: Use ai.models.generateContent with correct parameters and model.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Mejora y expande el siguiente prompt para obtener mejores resultados de una IA generativa. Hazlo más detallado, añade contexto y sugiere parámetros si es aplicable. Mantén el idioma español. Prompt a mejorar: "${generatedPrompt}"`,
        });
        // FIX: Extract text directly from the response object.
        setGeneratedPrompt(response.text);
    } catch (error) {
      console.error("Error al mejorar prompt:", error);
      setGeneratedPrompt("Hubo un error al conectar con la IA. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [generatedPrompt]);

  const handleSavePrompt = useCallback(() => {
    if (!generatedPrompt || !currentFormData) return;
    const newSavedPrompt: SavedPrompt = {
      id: new Date().toISOString(),
      type: promptType,
      formData: currentFormData,
      prompt: generatedPrompt,
    };
    setSavedPrompts(prev => [newSavedPrompt, ...prev]);
    alert('Prompt guardado!');
  }, [generatedPrompt, promptType, currentFormData, setSavedPrompts]);

  const handleDeletePrompt = useCallback((id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  }, [setSavedPrompts]);

  const handleSelectPrompt = useCallback((prompt: SavedPrompt) => {
    setPromptType(prompt.type);
    setCurrentFormData(prompt.formData);
    setGeneratedPrompt(prompt.prompt);
    setActiveTab('generator');
  }, []);

  const handleTypeChange = (newType: PromptType) => {
    setPromptType(newType);
    setGeneratedPrompt('');
    setCurrentFormData(undefined); // Reset form data for new type
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Generador de Prompts IA
          </h1>
          <p className="text-slate-400 mt-2">Crea, mejora y guarda prompts efectivos para tus proyectos de IA.</p>
        </header>

        <main>
          <div className="mb-6 border-b border-slate-700">
             <div className="flex space-x-1">
                 {Object.keys(formConfigs).map((type) => (
                    <button 
                        key={type}
                        onClick={() => handleTypeChange(type as PromptType)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 flex items-center gap-2 ${
                            promptType === type 
                            ? 'text-purple-400 border-b-2 border-purple-400 bg-slate-800' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                       {formConfigs[type as PromptType].icon}
                       {type}
                    </button>
                 ))}
             </div>
          </div>
          
          <div className="mb-8 border-b border-slate-700 flex justify-center">
            <TabButton isActive={activeTab === 'generator'} onClick={() => setActiveTab('generator')}>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generador
            </TabButton>
            <TabButton isActive={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              Guardados ({savedPrompts.length})
            </TabButton>
          </div>
          
          {activeTab === 'generator' && (
            <div className="grid md:grid-cols-2 gap-8">
              <PromptForm 
                fields={currentFormConfig.fields}
                onPromptGenerated={handleGeneratePrompt}
                isLoading={isLoading}
                initialData={currentFormData}
              />
              <GeneratedPrompt 
                prompt={generatedPrompt}
                isLoading={isLoading}
                onSave={handleSavePrompt}
                onImprove={handleImprovePrompt}
              />
            </div>
          )}

          {activeTab === 'saved' && (
            <SavedPromptsList
              prompts={savedPrompts}
              onDelete={handleDeletePrompt}
              onSelect={handleSelectPrompt}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
