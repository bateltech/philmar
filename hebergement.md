# Hébergement en production : VPS vs Stack actuelle

## Stack actuelle

- **Frontend** (Next.js) → déployé sur **Parcel**
- **Backend** (NestJS) → déployé sur **Render**
- **Données** → fichiers JSON dans `frontend/public/data/`

## Le problème

L'admin modifie les fichiers JSON qui sont dans le dossier frontend.
En dev, tout est sur ton PC, donc le backend peut lire et écrire ces fichiers.
En production, le backend (Render) et le frontend (Parcel) sont sur **deux serveurs différents**.
Le backend ne peut pas accéder aux fichiers du frontend → **l'admin ne fonctionne pas en prod**.

---

## Option 1 : VPS

> Tout mettre sur un seul serveur.

**Principe :** tu loues un petit serveur (ex: Hetzner 4 EUR/mois, OVH 3.50 EUR/mois).
Tu y déploies le frontend ET le backend. Comme tout est sur la même machine,
le backend peut lire et écrire les JSON normalement.

**Ce qu'il faut faire :**

1. Louer un VPS
2. Acheter un nom de domaine (~12 EUR/an)
3. Installer Node.js, Nginx (reverse proxy), Let's Encrypt (HTTPS gratuit)
4. Déployer le projet tel quel

**Aucun changement de code.**

| Avantages | Inconvénients |
|---|---|
| Zéro modification du code | Tu gères le serveur toi-même |
| Coût faible et prévisible (~4 EUR/mois + domaine) | Mises à jour de sécurité à faire |
| Admin fonctionnel immédiatement | Si le serveur tombe, c'est à toi de le relancer |
| Contrôle total | |

---

## Option 2 : Garder Parcel + Render

> Remplacer les fichiers JSON par une vraie base de données.

**Principe :** puisque le backend n'a pas accès aux fichiers du frontend,
il faut stocker les données ailleurs. Une base de données accessible depuis internet
(ex: Supabase, Neon, MongoDB Atlas — tous ont un plan gratuit).

**Ce qu'il faut faire :**

1. Créer une base de données (ex: PostgreSQL sur Supabase)
2. Réécrire le `ContentService` du backend pour lire/écrire en base au lieu de fichiers JSON
3. Modifier le frontend : au lieu de lire `/data/concerts.json` en statique,
   il faut appeler l'API backend pour récupérer les données
4. Adapter tous les composants qui font `fetch('/data/xxx.json')`
5. Acheter un nom de domaine (~12 EUR/an)

**Changements de code importants.**

| Avantages | Inconvénients |
|---|---|
| Pas de serveur à maintenir | Réécriture du backend (ContentService) |
| Hébergement gratuit (plans free) | Réécriture des fetch côté frontend |
| Scalable si le site grandit beaucoup | Plus complexe à débuguer |
| | Les plans gratuits ont des limites (Render free redémarre après inactivité) |

---

## Résumé

|  | VPS | Parcel + Render + DB |
|---|---|---|
| **Changement de code** | Aucun | Important |
| **Coût mensuel** | ~4 EUR | 0 EUR (plans gratuits) à ~7 EUR+ |
| **Difficulté de mise en place** | Moyenne (config serveur) | Élevée (refacto code) |
| **Admin fonctionnel** | Oui, immédiatement | Oui, après refacto |
| **Maintenance** | Serveur à maintenir | Aucune |
