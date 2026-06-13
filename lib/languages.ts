import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { Extension } from '@codemirror/state';

export interface LanguageConfig {
  name: string;
  extension: Extension;
}

export const languages: Record<string, LanguageConfig> = {
  javascript: {
    name: 'JavaScript / TypeScript',
    extension: javascript({ jsx: true, typescript: true }),
  },
  python: {
    name: 'Python',
    extension: python(),
  },
  cpp: {
    name: 'C++',
    extension: cpp(),
  },
  html: {
    name: 'HTML',
    extension: html(),
  },
};

export type LanguageKey = keyof typeof languages;
