# Setup .env - Ghid Rapid

## 📝 Parola MySQL

### Unde găsești parola MySQL?

**Opțiunea 1: Parola pe care ai setat-o la instalare**
- Dacă ai instalat MySQL recent, parola e cea pe care ai setat-o la instalare
- Dacă nu ții minte, poți să o resetezi (vezi mai jos)

**Opțiunea 2: Fără parolă (dacă nu ai setat)**
- Unele instalări MySQL nu au parolă setată
- În acest caz, lasă `DB_PASSWORD=` gol

**Opțiunea 3: Resetează parola**
- Vezi instrucțiunile de mai jos

## 🚀 Setup Rapid

### 1. Creează fișierul .env

```bash
cd backend
cp .env.example .env
```

### 2. Editează .env

Deschide `.env` și actualizează:

```env
DB_PASSWORD=parola_ta_mysql_aici
```

**Dacă nu ai parolă:**
```env
DB_PASSWORD=
```

### 3. Testează conexiunea

```bash
# Încearcă să te conectezi la MySQL
mysql -u root -p
```

Dacă funcționează, parola e corectă!

## 🔑 Resetare Parolă MySQL (dacă ai uitat-o)

### macOS (Homebrew):

```bash
# Oprește MySQL
brew services stop mysql

# Pornește MySQL în mod sigur (fără verificare parolă)
mysqld_safe --skip-grant-tables &

# Conectează-te fără parolă
mysql -u root

# În MySQL, resetează parola:
USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'noua_parola';
FLUSH PRIVILEGES;
EXIT;

# Oprește MySQL sigur
mysqladmin shutdown

# Pornește MySQL normal
brew services start mysql
```

### Linux:

```bash
# Oprește MySQL
sudo systemctl stop mysql

# Pornește MySQL în mod sigur
sudo mysqld_safe --skip-grant-tables &

# Conectează-te fără parolă
mysql -u root

# În MySQL, resetează parola:
USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'noua_parola';
FLUSH PRIVILEGES;
EXIT;

# Oprește MySQL sigur
sudo mysqladmin shutdown

# Pornește MySQL normal
sudo systemctl start mysql
```

## ✅ Verificare

După ce ai setat parola în `.env`, testează:

```bash
cd backend
npm run setup-db
```

Dacă vezi `✅ Database connected successfully`, totul e OK!

## 💡 Tips

- **Nu commita `.env`** - e deja în `.gitignore`
- **Pentru producție** - folosește variabile de mediu sigure
- **Dacă ai probleme** - verifică că MySQL rulează:
  ```bash
  # macOS
  brew services list
  
  # Linux
  sudo systemctl status mysql
  ```

