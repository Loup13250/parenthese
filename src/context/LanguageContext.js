'use client';
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { DICTIONARY } from './dictionary';

const LanguageContext = createContext({
    lang: 'fr',
    setLang: () => {},
    toggleLang: () => {},
    t: (key) => DICTIONARY[key] || key,
    trans: (obj, field) => obj?.[field] || '',
});

export function LanguageProvider({ children, overrides = null }) {
    const t = useCallback((key, params = {}) => {
        const custom = overrides?.fr?.[key] ?? overrides?.[key];
        let str = (typeof custom === 'string' && custom.trim() !== '' ? custom : null)
            || DICTIONARY[key]
            || key;
        if (params && typeof params === 'object') {
            for (const [pKey, pVal] of Object.entries(params)) {
                str = str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal ?? ''));
            }
        }
        return str;
    }, [overrides]);

    const trans = useCallback((obj, field) => {
        if (!obj) return '';
        return obj[field] || '';
    }, []);

    const value = useMemo(() => ({
        lang: 'fr',
        setLang: () => {},
        toggleLang: () => {},
        t,
        trans,
    }), [t, trans]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
