# Feature Flags - Ghid de Utilizare

## Ce sunt Feature Flags?

Feature Flags-urile te ajută să activezi sau dezactivezi ușor secțiuni întregi ale site-ului fără să modifici HTML-ul sau CSS-ul.

## Cum funcționează?

1. Deschide fișierul `feature-flags.js`
2. Schimbă `true` în `false` pentru secțiunea pe care vrei să o dezactivezi
3. Salvează fișierul și reîncarcă pagina

## Secțiuni disponibile

### `aiSection`
- **Ce face:** Activează/dezactivează întreaga secțiune AI Tools
- **Ce ascunde:** Secțiunea AI, linkurile din navbar, butoanele din hero
- **Exemplu:** `aiSection: false` → Ascunde tot ce ține de AI

### `siteLaClick`
- **Ce face:** Activează/dezactivează secțiunea "Site la Click"
- **Ce ascunde:** Secțiunea Site la Click, linkurile din navbar, butoanele din hero
- **Exemplu:** `siteLaClick: false` → Ascunde tot ce ține de Site la Click

### `dashboardOffer`
- **Ce face:** Activează/dezactivează dashboard-ul "Ce Oferim"
- **Ce ascunde:** Dashboard-ul cu cardurile (Site la Click, Magazin Online, etc.)
- **Exemplu:** `dashboardOffer: false` → Ascunde dashboard-ul

### `servicesSection`
- **Ce face:** Activează/dezactivează secțiunea Servicii
- **Ce ascunde:** Toate cardurile de servicii
- **Exemplu:** `servicesSection: false` → Ascunde secțiunea Servicii

### `projectsSection`
- **Ce face:** Activează/dezactivează secțiunea Proiecte
- **Ce ascunde:** Toate proiectele afișate
- **Exemplu:** `projectsSection: false` → Ascunde secțiunea Proiecte

### `consultationBooking`
- **Ce face:** Activează/dezactivează calendarul de rezervări
- **Ce ascunde:** Secțiunea "Consultație Gratuită" cu calendarul
- **Exemplu:** `consultationBooking: false` → Ascunde calendarul

### `contactForm`
- **Ce face:** Activează/dezactivează formularul de contact
- **Ce ascunde:** Secțiunea Contact cu formularul
- **Exemplu:** `contactForm: false` → Ascunde formularul de contact

### `footer`
- **Ce face:** Activează/dezactivează footer-ul
- **Ce ascunde:** Footer-ul complet
- **Exemplu:** `footer: false` → Ascunde footer-ul

## Exemple de utilizare

### Dezactivează secțiunea AI
```javascript
aiSection: false
```

### Dezactivează Site la Click
```javascript
siteLaClick: false
```

### Dezactivează mai multe secțiuni
```javascript
aiSection: false,
siteLaClick: false,
consultationBooking: false
```

## Note importante

- Când dezactivezi o secțiune, linkurile din navbar care duc la acea secțiune vor fi eliminate automat
- Butoanele din hero care duc la secțiunea dezactivată vor fi ascunse
- Cardurile din dashboard care duc la secțiuni dezactivate vor fi ascunse
- Schimbările sunt aplicate imediat după reîncărcarea paginii

## Debugging

Dacă o secțiune nu se ascunde corect:
1. Verifică în consola browser-ului (F12) dacă există erori
2. Verifică că numele feature flag-ului este corect în `feature-flags.js`
3. Verifică că secțiunea are atributul `data-feature` în HTML

