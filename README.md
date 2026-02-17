# philmar
Artist website developed with Next.js 14

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Yarn](https://yarnpkg.com/) (v1.x)

### Cloner le repo

```bash
git clone <url-du-repo>
cd philmar
```

### Installer les dépendances

Depuis la racine du projet, installer toutes les dépendances (frontend + backend) en une seule commande :

```bash
yarn install          # dépendances racine (concurrently)
yarn install:all      # dépendances frontend + backend
```

### Configurer l'environnement

Copier le fichier d'exemple et le compléter avec vos valeurs :

```bash
cp backend/.env.example backend/.env
```

Renseigner les variables dans `backend/.env` :
- `ADMIN_PASSWORD_HASH` : hash bcrypt du mot de passe admin (générer avec `yarn hash-password` dans `/backend`)
- `JWT_SECRET` : chaîne aléatoire de 64 caractères

### Lancer le projet

**Frontend + Backend en même temps** (depuis la racine) :

```bash
yarn dev
```

**Frontend uniquement** (port 3001) :

```bash
yarn dev:front
```

**Backend uniquement** :

```bash
yarn dev:back
```

Le frontend sera accessible sur `http://localhost:3001` et le backend sur `http://localhost:3000`.

## To Do

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
- [ ] Page Discographie
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
- [ ] Pages Admin

### SEO
- [ ] Page Accueil
- [ ] Page Discographie
- [ ] Page Biographie
- [ ] Page Concerts
- [ ] Page Spectacles
- [ ] Page Instruments
- [ ] Page Voix
- [ ] Page Programmateurs