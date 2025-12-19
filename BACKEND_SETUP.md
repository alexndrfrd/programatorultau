# Setup Backend - Ghid Complet

## 📋 Prezentare

Backend-ul este construit cu:
- **Node.js** + **Express** - Server API
- **MySQL** - Baza de date
- **Clean Architecture** - Cod organizat și scalabil

## 🚀 Setup Pas cu Pas

### 1. Instalează MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
- Descarcă de la https://dev.mysql.com/downloads/mysql/
- Instalează și pornește MySQL Service

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Configurează MySQL

```bash
# Conectează-te la MySQL
mysql -u root -p

# Creează un user (opțional, poți folosi root)
CREATE USER 'programatorultau'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'programatorultau'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Setup Backend

```bash
# Navighează în folderul backend
cd backend

# Instalează dependențele
npm install

# Copiază .env.example ca .env
cp .env.example .env

# Editează .env cu datele tale
# Deschide .env și actualizează:
#   DB_PASSWORD=your_mysql_password
#   DB_USER=root (sau user-ul creat)
```

### 4. Creează Database-ul

```bash
# Rulează script-ul de setup
npm run setup-db
```

Această comandă va:
- ✅ Crea database-ul `programatorultau`
- ✅ Crea tabelul `bookings` cu structura corectă
- ✅ Adăuga index-uri pentru performanță

### 5. Pornește Backend-ul

```bash
# Development (cu auto-reload)
npm run dev

# Sau production
npm start
```

Ar trebui să vezi:
```
✅ Database connected successfully
🚀 Server running on http://localhost:3000
📡 API available at http://localhost:3000/api
🏥 Health check: http://localhost:3000/health
```

### 6. Testează API-ul

Deschide în browser:
- http://localhost:3000/health - Ar trebui să vezi `{"status":"ok"}`

Sau cu curl:
```bash
curl http://localhost:3000/health
```

## 🔧 Configurare Frontend

### Actualizează script.js

În `script.js`, linia cu `API_BASE_URL` ar trebui să fie:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Pentru producție, schimbă la:
```javascript
const API_BASE_URL = 'https://api.programatorultau.com/api';
```

## 📡 Testare Completă

### 1. Testează că backend-ul rulează

```bash
curl http://localhost:3000/health
```

### 2. Testează crearea unei rezervări

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "time": "10:00",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+40 123 456 789"
  }'
```

Ar trebui să primești:
```json
{
  "success": true,
  "message": "Rezervare creată cu succes",
  "data": {
    "id": 1,
    "date": "2024-01-15",
    "time": "10:00",
    ...
  }
}
```

### 3. Testează citirea sloturilor ocupate

```bash
curl "http://localhost:3000/api/bookings?date=2024-01-15"
```

Ar trebui să vezi slotul `10:00` în `bookedSlots`.

### 4. Testează în browser

1. Pornește backend-ul (`npm run dev`)
2. Pornește frontend-ul (server local pe port 8000)
3. Mergi la secțiunea "Consultație Gratuită"
4. Selectează o dată
5. Fă o rezervare
6. Reîncarcă pagina și selectează aceeași dată
7. Slotul ar trebui să apară ca ocupat (gri, cu ✕)

## 🗄️ Verificare în MySQL

Poți verifica datele direct în MySQL:

```bash
mysql -u root -p

USE programatorultau;
SELECT * FROM bookings;
```

## 🚨 Troubleshooting

### Eroare: "Cannot connect to MySQL"

**Soluție:**
1. Verifică că MySQL rulează:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Verifică credențialele din `.env`

3. Testează conexiunea manual:
   ```bash
   mysql -u root -p
   ```

### Eroare: "Database doesn't exist"

**Soluție:**
```bash
npm run setup-db
```

### Eroare: "Access denied"

**Soluție:**
1. Verifică user-ul și parola în `.env`
2. Asigură-te că user-ul are permisiuni:
   ```sql
   GRANT ALL PRIVILEGES ON programatorultau.* TO 'your_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Eroare CORS în browser

**Soluție:**
Verifică în `backend/.env` că `CORS_ORIGIN` e setat corect:
```env
CORS_ORIGIN=http://localhost:8000
```

### Backend nu pornește

**Soluție:**
1. Verifică că portul 3000 nu e ocupat:
   ```bash
   lsof -i :3000
   ```

2. Schimbă portul în `.env`:
   ```env
   PORT=3001
   ```

## 📊 Structura Database

### Tabel: bookings

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

**Caracteristici:**
- `UNIQUE KEY (date, time)` - Previne rezervări duplicate
- Index pe `date` - Optimizează căutările
- Auto-increment pe `id` - ID-uri unice

## 🚀 Deploy pentru Producție

### Opțiuni de hosting:

1. **Heroku** - Simplu, gratuit pentru început
2. **DigitalOcean** - VPS, control complet
3. **AWS EC2** - Scalabil, dar mai complex
4. **Railway** - Simplu, modern

### Variabile de mediu pentru producție:

```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=programatorultau
CORS_ORIGIN=https://programatorultau.com
```

## ✅ Checklist Setup

- [ ] MySQL instalat și pornit
- [ ] Backend dependencies instalate (`npm install`)
- [ ] `.env` configurat cu credențiale MySQL
- [ ] Database creat (`npm run setup-db`)
- [ ] Backend rulează (`npm run dev`)
- [ ] Health check funcționează
- [ ] Frontend actualizat cu `API_BASE_URL`
- [ ] Testat crearea rezervării
- [ ] Testat citirea sloturilor ocupate

## 🎉 Gata!

După ce ai completat toți pașii, sistemul de booking ar trebui să funcționeze complet!

Pentru întrebări sau probleme, verifică:
- Logs-urile backend-ului în terminal
- Consola browser-ului (F12)
- MySQL pentru a verifica datele

