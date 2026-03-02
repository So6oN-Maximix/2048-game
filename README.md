# 2048 Full-Stack

Une version complète et compétitive du célèbre jeu **2048**. Ce projet est une application web Full-Stack utilisant du JavaScript pur (Vanilla) pour le client et un serveur **Node.js** avec une base de données **PostgreSQL** pour gérer les utilisateurs et les scores.

## ✨ Fonctionnalités

* **Gameplay Authentique** : Mécaniques fluides de déplacement et de fusion des tuiles.
* **Système d'Authentification** : Inscription et connexion pour sauvegarder vos statistiques personnelles.
* **Classement Mondial (Leaderboard)** : Un affichage dynamique du Top 10 des meilleurs scores directement à côté de la grille.
* **Profil Utilisateur** : Page dédiée affichant le meilleur score, le nombre de parties jouées et l'historique des meilleures performances.
* **Persistance de Session** : Utilisation de cookies et d'un stockage en mémoire côté serveur pour maintenir la connexion.
* **Sauvegarde de Partie** : Utilisation du `localStorage` pour reprendre une partie en cours même après avoir fermé le navigateur.

## 🛠️ Stack Technique

* **Frontend** : HTML5, CSS3 (Flexbox/Grid), JavaScript ES6+.
* **Backend** : Node.js (Module HTTP natif).
* **Base de données** : PostgreSQL.

## 🚀 Installation et Configuration

### 1. Prérequis
* Avoir [Node.js](https://nodejs.org/) installé.
* Une instance [PostgreSQL](https://www.postgresql.org/) fonctionnelle.

### 2. Base de données
Exécutez les commandes suivantes dans votre client SQL pour créer les tables nécessaires :

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Lancement
#### 1. Clonez le dépot
``` bash
git clone [https://github.com/So6oN-Maximix/2048-game.git](https://github.com/So6oN-Maximix/2048-game.git)
```
#### 2. Configurez vos accès base de données dans votre fichier `database.js`
#### 3. Lancez le serveur
``` bash
node index.js 
```
#### 4. Accédez au jeu sur `https://localhost:8080`

## 📁 Structure du Projet
* **`index.js`** : Serveur Node.js gérant les routes API et le service de fichiers statiques
* **`script.js`** : Logique principale du jeu, gestion des mouvements et appels API
* **`profile.js`** : Gestion de l'affichage des statistiques et de l'authentification coté client
* **`style.css`** : Design complet, animations des tuiles et layout responsive

Développé par [So6oN_Maximix](https://github.com/So6oN-Maximix) 🚀