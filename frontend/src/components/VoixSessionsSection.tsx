// components/VoixSessionsSection.tsx
'use client';
import { useEffect, useState } from 'react';
import VoixCard from './VoixCard';

interface Session {
  type: 'cours' | 'stages' | 'ateliers';
  title: string;
  description: string;
  image: string;
  pdf: string;
}

export default function VoixSessionsSection() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch('/data/voix_sessions.json')
      .then(res => res.json())
      .then(setSessions);
  }, []);

  const grouped = {
    cours: sessions.filter(s => s.type === 'cours'),
    stages: sessions.filter(s => s.type === 'stages'),
    ateliers: sessions.filter(s => s.type === 'ateliers'),
  };

  return (
    <section className="px-4 md:px-20 pt-24 pb-12 space-y-16">
      {(['cours', 'stages', 'ateliers'] as const).map((type) => (
        grouped[type].length > 0 && (
          <div key={type}>
            <h2 className="text-xl font-semibold uppercase mb-6">{type}</h2>
            <div className="flex flex-wrap gap-8">
              {grouped[type].map((session, idx) => (
                <VoixCard key={idx} {...session} />
              ))}
            </div>
          </div>
        )
      ))}
    </section>
  );
}
