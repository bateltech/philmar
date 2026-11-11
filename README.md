# 🎵 Philmar

> Site web d'artiste développé avec **Next.js 14** & **NestJS**, données sur **Supabase**

## 🌐 Déploiement

| Service | Plateforme | URL |
|---------|------------|-----|
| 🖥️ Frontend | [Vercel](https://vercel.com) | [www.philmarzic.com](https://www.philmarzic.com) |
| 🔐 Admin | [Vercel](https://vercel.com) | [admin.philmarzic.com](https://admin.philmarzic.com) |
| ⚙️ Backend | [Render](https://render.com) | [philmar-backend.onrender.com](https://philmar-backend.onrender.com) |
| 🗄️ Base de données & fichiers | [Supabase](https://supabase.com) | — |

## 🛠️ Stack technique

- **Frontend** : Next.js 14 · React 18 · Tailwind CSS · Framer Motion · Vercel Web Analytics
- **Backend** : NestJS · Passport JWT · Sharp · Multer · Supabase · Brevo (e-mails) · Cloudflare Turnstile (anti-robot)
- **Monorepo** : Yarn Workspaces · Concurrently

## 🚀 Installation

### 📋 Prérequis

- [Node.js](https://nodejs.org/) (v20.9 ou supérieur)
- [Yarn](https://yarnpkg.com/) (v1.x)

### 📥 Cloner le repo

```bash
git clone https://github.com/bateltech/philmar.git
cd philmar
```

### 📦 Installer les dépendances

```bash
yarn install          # dépendances racine (concurrently)
yarn install:all      # dépendances frontend + backend
```

### ⚙️ Configurer l'environnement

```bash
cp backend/.env.example backend/.env
```

Renseigner les variables dans `backend/.env` :

| Variable | Description |
|----------|-------------|
| `ADMIN_USERNAME` | Nom d'utilisateur admin |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe (générer avec `yarn hash-password` dans `/backend`) |
| `JWT_SECRET` | Chaîne aléatoire de 64 caractères |
| `JWT_EXPIRY` | Durée du token (ex: `24h`) |
| `CORS_ORIGIN` | URL du frontend (ex: `http://localhost:3001`) |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SECRET_KEY` | Clé secrète Supabase (backend uniquement, jamais côté navigateur) |
| `SUPABASE_BUCKET_IMAGES` / `_AUDIO` / `_DOCUMENTS` | Noms des espaces de stockage (`images`, `audio`, `documents`) |
| `TURNSTILE_SECRET_KEY` | Clé secrète Cloudflare Turnstile (formulaire de contact) |
| `BREVO_API_KEY` | Clé API Brevo (notification e-mail des nouveaux messages) |
| `CONTACT_SENDER_EMAIL` / `CONTACT_RECIPIENT_EMAIL` | Expéditeur et destinataire de la notification |
| `STATS_INGEST_SECRET` | Secret partagé avec le frontend pour les statistiques (même valeur des deux côtés) |

Renseigner les variables dans `frontend/.env.local` :

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend (ex: `http://localhost:3000/api`) |
| `NEXT_PUBLIC_SITE_URL` | URL du site public |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_KEY` | URL et clé publique Supabase (lecture du contenu) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clé publique Cloudflare Turnstile |
| `STATS_INGEST_SECRET` | Même valeur que dans `backend/.env` |

### 🗄️ Créer la base de données (Supabase)

Exécuter une seule fois chaque script de `backend/supabase/` dans **SQL Editor** (ordre indifférent) :

| Script | Rôle |
|--------|------|
| `content.sql` | Table du contenu du site (lecture publique, écriture via le backend) |
| `storage.sql` | Espaces de stockage publics `images`, `audio`, `documents` |
| `contact_messages.sql` | Messages du formulaire de contact |
| `page_views.sql` | Statistiques de visites |

Pour migrer vers un nouveau projet Supabase :

1. Exécuter les 4 scripts ci-dessus dans le nouveau projet
2. Recopier les fichiers des espaces `images`, `audio` et `documents` (non inclus dans la sauvegarde)
3. Télécharger une sauvegarde depuis l'admin (**Paramètres → Sauvegarde**) et remplacer dans le fichier l'adresse de l'ancien projet Supabase par celle du nouveau
4. Mettre à jour les variables d'environnement, puis restaurer la sauvegarde depuis l'admin

### ▶️ Lancer le projet

```bash
# 🔥 Frontend + Backend en même temps
yarn dev

# 🖥️ Frontend uniquement (port 3001)
yarn dev:front

# ⚙️ Backend uniquement (port 3000)
yarn dev:back
```

Le frontend sera accessible sur `http://localhost:3001` et le backend sur `http://localhost:3000`.

---

## 📝 To Do

### Page Instruments
- [x] Component Ateliers
- [x] Component Instruments
- [x] Component Avis

### Page Voix
- [x] Introduction (Méthode / Objectifs / Moyens)
- [x] Component Stages / Ateliers / Cours
- [x] Filtres pour le component
- [x] Component Avis

### Page Discographie
- [x] Ajouter les liens d'achats
- [x] Ajouter un mini lecteur minimaliste pour chaque disco
- [x] Filtres de tri
- [x] Titre qui slide à gauche s'il est trop long

### Page Concerts
- [x] Carrousel des concerts
- [x] Résoudre le glitch visuel

### Page Spectacles
- [x] Carrousel de spectacles
- [x] Résoudre le glitch visuel

### Page Accueil
- [x] Lecteur SoundCloud customisé
- [x] Mini lecteur customisé version mobile
- [x] Drag & Drop le lecteur

### Page Programmateurs
- [ ]
- [ ]
- [ ]

### Footer
- [x] Formulaire de contact

### Pages Admin
- [x] Ajouter/supprimer/modifier des enregistrements
- [x] Messages du formulaire de contact + notifications
- [x] Mode sombre
- [x] Sauvegarde / restauration du contenu
- [x] Statistiques de visites

### Animation
- [x] Page Accueil
- [x] Page Discographie
- [x] Page Biographie
- [x] Page Concerts
- [x] Page Spectacles
- [x] Page Instruments
- [x] Page Voix
- [x] Pages Admin
- [ ] Page Programmateurs

### Responsivity
- [x] Page Accueil
- [x] Page Discographie
- [x] Page Biographie
- [x] Page Concerts
- [x] Page Spectacles
- [x] Page Instruments
- [x] Page Voix
- [ ] Page Programmateurs
- [x] Pages Admin

### SEO
- [x] Page Accueil
- [x] Page Discographie
- [x] Page Biographie
- [x] Page Concerts
- [x] Page Spectacles
- [x] Page Instruments
- [x] Page Voix
- [x] Pages Admin (exclues de Google)
- [ ] Page Programmateurs
- [x] Sitemap, robots.txt et image de partage
- [x] Google Search Console

### Mentions légales & RGPD
- [x] Page Mentions légales (public + admin)
- [x] Lecteurs SoundCloud / Bandcamp / Spotify chargés au clic
- [x] Statistiques sans cookie
