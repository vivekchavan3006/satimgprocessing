import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'zh-CN', name: 'Chinese Simplified', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese Traditional', nativeName: '繁體中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
        aria-label="Select language"
      >
        <Globe size={16} className="text-cyan-400/80 group-hover:text-cyan-400 transition-colors" />
        <span className="text-sm font-medium hidden sm:block">{currentLang.nativeName}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 max-h-[80vh] flex flex-col bg-[#0a1628] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
            style={{ transformOrigin: 'top right' }}
          >
            <div className="p-2 border-b border-white/10 flex-shrink-0">
              <input 
                type="text" 
                placeholder="Search language..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto py-2 custom-scrollbar">
              {filteredLanguages.length > 0 ? (
                <div className="grid grid-cols-1">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${
                        i18n.language === lang.code 
                          ? 'bg-cyan-500/15 text-cyan-400' 
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="flex flex-col">
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] opacity-50 font-['Inter']">{lang.name}</span>
                      </span>
                      {i18n.language === lang.code && <Check size={14} />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-white/40">No languages found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
