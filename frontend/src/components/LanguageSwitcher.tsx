import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return <div className="language-switcher" role="group" aria-label="Choose language"><Globe size={14} />{[{ code: 'en', label: 'EN' }, { code: 'si', label: 'සිං' }, { code: 'ta', label: 'தமிழ்' }].map(l => <button type="button" key={l.code} onClick={() => i18n.changeLanguage(l.code)} aria-pressed={i18n.resolvedLanguage === l.code} className={i18n.resolvedLanguage === l.code ? 'selected' : ''}>{l.label}</button>)}</div>;
}
