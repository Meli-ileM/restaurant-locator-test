# Backend API - Restaurant Locator

Ce backend Express couvre les endpoints demandés dans le test technique Geoptis.

## Endpoints disponibles

### POST /api/restaurants
Crée un restaurant.

Champs attendus :
- `name` : chaîne requise, minimum 3 caractères
- `address` : chaîne requise, minimum 10 caractères
- `latitude` : nombre décimal requis entre -90 et 90
- `longitude` : nombre décimal requis entre -180 et 180
- `cuisine_type` : chaîne requise parmi `Française`, `Italienne`, `Asiatique`, `Américaine`, `Méditerranéenne`, `Autre`
- `phone_number` : chaîne optionnelle, format téléphonique simple accepté (`+`, espaces, parenthèses, points, tirets)

Exemple JSON valide :

```json
{
  "name": "Pink Mamma",
  "address": "20 Rue de Douai, 75009 Paris, France",
  "latitude": 48.8825,
  "longitude": 2.3286,
  "cuisine_type": "Italienne",
  "phone_number": "+33 1 42 21 20 00"
}
```

### GET /api/restaurants
Retourne tous les restaurants triés par `id` croissant.

### GET /api/restaurants/search?q=term
Recherche partielle insensible à la casse sur le nom ou l'adresse.

Exemple :

```text
GET /api/restaurants/search?q=Paris
GET /api/restaurants/search?q=Pink
```

### GET /api/restaurants/filter?cuisine=type
Filtre sur un type de cuisine canonique.

Exemples :

```text
GET /api/restaurants/filter?cuisine=Française
GET /api/restaurants/filter?cuisine=Italienne
```

## Validation métier implémentée

- Contrôle serveur des plages géographiques : latitude `[-90, 90]`, longitude `[-180, 180]`
- Refus des coordonnées non numériques
- Validation des longueurs minimales pour `name` et `address`
- Validation du type de cuisine sur la liste autorisée
- Validation optionnelle du format `phone_number`
- Refus d'un doublon de restaurant si le même `name` et la même `address` existent déjà
- Messages d'erreur explicites pour faciliter les tests API

## Tester avec Thunder Client

### 1. Démarrer le serveur

Dans le dossier `backend` :

```bash
npm start
```

Le serveur écoute par défaut sur `http://localhost:3000`.

### 2. Créer une collection Thunder Client

- Ouvrir l'extension Thunder Client dans VS Code
- Créer une nouvelle collection, par exemple `Geoptis Restaurants`
- Ajouter les requêtes ci-dessous

### 3. Requête de création

- Méthode : `POST`
- URL : `http://localhost:3000/api/restaurants`
- Headers : `Content-Type: application/json`
- Body : `JSON`

Payload valide recommandé :

```json
{
  "name": "Le Comptoir du Relais",
  "address": "9 Carrefour de l'Odéon, 75006 Paris, France",
  "latitude": 48.8529,
  "longitude": 2.3387,
  "cuisine_type": "Française",
  "phone_number": "+33 1 44 27 07 97"
}
```

Types de données à utiliser :
- `name` : string
- `address` : string
- `latitude` : number
- `longitude` : number
- `cuisine_type` : string
- `phone_number` : string ou `null` si tu veux tester l'optionnel

Résultat attendu : `201 Created`

Si le même restaurant existe déjà avec le même nom et la même adresse, l'API retourne `409 Conflict`.

### 4. Requête pour récupérer tous les restaurants

- Méthode : `GET`
- URL : `http://localhost:3000/api/restaurants`

Résultat attendu : `200 OK`

### 5. Requête de recherche

- Méthode : `GET`
- URL : `http://localhost:3000/api/restaurants/search?q=Paris`

Autres exemples de termes :
- `Pink`
- `Odéon`
- `75009`

Résultat attendu : `200 OK`

### 6. Requête de filtre par cuisine

- Méthode : `GET`
- URL : `http://localhost:3000/api/restaurants/filter?cuisine=Italienne`

Autres valeurs utiles :
- `Française`
- `Asiatique`
- `Américaine`
- `Méditerranéenne`
- `Autre`

Résultat attendu : `200 OK`

## Jeux de test utiles

### Cas valides

```json
{
  "name": "Pink Mamma",
  "address": "20 Rue de Douai, 75009 Paris, France",
  "latitude": 48.8825,
  "longitude": 2.3286,
  "cuisine_type": "Italienne",
  "phone_number": "+33 1 42 21 20 00"
}
```

```json
{
  "name": "Yam'Tcha",
  "address": "121 Rue Saint-Honoré, 75001 Paris, France",
  "latitude": 48.8606,
  "longitude": 2.3376,
  "cuisine_type": "Asiatique",
  "phone_number": "+33 1 40 26 08 07"
}
```

### Cas invalides à vérifier

Nom trop court :

```json
{
  "name": "AB",
  "address": "20 Rue de Douai, 75009 Paris, France",
  "latitude": 48.8825,
  "longitude": 2.3286,
  "cuisine_type": "Italienne",
  "phone_number": "+33 1 42 21 20 00"
}
```

Adresse trop courte :

```json
{
  "name": "Pink Mamma",
  "address": "Paris",
  "latitude": 48.8825,
  "longitude": 2.3286,
  "cuisine_type": "Italienne",
  "phone_number": "+33 1 42 21 20 00"
}
```

Latitude invalide :

```json
{
  "name": "Test Latitude",
  "address": "10 Rue de Test, 75001 Paris, France",
  "latitude": 120.5,
  "longitude": 2.3286,
  "cuisine_type": "Autre",
  "phone_number": "0102030405"
}
```

Longitude invalide :

```json
{
  "name": "Test Longitude",
  "address": "10 Rue de Test, 75001 Paris, France",
  "latitude": 48.8566,
  "longitude": 250.1,
  "cuisine_type": "Autre",
  "phone_number": "0102030405"
}
```

Cuisine invalide :

```json
{
  "name": "Test Cuisine",
  "address": "10 Rue de Test, 75001 Paris, France",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "cuisine_type": "Mexicaine",
  "phone_number": "0102030405"
}
```

Téléphone invalide :

```json
{
  "name": "Test Telephone",
  "address": "10 Rue de Test, 75001 Paris, France",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "cuisine_type": "Autre",
  "phone_number": "abc"
}
```

Téléphone optionnel omis :

```json
{
  "name": "Sans Telephone",
  "address": "10 Rue de Test, 75001 Paris, France",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "cuisine_type": "Autre"
}
```

Restaurant déjà existant :

```json
{
  "name": "Pink Mamma",
  "address": "20 Rue de Douai, 75009 Paris, France",
  "latitude": 48.8825,
  "longitude": 2.3286,
  "cuisine_type": "Italienne",
  "phone_number": "+33 1 42 21 20 00"
}
```

## Remarques techniques

- Les requêtes SQL sont paramétrées pour éviter l'injection SQL.
- La recherche utilise `ILIKE` pour une recherche partielle insensible à la casse.
- Le filtre cuisine utilise une valeur normalisée côté serveur pour éviter les incohérences d'écriture.