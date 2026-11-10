'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { adminApi, MessageNotification } from './admin-api';
import { useAuth } from './auth-context';

const POLL_INTERVAL_MS = 60_000;
/** Date (côté serveur) du dernier message effacé de la liste des notifications. */
const CLEARED_AT_KEY = 'philmar-admin-notifications-cleared-at';

interface UnreadMessagesContextType {
  /** Nombre de messages non lus (0 tant qu'on n'est pas connecté). */
  unreadCount: number;
  /** Derniers messages reçus depuis le dernier « Tout effacer ». */
  notifications: MessageNotification[];
  /** Vide la liste des notifications (les messages eux-mêmes ne sont pas touchés). */
  clearNotifications: () => void;
  /** Nombre de messages arrivés depuis le dernier contrôle (pour le toast). */
  newSinceLastCheck: number;
  dismissNew: () => void;
  refresh: () => Promise<void>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | null>(null);

const readClearedAt = (): string | null => {
  try {
    return localStorage.getItem(CLEARED_AT_KEY);
  } catch {
    return null;
  }
};

export function UnreadMessagesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [newSinceLastCheck, setNewSinceLastCheck] = useState(0);
  // null = premier chargement : on ne déclenche pas de toast pour les messages déjà présents
  const previousCount = useRef<number | null>(null);
  const clearedAt = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const { unreadCount: count, items } = await adminApi.getMessageNotifications(clearedAt.current);
      const prev = previousCount.current;
      if (prev !== null && count > prev) {
        setNewSinceLastCheck((n) => n + (count - prev));
      }
      previousCount.current = count;
      setUnreadCount(count);
      setNotifications(items);
    } catch {
      // Erreur réseau ponctuelle : on garde les dernières valeurs connues
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications((items) => {
      // On retient la date du message le plus récent (horloge du serveur, pas celle du navigateur)
      const newest = items[0]?.created_at;
      if (newest) {
        clearedAt.current = newest;
        try {
          localStorage.setItem(CLEARED_AT_KEY, newest);
        } catch {
          // Stockage indisponible : la liste sera simplement vidée pour cette session
        }
      }
      return [];
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      previousCount.current = null;
      setUnreadCount(0);
      setNotifications([]);
      setNewSinceLastCheck(0);
      return;
    }

    clearedAt.current = readClearedAt();
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
    };
  }, [isAuthenticated, refresh]);

  const dismissNew = useCallback(() => setNewSinceLastCheck(0), []);

  return (
    <UnreadMessagesContext.Provider
      value={{ unreadCount, notifications, clearNotifications, newSinceLastCheck, dismissNew, refresh }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages() {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error('useUnreadMessages must be used within an UnreadMessagesProvider');
  }
  return context;
}
