import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
      <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5" />
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all ${
          i18n.language === 'en'
            ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
        }`}
      >
        EN 🇬🇧
      </button>
      <button
        onClick={() => changeLanguage('si')}
        className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all ${
          i18n.language === 'si'
            ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
        }`}
      >
        සිං 🇱🇰
      </button>
      <button
        onClick={() => changeLanguage('ta')}
        className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all ${
          i18n.language === 'ta'
            ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
        }`}
      >
        தமி 🇱🇰
      </button>
    </div>
  );
};
