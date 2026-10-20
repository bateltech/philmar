'use client';

import { useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window { turnstile?: Turnstile }
}

// Charge le script Cloudflare une seule fois
let scriptPromise: Promise<void> | null = null;
const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = TURNSTILE_SCRIPT;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { scriptPromise = null; reject(new Error('turnstile')); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
};

type Status = { type: 'idle' | 'sending' | 'success' | 'error'; text?: string };

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // champ piège
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>({ type: 'idle' });

  const startedAtRef = useRef(Date.now());
  const widgetElRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !widgetElRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(widgetElRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          language: 'fr',
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(() => setStatus({ type: 'error', text: 'La vérification anti-robot ne se charge pas. Désactivez votre bloqueur de pub ou réessayez.' }));
    return () => {
      cancelled = true;
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, []);

  const resetTurnstile = () => {
    setToken('');
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus({ type: 'error', text: 'Merci de patienter pendant la vérification anti-robot.' });
      return;
    }

    // Le serveur gratuit peut mettre jusqu'à une minute à se réveiller
    setStatus({ type: 'sending', text: "Envoi en cours… (cela peut prendre jusqu'à une minute)" });
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, message, website,
          turnstileToken: token,
          elapsedMs: Date.now() - startedAtRef.current,
        }),
      });

      if (res.status === 429) {
        throw new Error('Trop de messages envoyés. Réessayez dans quelques minutes.');
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = Array.isArray(body?.message) ? 'Vérifiez les champs du formulaire.' : body?.message;
        throw new Error(msg || "Le message n'a pas pu être envoyé.");
      }

      setStatus({ type: 'success', text: 'Merci ! Votre message a bien été envoyé.' });
      setName(''); setEmail(''); setMessage('');
      startedAtRef.current = Date.now();
    } catch (err) {
      const text = err instanceof TypeError
        ? "Impossible de joindre le serveur. Réessayez dans un instant."
        : (err as Error).message;
      setStatus({ type: 'error', text });
    } finally {
      resetTurnstile(); // un jeton ne sert qu'une fois
    }
  };

  const sending = status.type === 'sending';
  const field = 'p-2 w-80 max-w-full text-black border border-red-500';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
      <h2 className="text-lg text-right">Pour toute proposition, vous pouvez me contacter</h2>

      <input
        type="text"
        required
        maxLength={100}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Entrez votre nom ici..."
        aria-label="Nom"
        className={field}
      />

      <input
        type="email"
        required
        maxLength={254}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Entrez votre email ici..."
        aria-label="Email"
        className={field}
      />

      <textarea
        required
        maxLength={5000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Entrez le message ici..."
        aria-label="Message"
        className={`${field} h-32`}
      />

      {/* Champ piège : caché aux humains, rempli par les robots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <div ref={widgetElRef} />

      <button
        type="submit"
        disabled={sending}
        className="bg-white text-black font-semibold py-2 px-6 mt-4 disabled:opacity-60"
      >
        {sending ? 'Envoi...' : 'Envoyer'}
      </button>

      {status.text && (
        <p
          role="status"
          className={`w-80 max-w-full text-center text-sm ${
            status.type === 'success' ? 'text-green-400' : status.type === 'error' ? 'text-red-400' : 'text-white/80'
          }`}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}
