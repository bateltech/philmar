'use client';

import { useEffect, useState } from 'react';
import { AdminLayout, ConfirmDialog } from '@/components/admin';
import { adminApi, ContactMessage } from '@/lib/admin-api';
import { Mail, MailOpen, Reply, Trash2, RefreshCw } from 'lucide-react';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      setMessages(await adminApi.getMessages());
      setError(null);
    } catch {
      setError('Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRead = async (msg: ContactMessage) => {
    try {
      const updated = await adminApi.setMessageRead(msg.id, !msg.read);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
    } catch {
      setError('Erreur lors de la mise à jour du message');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.deleteMessage(deleteId);
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
    } catch {
      setError('Erreur lors de la suppression');
    } finally {
      setDeleteId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  const visible = filter === 'unread' ? messages.filter((m) => !m.read) : messages;

  return (
    <AdminLayout title="Messages">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white hover:bg-gray-50'}`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-lg px-3 py-1.5 text-sm ${filter === 'unread' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white hover:bg-gray-50'}`}
          >
            Non lus ({unreadCount})
          </button>
        </div>
        <button
          onClick={loadMessages}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" /> Actualiser
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
          {filter === 'unread' ? 'Aucun message non lu.' : 'Aucun message reçu pour le moment.'}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((msg) => (
            <article
              key={msg.id}
              className={`rounded-lg bg-white p-4 shadow ${msg.read ? '' : 'border-l-4 border-blue-600'}`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`truncate ${msg.read ? 'font-medium' : 'font-bold'}`}>
                    {msg.name}
                    {!msg.read && <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Nouveau</span>}
                  </p>
                  <a href={`mailto:${msg.email}`} className="break-all text-sm text-blue-600 hover:underline">
                    {msg.email}
                  </a>
                </div>
                <time dateTime={msg.created_at} className="text-sm text-gray-500 first-letter:uppercase">
                  {formatDate(msg.created_at)}
                </time>
              </div>

              <p className="whitespace-pre-wrap break-words text-sm text-gray-800">{msg.message}</p>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                <a
                  href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: votre message sur le site Philmar')}`}
                  onClick={() => { if (!msg.read) toggleRead(msg); }}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                >
                  <Reply className="h-4 w-4" /> Répondre
                </a>
                <button
                  onClick={() => toggleRead(msg)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                >
                  {msg.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  {msg.read ? 'Marquer non lu' : 'Marquer comme lu'}
                </button>
                <button
                  onClick={() => setDeleteId(msg.id)}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Supprimer"
      />
    </AdminLayout>
  );
}
