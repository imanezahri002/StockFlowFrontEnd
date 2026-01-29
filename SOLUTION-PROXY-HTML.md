# 🚨 ERREUR : Le proxy retourne du HTML au lieu de JSON

## 🔍 Problème Identifié

```
Erreur: Http failure during parsing for http://localhost:4200/api/inventories
Réponse: <!doctype html>... (page Angular)
Status: 200
```

**Cause:** Le proxy Angular ne redirige PAS vers le backend Spring Boot.

---

## ✅ SOLUTION EN 4 ÉTAPES

### 1️⃣ **Vérifiez que le BACKEND Spring Boot est démarré**

#### Test 1: Dans le navigateur
Ouvrez directement:
```
http://localhost:8080/api/inventories
```

**Résultat attendu:** Vous devez voir du JSON
```json
[
  {
    "id": 1,
    "name": "Inventaire A",
    "qtyOnHand": 100,
    ...
  }
]
```

**Si vous voyez une erreur ou rien:**
→ ❌ Le backend n'est PAS démarré ou l'endpoint n'existe pas

**Action:** Démarrez Spring Boot
```bash
# Dans le dossier backend
mvn spring-boot:run
# OU
./mvnw spring-boot:run
# OU depuis IntelliJ: Run Application
```

---

### 2️⃣ **Vérifiez le fichier proxy.conf.json**

Votre fichier `proxy.conf.json` doit contenir:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

**⚠️ Important:** Le backend doit tourner sur le port **8080**

---

### 3️⃣ **Vérifiez angular.json**

Dans `angular.json`, section `serve` → `options`:

```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"  // ✅ Cette ligne doit exister
  },
  "configurations": {
    // ...
  }
}
```

---

### 4️⃣ **Redémarrez Angular avec le proxy**

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez:
npm start
```

**Vérifiez dans les logs du terminal:**
```
[HPM] Proxy created: /api  ->  http://localhost:8080
```

Si vous voyez cette ligne, le proxy est actif ! ✅

---

## 🔧 DÉPANNAGE AVANCÉ

### Si le proxy ne se lance toujours pas:

#### Option A: Démarrer avec la commande complète
```bash
ng serve --proxy-config proxy.conf.json
```

#### Option B: Modifier package.json
```json
"scripts": {
  "start": "ng serve --proxy-config proxy.conf.json"
}
```

---

## 🧪 TESTS DE VÉRIFICATION

### Test 1: Backend seul
```bash
curl http://localhost:8080/api/inventories
```
→ Doit retourner du JSON

### Test 2: Frontend avec proxy
Ouvrez la console du navigateur et vérifiez:
```
Network → XHR → api/inventories
Request URL: http://localhost:4200/api/inventories
```

Cliquez sur la requête et regardez:
- **Response:** Doit être du JSON (pas du HTML)
- **Headers → Content-Type:** `application/json`

---

## 📋 CHECKLIST COMPLÈTE

### Backend:
- [ ] Spring Boot démarré sur port 8080
- [ ] URL `http://localhost:8080/api/inventories` retourne du JSON
- [ ] CORS configuré dans SecurityConfig
- [ ] Pas d'erreur dans les logs Spring Boot

### Frontend:
- [ ] `proxy.conf.json` existe avec la bonne config
- [ ] `angular.json` contient `"proxyConfig": "proxy.conf.json"`
- [ ] `environment.ts` a `apiUrl: '/api'`
- [ ] Angular redémarré avec `npm start`
- [ ] Logs montrent `[HPM] Proxy created`

---

## 🎯 SOLUTION ALTERNATIVE (si le proxy ne marche vraiment pas)

### Désactivez temporairement le proxy:

**Dans `src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // URL directe
};
```

**Mais ATTENTION:** Vous aurez besoin de CORS configuré côté backend !

Ajoutez dans votre backend `SecurityConfig.java`:
```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

---

## 💡 RÉSUMÉ

**Le problème:** Vous recevez du HTML au lieu de JSON
**La cause:** Le proxy ne redirige pas vers le backend OU le backend n'est pas démarré
**La solution:** 
1. Démarrez le backend sur port 8080
2. Vérifiez que `http://localhost:8080/api/inventories` fonctionne
3. Redémarrez Angular avec `npm start`
4. Le proxy redirigera automatiquement les requêtes

---

**Action immédiate:** Vérifiez que le backend Spring Boot tourne et teste l'URL directement !

