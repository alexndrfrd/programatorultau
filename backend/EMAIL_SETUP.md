# Setup Email Notifications

## 📧 Configurare Email

Sistemul trimite automat email-uri când se face o rezervare:
- **Client** - Email de confirmare cu detaliile rezervării
- **Admin** - Notificare cu detaliile noii rezervări

## 🔧 Setup Rapid

### ⚠️ Problema cu Gmail App Passwords

Dacă nu vezi opțiunea "App passwords" în Gmail:
- Poate fi dezactivată de admin (conturi Google Workspace)
- Sau 2-Step Verification nu e activat complet

**Soluție**: Folosește [EMAIL_SETUP_SIMPLE.md](./EMAIL_SETUP_SIMPLE.md) pentru alternative mai simple (Outlook, SendGrid).

### Opțiunea 1: Gmail (Dacă App Passwords e disponibil)

1. **Activează "App Passwords" în Gmail:**
   - Mergi la https://myaccount.google.com/security
   - Activează "2-Step Verification" (dacă nu e activat)
   - Mergi la "App passwords"
   - Creează o parolă pentru aplicație
   - Copiază parola generată

2. **Configurează în `.env`:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password-here
   ADMIN_EMAIL=your-email@gmail.com
   ```

### Opțiunea 2: Outlook/Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
ADMIN_EMAIL=your-email@outlook.com
```

### Opțiunea 3: SendGrid (Pentru producție)

1. Creează cont pe https://sendgrid.com
2. Obține API Key
3. Configurează:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   ADMIN_EMAIL=your-email@example.com
   ```

## 📝 Variabile de Mediu

Adaugă în `backend/.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin email (unde se trimit notificările)
ADMIN_EMAIL=your-email@gmail.com
```

## ✅ Testare

După configurare, pornește serverul:

```bash
npm run dev
```

Ar trebui să vezi în loguri:
```
✅ Email service configured successfully
```

Dacă vezi:
```
⚠️ Email service not configured
```

Verifică:
1. Credențialele din `.env`
2. Parola App Password (pentru Gmail)
3. Firewall-ul nu blochează portul SMTP

## 🧪 Test Manual

Poți testa trimiterea email-urilor făcând o rezervare prin frontend sau API.

## 🔒 Securitate

- **Nu commita `.env`** - e deja în `.gitignore`
- **Folosește App Passwords** - nu parola principală Gmail
- **Pentru producție** - consideră SendGrid, Mailgun sau servicii profesionale

## 📊 Logs

Email-urile sunt loggate:
- **Succes**: `Client confirmation email sent` / `Admin notification email sent`
- **Eroare**: `Error sending client confirmation email` / `Error sending admin notification email`

Verifică `logs/combined.log` pentru detalii.

## 🚨 Troubleshooting

### Eroare: "Invalid login"
- Verifică că folosești App Password (nu parola principală)
- Pentru Gmail, asigură-te că "Less secure app access" e activat sau folosești App Password

### Eroare: "Connection timeout"
- Verifică firewall-ul
- Verifică că portul SMTP e deschis (587 sau 465)

### Email-urile nu ajung
- Verifică folderul Spam
- Verifică că adresa de email e corectă
- Verifică logurile pentru erori

## 📧 Template-uri Email

Template-urile sunt în `services/emailService.js`:
- `getClientEmailTemplate()` - Email pentru client
- `getAdminEmailTemplate()` - Email pentru admin

Poți personaliza template-urile după nevoi.

