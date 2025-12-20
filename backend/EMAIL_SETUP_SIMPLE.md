# Setup Email Simplu - Fără App Password

## 🎯 Opțiunea 1: Outlook/Office 365 (CEL MAI SIMPLU)

Outlook funcționează cu parola normală, fără App Password!

### Setup:

1. **Creează cont Outlook** (dacă nu ai): https://outlook.com

2. **Configurează în `.env`:**
   ```env
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@outlook.com
   SMTP_PASSWORD=your-normal-password
   ADMIN_EMAIL=your-email@outlook.com
   ```

3. **Gata!** Funcționează imediat.

---

## 🚀 Opțiunea 2: SendGrid (Recomandat pentru Producție)

SendGrid e gratuit pentru până la 100 email-uri/zi.

### Setup:

1. **Creează cont**: https://sendgrid.com
2. **Verifică email-ul** (din SendGrid dashboard)
3. **Creează API Key**:
   - Settings → API Keys → Create API Key
   - Dă-i un nume (ex: "Programatorul Tău")
   - Selectează "Full Access"
   - Copiază API Key-ul

4. **Configurează în `.env`:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key-here
   ADMIN_EMAIL=your-email@example.com
   ```

---

## 📧 Opțiunea 3: Mailgun (Alternativă)

Similar cu SendGrid, gratuit pentru 100 email-uri/zi.

### Setup:

1. **Creează cont**: https://www.mailgun.com
2. **Verifică domeniul** sau folosește sandbox domain
3. **Obține SMTP credentials** din dashboard
4. **Configurează în `.env`:**
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-mailgun-username
   SMTP_PASSWORD=your-mailgun-password
   ADMIN_EMAIL=your-email@example.com
   ```

---

## ✅ Testare

După configurare, pornește serverul:

```bash
npm run dev
```

Ar trebui să vezi:
```
✅ Email service configured successfully
```

Fă o rezervare și verifică că primești email-urile!

---

## 🎯 Recomandare

- **Pentru testare rapidă**: Outlook (cel mai simplu)
- **Pentru producție**: SendGrid (gratuit, profesional, scalabil)

