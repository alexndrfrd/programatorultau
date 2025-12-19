# Ghid de Testare - Booking Engine

## ✅ Ce am implementat

1. **Afișare sloturi ocupate** - Sloturile rezervate apar cu opacitate redusă și marcaj ✕
2. **Integrare Firebase** - Sloturile ocupate se încarcă din Firebase Firestore
3. **Validare în timp real** - Nu poți selecta sloturi deja ocupate
4. **Actualizare automată** - După o rezervare, sloturile se actualizează automat

## 🧪 Cum să testezi

### 1. Fără Firebase (testare UI)

1. Deschide `index.html` în browser
2. Mergi la secțiunea "Consultație Gratuită"
3. Selectează o dată
4. Vezi toate sloturile disponibile (09:00 - 18:00)
5. Sloturile ocupate nu vor apărea (pentru că nu sunt în Firebase)

### 2. Cu Firebase (testare completă)

#### Pasul 1: Configurează Firebase
1. Urmează instrucțiunile din `FIREBASE_SETUP.md`
2. Actualizează `firebaseConfig` în `index.html` (liniile 938-945)
3. Asigură-te că Firestore este activat și regulile permit read/write

#### Pasul 2: Testează rezervarea
1. Deschide site-ul în browser
2. Selectează o dată în calendar
3. Vezi toate sloturile (09:00 - 18:00)
4. Selectează un slot (ex: 10:00)
5. Completează formularul:
   - Nume: Test User
   - Email: test@example.com
   - Telefon: +40 123 456 789
6. Click "Programează Consultația"
7. **Verifică**: Slotul 10:00 ar trebui să apară acum ca ocupat (gri, cu ✕)

#### Pasul 3: Testează sloturile ocupate
1. Reîncarcă pagina (F5)
2. Selectează aceeași dată
3. **Verifică**: Slotul 10:00 ar trebui să fie:
   - Gri/opac
   - Cu cursor "not-allowed"
   - Cu marcaj ✕
   - Neclickabil

#### Pasul 4: Testează în Firebase Console
1. Mergi în Firebase Console → Firestore Database
2. Verifică colecția `bookings`
3. Ar trebui să vezi rezervarea cu:
   - `name`: "Test User"
   - `email`: "test@example.com"
   - `phone`: "+40 123 456 789"
   - `date`: Timestamp cu data selectată
   - `time`: "10:00"
   - `createdAt`: Timestamp

## 🔍 Debugging

### Consolă Browser (F12)
- **Mesaje utile**: 
  - `Found X booked slots for [data]` - arată câte sloturi ocupate s-au găsit
  - `Firebase not configured` - dacă Firebase nu e configurat
  - `Error loading booked slots` - dacă există o eroare

### Probleme comune

1. **Sloturile ocupate nu apar**
   - Verifică că Firebase e configurat corect
   - Verifică consola pentru erori
   - Verifică regulile Firestore (trebuie să permită read)

2. **Eroare la salvare**
   - Verifică regulile Firestore (trebuie să permită write)
   - Verifică că toate câmpurile sunt completate
   - Verifică consola pentru erori specifice

3. **Sloturile nu se actualizează după rezervare**
   - Reîncarcă pagina manual
   - Verifică că `renderTimeSlots()` este apelat după salvare

## 📊 Structura datelor în Firebase

### Document în `bookings`:
```javascript
{
  name: "Ion Popescu",
  email: "ion@example.com", 
  phone: "+40 123 456 789",
  date: Timestamp(2024-01-15T00:00:00Z), // Normalizat la începutul zilei
  time: "10:00", // Format HH:MM
  createdAt: Timestamp(2024-01-14T12:30:00Z)
}
```

## 🎨 Stiluri sloturi

- **Disponibil**: Fundal normal, cursor pointer, hover effect
- **Ocupat**: Opacitate 50%, cursor not-allowed, marcaj ✕, fără hover effect
- **Selectat**: Fundal mov (secondary color), text alb

## 🚀 Următorii pași (opțional)

1. **Notificări email** - Trimite email când se face o rezervare
2. **Confirmare rezervare** - Link de confirmare în email
3. **Anulare rezervare** - Permite utilizatorilor să-și anuleze rezervările
4. **Admin panel** - Interfață pentru a vedea toate rezervările

