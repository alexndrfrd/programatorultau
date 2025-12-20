# Sistem Template-uri - Site la Click

## Prezentare Generală

Sistemul de template-uri permite clienților să genereze site-uri de prezentare instant, care sunt salvate în database și accesibile prin link-uri securizate cu token.

## Funcționalități

### 1. Site Prezentare - Generare Instant
- **3 planuri**: Basic (300 RON/lună), Pro (500 RON/lună), Premium (800 RON/lună)
- **5 teme**: Modern, Minimal, Bold, Corporate, Creative
- **Customizare completă**: texte, culori, logo, imagini
- **Generare instant**: site-ul este generat și salvat automat

### 2. Magazin Online - Subscription
- **3 planuri**: Starter (500 RON/lună), Business (800 RON/lună), Enterprise (1200 RON/lună)
- **Prețuri customizabile** din database
- **Funcționalități progresive** în funcție de plan

### 3. Site Complex - Consultare Prealabilă
- **Formular de cerere** cu detalii despre proiect
- **Consultație gratuită** obligatorie
- **Preț discutat ulterior** în funcție de cerințe

## Cum Funcționează

### Pentru Site Prezentare:

1. **Clientul selectează planul** (Basic/Pro/Premium)
2. **Alege tema** (din cele disponibile pentru planul său)
3. **Completează conținutul**: nume site, titlu, descriere, contact
4. **Personalizează design-ul**: culori, logo, imagini
5. **Preview** - vede cum arată site-ul
6. **Generare** - site-ul este:
   - Salvat în database cu token unic
   - Trimis email clientului cu link-ul de acces
   - Descărcat ca backup HTML

### Acces Template:

Clientul primește un email cu:
- **Link de acces**: `programatorultau.ro/templates/{id}?token={token}`
- **Token de securitate** pentru acces

Template-ul poate fi accesat doar cu token-ul corect.

## Structura Backend

### Tabel `templates`:
```sql
- id (INT, PRIMARY KEY)
- site_name (VARCHAR)
- site_type (VARCHAR) - 'prezentare', 'magazin', 'complex'
- plan (VARCHAR)
- theme (VARCHAR)
- html_content (LONGTEXT)
- config_data (JSON)
- client_email (VARCHAR)
- client_name (VARCHAR)
- token (VARCHAR, UNIQUE)
- created_at (TIMESTAMP)
```

### API Endpoints:

- `POST /api/templates` - Creează template nou
- `GET /api/templates/:id?token=xxx` - Obține template (cu token)
- `GET /api/templates` - Listă toate template-urile (admin)
- `DELETE /api/templates/:id` - Șterge template

## Securitate

- Fiecare template are un **token unic** generat aleator
- Accesul se face doar cu token-ul corect
- Token-ul este trimis doar pe email clientului
- Nu există acces public fără token

## Workflow pentru Admin

1. **Clientul generează site-ul** → Template salvat în DB
2. **Admin primește notificare** (opțional, prin email)
3. **Admin verifică template-ul** în database sau prin API
4. **Admin mută site-ul pe hosting** manual
5. **Admin cumpără domeniu** și configurează DNS
6. **Admin comunică clientului** că site-ul este live

## Fișiere Importante

- `backend/models/Template.js` - Model pentru template-uri
- `backend/controllers/templateController.js` - Logică business
- `backend/routes/templates.js` - API routes
- `template-viewer.html` - Pagina de vizualizare template
- `site-templates.js` - Template-urile HTML (5 teme)

## Customizare Prețuri

Pentru magazine online, prețurile pot fi customizate direct în database:

```sql
-- Exemplu: actualizare preț plan
UPDATE subscriptions SET price = 600 WHERE plan = 'starter' AND site_type = 'magazin';
```

## Notă Importantă

- **Site-urile de prezentare** sunt generate instant și salvate
- **Magazinele online** necesită consultație (prețuri customizabile)
- **Site-urile complexe** necesită consultație obligatorie (preț discutat)

