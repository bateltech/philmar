'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BellOff, Trash2 } from 'lucide-react';
import { useUnreadMessages } from '@/lib/unread-messages-context';

const relativeTime = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

/** "à l'instant", "il y a 5 minutes", "hier", "il y a 3 jours"… */
function timeAgo(iso: string): string {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return "à l'instant";
  if (abs < 3600) return relativeTime.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return relativeTime.format(Math.round(seconds / 3600), 'hour');
  if (abs < 86400 * 30) return relativeTime.format(Math.round(seconds / 86400), 'day');
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NotificationBell() {
  const { notifications, clearNotifications } = useUnreadMessages();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Fermeture : changement de page, clic à l'extérieur, touche Échap
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative rounded-lg p-2 transition-colors hover:bg-gray-100 ${open ? 'bg-gray-100' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        title={
          unreadNotifications > 0
            ? `${unreadNotifications} nouvelle${unreadNotifications > 1 ? 's' : ''} notification${unreadNotifications > 1 ? 's' : ''}`
            : 'Notifications'
        }
      >
        <Bell className="h-5 w-5" />
        {unreadNotifications > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-[1.1rem] rounded-full bg-red-500 px-1 py-0.5 text-center text-[10px] font-semibold leading-none text-white">
            {unreadNotifications > 9 ? '9+' : unreadNotifications}
          </span>
        )}
      </button>

      {/* Panneau : plein largeur sur mobile, ancré sous la cloche à partir de sm */}
      <div
        aria-hidden={!open}
        className={`fixed inset-x-4 top-16 z-50 origin-top-right rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg transition duration-150 ease-out sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none invisible scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="font-semibold">Notifications</h2>
          <button
            type="button"
            onClick={clearNotifications}
            disabled={notifications.length === 0}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
            title="Vider la liste (les messages restent dans la boîte de réception)"
          >
            <Trash2 className="h-4 w-4" /> Tout effacer
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-gray-500">
            <BellOff className="h-6 w-6 text-gray-400" />
            Aucune notification
          </div>
        ) : (
          <ul className="max-h-96 divide-y divide-gray-200 overflow-y-auto">
            {notifications.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/admin/messages#message-${n.id}`}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-blue-600'}`}
                    aria-label={n.read ? undefined : 'Non lu'}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={`truncate text-sm ${n.read ? 'text-gray-700' : 'font-semibold'}`}>
                        Nouveau message de {n.name}
                      </span>
                      <time dateTime={n.created_at} className="shrink-0 text-xs text-gray-400">
                        {timeAgo(n.created_at)}
                      </time>
                    </span>
                    <span className="mt-0.5 line-clamp-2 break-words text-sm text-gray-500">{n.excerpt}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/admin/messages"
          onClick={() => setOpen(false)}
          className="block rounded-b-lg border-t border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-gray-50"
        >
          Voir tous les messages
        </Link>
      </div>
    </div>
  );
}
