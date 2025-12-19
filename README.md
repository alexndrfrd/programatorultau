# Programatorul Tău

Site web profesional pentru servicii IT personalizate, cu sistem de rezervări și cereri de site-uri.

## 📋 Descriere

Programatorul Tău este o platformă web modernă care oferă:
- **Servicii IT personalizate** - dezvoltare software, site-uri web, aplicații mobile
- **Sistem de rezervări** - calendar interactiv pentru programarea consultațiilor
- **Generator de site-uri** - configurator pentru site-uri personalizate (magazin online sau site complex)
- **Design modern și responsive** - interfață optimizată pentru toate dispozitivele

## 🚀 Tehnologii

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase (Firestore Database)
- **Fonts**: Google Fonts (Inter)
- **Icons**: SVG custom

## 📁 Structura Proiectului

```
programatorultau/
├── index.html          # Pagina principală
├── solutions.html      # Pagina cu soluții
├── script.js          # Logica JavaScript
├── styles.css         # Stiluri CSS
├── FIREBASE_SETUP.md  # Ghid de configurare Firebase
└── README.md          # Documentație proiect
```

## 🛠️ Instalare și Configurare

### 1. Clonează repository-ul

```bash
git clone https://github.com/alexndrfrd/programatorultau.git
cd programatorultau
```

### 2. Configurează Firebase

Urmează instrucțiunile din [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) pentru a configura Firebase.

### 3. Deschide în browser

Deschide `index.html` într-un browser modern sau folosește un server local:

```bash
# Cu Python
python -m http.server 8000

# Cu Node.js (http-server)
npx http-server

# Cu PHP
php -S localhost:8000
```

Apoi accesează `http://localhost:8000` în browser.

## ✨ Funcționalități

### Calendar de Rezervări
- Selectare dată și oră
- Validare disponibilitate
- Salvare în Firebase Firestore

### Generator de Site-uri
- **Plan 1**: Site simplu (predefinit)
- **Plan 2**: Magazin online (configurabil)
- **Plan 3**: Site complex (complet configurabil)

### Caracteristici Plan 2 & 3
- Selectare culori personalizate
- Configurare header (top/sticky)
- Toggle footer și sidebar
- Informații despre site (nume, email, telefon, descriere)

## 📝 Configurare Firebase

Proiectul folosește Firebase Firestore pentru:
- **Colecția `bookings`**: Rezervările de calendar
- **Colecția `site-requests`**: Cererile de site-uri

Vezi [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) pentru detalii complete.

## 🎨 Personalizare

### Culori
Modifică variabilele CSS din `styles.css` pentru a schimba tema:

```css
:root {
    --primary-color: #6366F1;
    --secondary-color: #8B5CF6;
    /* ... */
}
```

### Conținut
Editează `index.html` pentru a modifica textul și structura paginii.

## 📄 Licență

Acest proiect este proprietate privată.

## 👤 Autor

**Alexandru Besleaga**
- GitHub: [@alexndrfrd](https://github.com/alexndrfrd)

## 🤝 Contribuții

Contribuțiile sunt binevenite! Pentru modificări majore, te rugăm să deschizi un issue pentru a discuta ce vrei să schimbi.

---

Made with ❤️ by Programatorul Tău

