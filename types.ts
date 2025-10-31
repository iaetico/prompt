import { ReactNode } from "react";

export type PromptType = 'TEXTO' | 'IMAGEN' | 'VIDEO' | 'SONIDO' | 'CODIGO';

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

export interface FormConfig {
  icon: ReactNode;
  fields: FormField[];
  promptBuilder: (data: { [key: string]: string }) => string;
}

export interface SavedPrompt {
  id: string;
  type: PromptType;
  formData: { [key: string]: string };
  prompt: string;
}
