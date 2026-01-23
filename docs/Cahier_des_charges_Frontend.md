# Cahier des charges  
## Application Web de Suivi de Films et Séries  
### Movie / TV Show Tracker – Front-End

---

## 1. Présentation générale du projet

### 1.1 Contexte
Avec la multiplication des plateformes de streaming et la grande diversité des films et séries disponibles, les utilisateurs rencontrent des difficultés à suivre, organiser et retrouver les contenus qu’ils ont visionnés ou souhaitent regarder.

Dans ce contexte, une interface web moderne, intuitive et responsive est essentielle pour offrir une expérience utilisateur fluide et agréable.

Ce projet consiste à concevoir **la partie Front-End** d’une application web de suivi de films et séries, basée sur des données fournies par une API externe (TMDb) et un backend dédié.

---

### 1.2 Objectif du projet
L’objectif principal est de développer une **interface utilisateur attractive, ergonomique et facile à utiliser**, permettant aux utilisateurs de :
- Découvrir les films et séries populaires,
- Rechercher des contenus audiovisuels,
- Consulter des fiches détaillées,
- Gérer des listes personnalisées,
- Noter et commenter les contenus après authentification.

Le développement de la partie Front-End est assuré par :
- **IHSSAN EL MAANAOUI**
- **Yousra ESSEBBANE**

---

## 2. Périmètre du projet Front-End

### 2.1 Utilisateurs cibles
- Cinéphiles amateurs ou passionnés
- Utilisateurs de plateformes de streaming
- Toute personne souhaitant organiser ses films et séries

### 2.2 Plateforme
- Application web responsive accessible depuis :
  - Ordinateur
  - Tablette
  - Smartphone

---

## 3. Fonctionnalités Front-End

### 3.1 Landing Page (Page d’accueil publique)
La landing page est la première page affichée lors de l’accès au site, sans authentification.

Elle comprend :
- L’affichage des **films et séries populaires**
- Des sections distinctes :
  - Popular Movies
  - Popular TV Shows
- Des cartes visuelles contenant :
  - Affiche
  - Titre
  - Note moyenne
- Des boutons visibles :
  - Login
  - Sign Up

Cette page a pour objectif de présenter l’application et d’inciter l’utilisateur à s’inscrire ou se connecter.

---

### 3.2 Authentification (interfaces)
- Pages de connexion et d’inscription
- Formulaires avec validation côté client
- Affichage de messages d’erreur clairs
- Gestion de l’état utilisateur côté Front-End
- Fonction de déconnexion

---

### 3.3 Recherche et découverte de contenus
- Barre de recherche par titre
- Filtres :
  - Films / Séries
  - Les plus populaires
  - Les mieux notés
- Affichage dynamique des résultats

---

### 3.4 Fiches films et séries
Chaque fiche affiche :
- Titre
- Synopsis
- Date de sortie
- Genres
- Casting principal
- Réalisateur(s)
- Affiche et images
- Note moyenne

---

### 3.5 Notation et commentaires (UI)
- Système de notation par étoiles
- Ajout de commentaires personnels
- Modification et suppression des commentaires
- Affichage des avis de la communauté

---

### 3.6 Gestion des listes personnalisées
- Listes proposées :
  - À voir plus tard
  - Favoris
  - Déjà vus
- Ajout et suppression de contenus
- Organisation visuelle des listes

---

### 3.7 Historique et statistiques (affichage)
- Consultation de l’historique de visionnage
- Statistiques simples :
  - Nombre de films vus
  - Séries suivies
  - Genres les plus regardés

---

## 4. Exigences techniques Front-End

### 4.1 Architecture
- Application SPA (Single Page Application)
- Organisation du code en :
  - Pages
  - Composants réutilisables
  - Services API
  - Gestion de l’état

---

### 4.2 Technologies utilisées
- React.js
- Tailwind CSS
- JavaScript (ES6+)
- HTML5 / CSS3
- Git / GitHub

---

## 5. Contraintes
- Dépendance à l’API TMDb
- Dépendance au backend
- Le Front-End ne gère pas :
  - La base de données
  - La logique métier
  - La sécurité serveur

---

## 6. Conclusion
Ce cahier des charges définit les fonctionnalités et exigences liées à la conception du Front-End de l’application Movie / TV Show Tracker.  
L’objectif est de proposer une interface moderne, fluide et évolutive, prête à être intégrée avec la partie backend du projet.
