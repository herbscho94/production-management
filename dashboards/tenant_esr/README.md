# Events Green Rentals - LED Wall Management Dashboard

## 🏢 Über Events Green Rentals

Events Green Rentals ist ein spezialisiertes Vermietunternehmen für LED-Wände. Das Unternehmen vermietet hochwertige LED-Bildschirme für verschiedene Veranstaltungen und Events.

## 📋 Dashboard-Features

### 1. **Dashboard (Übersicht)**
- Statistiken zu LED-Wänden (Gesamt, Verfügbar)
- Aktive Buchungen & Kunden
- Schnellaktionen für häufige Aufgaben
- LED-Wände Übersicht mit Tagespreisen
- Aktivitäts-Feed

### 2. **Kalender & Vermietung**
- Monatsansicht mit Buchungen
- Visualisierung der LED-Wand-Verfügbarkeit
- Warnung bei Doppelbuchungen
- Buchungsdetails mit Event-Informationen
- Zeitraum-Verwaltung

### 3. **LED-Wände**
- Verwaltung der beiden LED-Wände
- Technische Spezifikationen
- Status-Tracking (Verfügbar, Vermietet, Wartung)
- Tagespreise und Vermietungsraten
- Wartungsintervalle

### 4. **Kunden (CRM)**
Das umfassende CRM-System beinhaltet:

#### 📇 Kundendatenbank
- Firmenname und Ansprechpartner
- Vollständige Kontaktdaten (Adresse, Telefon, E-Mail)
- Status (Aktiv, Potenziell, Inaktiv)
- Notizen und spezielle Vereinbarungen
- Kunde-seit Datum

#### 💬 Kommunikation
- Kommunikationsverlauf pro Kunde
- Verschiedene Kanäle (E-Mail, Telefon, Meeting)
- Datum und Gesprächsnotizen
- Zugeordneter Mitarbeiter

### 5. **Angebote**
- Angebotserstellung mit Angebotsnummer
- LED-Wand-Auswahl (einzeln oder beide)
- Mietzeitraum-Kalkulation
- Automatische Preisberechnung mit MwSt.
- Status-Tracking (Entwurf, Gesendet, Angenommen, Abgelehnt)
- Gültigkeitsdauer

### 6. **Rechnungen**
- Rechnungserstellung aus Angeboten
- Rechnungsnummer und Datum
- Fälligkeitsdatum und Zahlungsstatus
- Positions-basierte Abrechnung
- MwSt-Berechnung (19%)
- PDF-Export (in Entwicklung)
- Überfälligkeits-Warnungen

### 7. **Team**
- Benutzerverwaltung (Coming Soon)

## 🎨 Design & Branding

### Farben
- **Primärfarbe**: Grün (#10b981) - Umweltfreundlich & Modern
- **Sekundärfarbe**: Dunkelgrau (#1f2937) - Professionell
- **Akzentfarbe**: Bernstein (#f59e0b) - Auffällige Highlights
- **Blau**: (#3b82f6) - Informationen & Trust

### Logo
- **EGR** - Events Green Rentals

## 📊 Datenstruktur

### CRM-Daten (`crm.json`)
```json
{
  "customers": [...],      // Kundendatenbank
  "communications": [...], // Kommunikationsverlauf
  "quotes": [...],         // Angebote
  "invoices": [...],       // Rechnungen
  "bookings": [...]        // Buchungen
}
```

### Equipment-Daten (`equipment.json`)
- LED-Wand Premium 6x4m (Samsung The Wall Pro)
- LED-Wand Standard 4x3m (LG Direct View LED)

## 🚀 Technologie-Stack

### Frontend
- **HTML5** - Struktur
- **CSS3** - Modulares Design-System
- **Vanilla JavaScript** - Modulare Architektur

### Module (JS)
1. `dashboard.js` - Haupt-Dashboard & Authentifizierung
2. `navigation.js` - View-Switching
3. `calendar.js` - Kalender & Buchungen
4. `customers.js` - CRM & Kundenverwaltung
5. `quotes.js` - Angebotsverwaltung
6. `invoices.js` - Rechnungsverwaltung
7. `communication.js` - Kommunikations-Tracking

### Styling (CSS)
1. `dashboard.css` - Basis-Styles
2. `calendar.css` - Kalender-Komponenten
3. `crm.css` - CRM-Komponenten
4. `quotes.css` - Angebots-Komponenten
5. `invoices.css` - Rechnungs-Komponenten

### Backend
- **FastAPI** - REST API
- **JWT** - Authentifizierung
- **JSON** - Datenspeicherung

## 🔐 Authentifizierung

Login-Format: `username@tenant_esr`

Beispiel:
- Benutzername: `herbert@tenant_esr`
- Passwort: `YourSecurePassword`

## 📱 Responsive Design

Das Dashboard ist vollständig responsive und funktioniert auf:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔄 API-Endpunkte

### Authentifizierung
- `POST /api/auth/login` - Login

### Equipment
- `GET /api/tenants/tenant_esr/equipment` - LED-Wände abrufen

### CRM
- `GET /api/tenants/tenant_esr/crm` - Alle CRM-Daten

### Benutzer
- `GET /api/tenants/tenant_esr/users` - Benutzer abrufen

## 📈 Geplante Features

- [ ] PDF-Export für Angebote
- [ ] PDF-Export für Rechnungen
- [ ] E-Mail-Integration
- [ ] Dokumenten-Upload
- [ ] Erweiterte Statistiken & Reports
- [ ] Wartungsplanung
- [ ] Benutzer-Rollen & Berechtigungen
- [ ] Benachrichtigungen

## 💡 Workflow

### Typischer Vermietungsprozess:

1. **Kundenanfrage** → Erfassung in CRM
2. **Kommunikation** → Gesprächsnotizen speichern
3. **Angebot erstellen** → LED-Wand auswählen, Zeitraum festlegen
4. **Angebot senden** → Status: Gesendet
5. **Angebot akzeptiert** → Status: Angenommen
6. **Buchung erstellen** → Im Kalender eintragen
7. **Rechnung erstellen** → Aus Angebot generieren
8. **Rechnung senden** → Status: Ausstehend
9. **Zahlung erhalten** → Status: Bezahlt

## 🎯 Zielgruppe

Das Dashboard ist optimiert für:
- Geschäftsführer / Inhaber
- Vertriebsmitarbeiter
- Disponenten
- Buchhaltung

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an:
- Support-Link im Dashboard
- Dokumentation: `/api/docs`

## 🔧 Wartung

### Daten-Backup
- Regelmäßige Backups der `crm.json`
- Regelmäßige Backups der `equipment.json`

### Updates
- Automatische Updates über Git
- Changelog: `doc/CHANGELOG.md`

---

© 2025 Events Green Rentals | Powered by VBS Production Management Platform

