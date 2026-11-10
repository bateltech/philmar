'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type AdminTheme = 'light' | 'dark';

const STORAGE_KEY = 'philmar-admin-theme';
const DARK_CLASS = 'admin-dark';
const TRANSITION_CLASS = 'admin-theme-transition';
const TRANSITION_MS = 400;

/**
 * Script exécuté avant l'affichage de la page pour appliquer le bon thème
 * dès le premier rendu (évite un flash blanc en mode sombre).
 */
export const adminThemeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark')document.documentElement.classList.add('${DARK_CLASS}')}catch(e){}})();`;

interface AdminThemeContextType {
  theme: AdminTheme;
  /** Passe à true une fois le thème initial synchronisé (permet d'animer seulement les changements). */
  ready: boolean;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | null>(null);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('light');
  const [ready, setReady] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>();

  // Reprend le thème déjà appliqué par le script d'initialisation
  useEffect(() => {
    setTheme(document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light');
    // Deux frames plus tard : le thème initial est affiché, les animations peuvent commencer
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(transitionTimer.current);
      // En quittant l'admin, on ne laisse pas les classes sur le site public
      document.documentElement.classList.remove(DARK_CLASS, TRANSITION_CLASS);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const next: AdminTheme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    // Fondu des couleurs le temps du changement uniquement, pour ne pas ralentir les survols ensuite
    root.classList.add(TRANSITION_CLASS);
    root.classList.toggle(DARK_CLASS, next === 'dark');
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Stockage indisponible (navigation privée…) : le choix ne sera simplement pas mémorisé
    }
    setTheme(next);
  }, [theme]);

  return (
    <AdminThemeContext.Provider value={{ theme, ready, toggleTheme }}>{children}</AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}
