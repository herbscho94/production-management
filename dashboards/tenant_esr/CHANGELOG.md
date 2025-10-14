# Changelog - Events Green Rentals Dashboard

## Version 1.0.0 (14. Oktober 2025)

### 🎉 Initial Release - LED Wall Management System

#### ✨ Neue Features

##### 🏠 Dashboard (Overview)
- **Statistik-Karten**: Gesamtanzahl LED-Wände, Verfügbare, Aktive Buchungen, Aktive Kunden
- **Schnellaktionen**: Neue Buchung, Angebot erstellen, Neuer Kunde, Rechnung erstellen
- **LED-Wände Übersicht**: Tabelle mit allen LED-Wänden, Status und Tagespreisen
- **Aktivitäts-Feed**: Zeigt letzte Angebote und Kommunikation

##### 📅 Kalender & Vermietung
- **Monatskalender**: Übersicht über LED-Wand-Verfügbarkeit
- **Buchungsanzeige**: Farbige Markierung von gebuchten Tagen
- **Buchungsliste**: Detaillierte Auflistung aller Buchungen
- **Navigation**: Vorheriger/Nächster Monat
- **Doppelbuchungs-Warnung**: Visuelle Anzeige bei Überschneidungen

##### 🖥️ LED-Wände
- **Equipment-Grid**: Karten-basierte Ansicht der LED-Wände
- **Technische Details**: Spezifikationen, Hersteller, Modell
- **Status-Tracking**: Verfügbar, Vermietet, Wartung
- **Preis-Information**: Tagespreis prominent angezeigt
- **Wartungs-Info**: Letzter Service, Nächster Service

##### 👥 Kunden (CRM)
- **Kundendatenbank**: Vollständige Kontaktverwaltung
  - Firmenname und Ansprechpartner
  - Adresse (Straße, PLZ, Stadt, Land)
  - Telefon und E-Mail
  - Status (Aktiv, Potenziell, Inaktiv)
  - Notizen
  - Kunde-seit Datum

- **Kommunikations-Tracking**:
  - E-Mail, Telefon, Meeting
  - Datum und Gesprächsnotizen
  - Zugeordneter Mitarbeiter
  - Kundenreferenz

##### 📄 Angebote
- **Angebotserstellung**: 
  - Automatische Angebotsnummern (ANG-2025-XXX)
  - Kundenauswahl
  - LED-Wand-Auswahl (einzeln oder beide)
  - Mietzeitraum mit Tagesberechnung
  - Automatische Preisberechnung
  - MwSt-Berechnung (19%)
  - Gültigkeitsdatum

- **Status-Management**:
  - Entwurf (Grau)
  - Gesendet (Blau)
  - Angenommen (Grün)
  - Abgelehnt (Rot)

- **Filter**: Nach Status filterbar

##### 💰 Rechnungen
- **Rechnungserstellung**:
  - Automatische Rechnungsnummern (RE-2025-XXX)
  - Verknüpfung mit Angeboten
  - Positions-basierte Abrechnung
  - Zwischensumme, MwSt, Gesamtbetrag
  - Fälligkeitsdatum (30 Tage Standard)

- **Zahlungs-Status**:
  - Ausstehend (Gelb)
  - Bezahlt (Grün)
  - Überfällig (Rot)
  - Teilweise bezahlt (Blau)

- **Features**:
  - Überfälligkeits-Warnungen mit Tagesanzahl
  - PDF-Export (Vorbereitung)
  - Als bezahlt markieren

- **Filter**: Nach Zahlungsstatus filterbar

#### 🎨 Design & Branding

- **Farb-Schema**: Grünes Theme für "Green Rentals"
  - Primär: Grün (#10b981)
  - Sekundär: Dunkelgrau (#1f2937)
  - Akzent: Bernstein (#f59e0b)

- **Logo**: EGR (Events Green Rentals)

- **UI-Komponenten**:
  - Moderne Karten mit Hover-Effekten
  - Status-Badges mit Farb-Kodierung
  - Responsive Grid-Layouts
  - Schatten und Animationen

#### 🏗️ Technische Architektur

##### Modulare JavaScript-Struktur:
1. `dashboard.js` - Kern-Funktionalität und Authentifizierung
2. `navigation.js` - View-Switching System
3. `calendar.js` - Kalender-Logik und Buchungen
4. `customers.js` - CRM und Kundenverwaltung
5. `quotes.js` - Angebotsverwaltung
6. `invoices.js` - Rechnungsverwaltung
7. `communication.js` - Kommunikations-Tracking

##### Modulare CSS-Struktur:
1. `dashboard.css` - Basis-Styles und Komponenten
2. `calendar.css` - Kalender-spezifische Styles
3. `crm.css` - CRM-Komponenten
4. `quotes.css` - Angebots-Komponenten
5. `invoices.css` - Rechnungs-Komponenten

##### Datenstruktur:
- `equipment.json` - LED-Wände Daten (2 LED-Wände)
- `crm.json` - Vollständiges CRM (Kunden, Kommunikation, Angebote, Rechnungen, Buchungen)
- `users.json` - Benutzer-Accounts

#### 🔌 Backend-Integration

- **API-Endpunkt**: `GET /api/tenants/tenant_esr/crm`
- **Authentifizierung**: JWT-basiert
- **Daten-Format**: JSON

#### 📊 Vorinstallierte Daten

##### Kunden (3):
1. TechEvent GmbH (Aktiv)
2. Festival Productions (Aktiv)
3. Corporate Events Plus (Potenziell)

##### LED-Wände (2):
1. LED-Wand Premium 6x4m (Samsung The Wall Pro) - 800€/Tag
2. LED-Wand Standard 4x3m (LG Direct View LED) - 500€/Tag

##### Kommunikation (3):
- E-Mail und Telefon-Einträge mit TechEvent
- Meeting-Notizen mit Festival Productions

##### Angebote (2):
- ANG-2025-001 für TechEvent (Gesendet)
- ANG-2025-002 für Festival Productions (Angenommen)

##### Rechnungen (1):
- RE-2025-001 für Festival Productions (Ausstehend)

##### Buchungen (1):
- Herbst Music Festival (20.-22. November 2025)

#### 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Laptop (1366px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

#### 📚 Dokumentation

- `README.md` - Vollständige Dashboard-Dokumentation
- `CHANGELOG.md` - Diese Datei
- Inline-Code-Dokumentation in allen JS-Dateien

#### 🔒 Sicherheit

- JWT-Token-basierte Authentifizierung
- Tenant-Isolation (tenant_esr)
- Session-Management mit Ablaufzeit
- CORS-geschützte API

#### 🚀 Performance

- Lazy Loading von Views
- Modulares JavaScript (keine Monolithen)
- Optimierte CSS-Selektoren
- Caching von API-Daten

---

## Geplante Features (Roadmap)

### Version 1.1.0
- [ ] PDF-Export für Angebote
- [ ] PDF-Export für Rechnungen
- [ ] E-Mail-Vorlagen

### Version 1.2.0
- [ ] Dokumenten-Upload für Kunden
- [ ] Erweitertes Reporting
- [ ] Dashboard-Widgets anpassen

### Version 1.3.0
- [ ] Wartungsplanung für LED-Wände
- [ ] Benachrichtigungen (Browser-Push)
- [ ] Erweiterte Suchfunktion

### Version 2.0.0
- [ ] Mobile App
- [ ] Offline-Modus
- [ ] Erweiterte Benutzer-Rollen

---

© 2025 Events Green Rentals | VBS Production Management Platform

