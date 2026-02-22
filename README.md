# 🎵 Philmar

> Site web d'artiste développé avec **Next.js 14** & **NestJS**

## 🌐 Déploiement

| Service | Plateforme | URL |
|---------|------------|-----|
| 🖥️ Frontend | [Vercel](https://vercel.com) | [philmar.vercel.app](https://philmar.vercel.app) |
| ⚙️ Backend | [Render](https://render.com) | [philmar-backend.onrender.com](https://philmar-backend.onrender.com) |

## 🛠️ Stack technique

- **Frontend** : Next.js 14 · React 18 · Tailwind CSS · Framer Motion
- **Backend** : NestJS · Passport JWT · Sharp · Multer
- **Monorepo** : Yarn Workspaces · Concurrently

## 🚀 Installation

### 📋 Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
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
- [ ] Formulaire de contact

### Pages Admin
- [x] Ajouter/supprimer/modifier des enregistrements
- [ ]
- [ ]
- [ ]

### Animation
- [x] Page Accueil
- [x] Page Discographie
- [x] Page Biographie
- [ ] Page Concerts
- [ ] Page Spectacles
- [ ] Page Instruments
- [ ] Page Voix
- [ ] Page Programmateurs

### Responsivity
- [x] Page Accueil
- [x] Page Discographie
- [ ] Page Biographie
- [ ] Page Concerts
- [ ] Page Spectacles
- [x] Page Instruments
- [x] Page Voix
- [ ] Page Programmateurs
- [x] Pages Admin

### SEO
- [ ] Page Accueil
- [ ] Page Discographie
- [ ] Page Biographie
- [ ] Page Concerts
- [ ] Page Spectacles
- [ ] Page Instruments
- [ ] Page Voix
- [ ] Page Programmateurs
