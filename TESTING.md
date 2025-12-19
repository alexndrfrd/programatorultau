# Ghid de Testare - Booking Engine

## ✅ Ce am implementat

1. **Afișare sloturi ocupate** - Sloturile rezervate apar cu opacitate redusă și marcaj ✕
2. **Integrare Backend API** - Sloturile ocupate se încarcă din MySQL via REST API
3. **Validare în timp real** - Nu poți selecta sloturi deja ocupate
4. **Actualizare automată** - După o rezervare, sloturile se actualizează automat

## 🧪 Cum să testezi

### 1. Setup Backend

1. Urmează instrucțiunile din `BACKEND_SETUP.md`
2. Pornește backend-ul: `cd backend && npm run dev`
3. Verifică că backend-ul rulează: http://localhost:3000/health

### 2. Testează rezervarea

1. Deschide site-ul în browser (http://localhost:8000)
2. Mergi la secțiunea "Consultație Gratuită"
3. Selectează o dată în calendar
4. Vezi toate sloturile (09:00 - 18:00)
5. Selectează un slot (ex: 10:00)
6. Completează formularul:
   - Nume: Test User
   - Email: test@example.com
   - Telefon: +40 123 456 789
7. Click "Programează Consultația"
8. **Verifică**: Slotul 10:00 ar trebui să apară acum ca ocupat (gri, cu ✕)

### 3. Testează sloturile ocupate

1. Reîncarcă pagina (F5)
2. Selectează aceeași dată
3. **Verifică**: Slotul 10:00 ar trebui să fie:
   - Gri/opac
   - Cu cursor "not-allowed"
   - Cu marcaj ✕
   - Neclickabil

### 4. Testează în MySQL

1. Conectează-te la MySQL:
   ```bash
   mysql -u root -p
   USE programatorultau;
   SELECT * FROM bookings;
   ```
2. Ar trebui să vezi rezervarea cu:
   - `name`: "Test User"
   - `email`: "test@example.com"
   - `phone`: "+40 123 456 789"
   - `date`: Data selectată
   - `time`: "10:00"
   - `created_at`: Timestamp

## 🔍 Debugging

### Consolă Browser (F12)
- **Mesaje utile**: 
  - `📅 Loading booked slots for date: [data]` - arată data pentru care se încarcă sloturile
  - `✅ Found X booked slots` - arată câte sloturi ocupate s-au găsit
  - `💾 Attempting to save booking to backend...` - când se salvează o rezervare
  - `✅ Booking saved successfully` - confirmare salvare

### Probleme comune

1. **Sloturile ocupate nu apar**
   - Verifică că backend-ul rulează (http://localhost:3000/health)
   - Verifică consola pentru erori
   - Verifică că `API_BASE_URL` e corect în `script.js`

2. **Eroare la salvare**
   - Verifică că backend-ul rulează
   - Verifică că toate câmpurile sunt completate
   - Verifică consola pentru erori specifice
   - Verifică în MySQL că tabelul `bookings` există

3. **Sloturile nu se actualizează după rezervare**
   - Reîncarcă pagina manual
   - Verifică că `renderTimeSlots()` este apelat după salvare

4. **Eroare CORS**
   - Verifică că `CORS_ORIGIN` din `backend/.env` e setat la `http://localhost:8000`
   - Verifică că backend-ul rulează pe portul 3000

## 📊 Structura datelor în MySQL

### Tabel `bookings`:
```sql
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    time VARCHAR(5) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_booking (date, time)
);
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
