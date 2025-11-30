# Configurare Firebase pentru Calendar și Site Requests

## Pași de configurare:

1. **Creează un proiect Firebase:**
   - Mergi pe https://console.firebase.google.com
   - Click "Add Project"
   - Urmează pașii de configurare

2. **Activează Firestore Database:**
   - În Firebase Console, mergi la "Firestore Database"
   - Click "Create Database"
   - Alege "Start in test mode" (poți restricționa accesul mai târziu)

3. **Obține configurația:**
   - Mergi la Project Settings (iconița de roată)
   - Scroll la "Your apps"
   - Click pe iconița Web (</>)
   - Copiază configurația Firebase

4. **Actualizează index.html:**
   - Găsește secțiunea cu `firebaseConfig` în `index.html`
   - Înlocuiește valorile cu cele din Firebase Console:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

5. **Creează colecțiile în Firestore:**
   - `bookings` - pentru rezervările de calendar
   - `site-requests` - pentru cererile de site (plan 2 & 3)

## Structura datelor:

### Colecția `bookings`:
```javascript
{
  name: "Ion Popescu",
  email: "ion@example.com",
  phone: "+40 123 456 789",
  date: Timestamp,
  time: "10:00",
  createdAt: Timestamp
}
```

### Colecția `site-requests`:
```javascript
{
  plan: "magazin" | "complex",
  price: 500 | 1000,
  primaryColor: "#6366F1",
  secondaryColor: "#8B5CF6",
  headerPosition: "top" | "sticky",
  footerVisible: true | false,
  sidebarVisible: true | false,
  siteName: "Magazinul Meu",
  siteEmail: "contact@example.com",
  sitePhone: "+40 XXX XXX XXX",
  siteDescription: "Descriere...",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## Alternativă: CSV/Excel

Dacă nu vrei să folosești Firebase, poți:
1. Exporta datele din calendar într-un CSV
2. Folosi un serviciu de email (EmailJS) pentru site requests
3. Sau procesa manual rezervările

Pentru a dezactiva Firebase, comentează secțiunea de import Firebase din `index.html`.

