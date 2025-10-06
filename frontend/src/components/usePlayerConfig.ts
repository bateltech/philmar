'use client';


import { useEffect, useState } from 'react';


type PlayerConfig = { soundcloud?: { playlistUrl?: string } };


export default function usePlayerConfig() {
const [config, setConfig] = useState<PlayerConfig | null>(null);
const [error, setError] = useState<string | null>(null);


useEffect(() => {
let isMounted = true;
fetch('/data/dernier_album.json', { cache: 'no-store' })
.then((r) => {
if (!r.ok) throw new Error('Impossible de charger /data/dernier_album.json');
return r.json();
})
.then((data) => {
if (isMounted) setConfig(data);
})
.catch((e) => isMounted && setError(e.message));
return () => {
isMounted = false;
};
}, []);


return { config, error, loading: !config && !error };
}