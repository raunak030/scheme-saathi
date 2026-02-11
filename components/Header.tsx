import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const t = getTranslation(lang);

  return (
    <header className="bg-green-800 text-white p-4 shadow-lg sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              {t.appTitle}
            </h1>
            <p className="text-xs text-green-100 opacity-90 hidden sm:block">{t.subTitle}</p>
          </div>
        </div>

        <div className="flex bg-green-900/50 rounded-lg p-1 border border-green-700/50">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${lang === 'en' ? 'bg-white text-green-900 shadow-sm' : 'text-green-100 hover:bg-green-800/50'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${lang === 'hi' ? 'bg-white text-green-900 shadow-sm' : 'text-green-100 hover:bg-green-800/50'}`}
          >
            हिंदी
          </button>
        </div>
      </div>
    </header>
  );
};