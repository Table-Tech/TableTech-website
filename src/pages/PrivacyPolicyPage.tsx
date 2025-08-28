import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
// Image moved to public: /images/hero-images/Planten.webp
import { useLenisScroll } from "../components/useLenisScroll"; // ✅ toegevoegd

export const PrivacyPolicyPage: React.FC = () => {
  useLenisScroll(); // ✅ activeer smooth scroll

  return (
    <div className="bg-[#2C1E1A] text-[#F5F0EB] min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src="/images/hero-images/Planten.webp"
          alt="Privacy Hero"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2C1E1A]/20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Privacybeleid
          </h1>
        </div>
      </div>

      <main className="pt-12 sm:pt-16 flex-grow">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white/70 text-[#2C1E1A] border border-[#E8D8CE] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
            <div className="mb-6">
              <p><strong>Laatst bijgewerkt:</strong> 28 augustus 2025</p>
              <p><strong>Versie:</strong> 1.0 – Geïntegreerde versie (website & applicatie)</p>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Inleiding en Contactgegevens</h2>
            <h3 className="text-lg font-semibold mb-3">1.1 Over TableTech</h3>
            <p className="mb-4">
              TableTech B.V. biedt een digitaal restaurantbestelsysteem waarmee klanten via QR-codes menu's kunnen bekijken en bestellingen kunnen plaatsen. Daarnaast bieden wij een bedrijfswebsite (https://tabletech.nl) voor informatie, afspraken en support.
            </p>
            <p className="mb-6">
              Wij nemen de bescherming van persoonsgegevens uiterst serieus en verwerken data in lijn met de Algemene Verordening Gegevensbescherming (AVG/GDPR).
            </p>

            <h3 className="text-lg font-semibold mb-3">1.2 Verwerkingsverantwoordelijke</h3>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
              <p>
                <strong>TableTech B.V.</strong><br />
                E-mail: <a href="mailto:privacy@tabletech.nl" className="text-blue-600 hover:text-blue-800 underline">privacy@tabletech.nl</a><br />
                Telefoon: <a href="tel:+31858883333" className="text-blue-600 hover:text-blue-800 underline">+31 85 888 3333</a>
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">2. Welke Gegevens Verzamelen Wij</h2>
            <h3 className="text-lg font-semibold mb-3">2.1 Websitebezoekers</h3>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Contact- en afspraakformulieren: naam, e-mail, telefoon, bedrijfsnaam (optioneel), bericht</li>
              <li>Support chat: gestelde vragen, communicatievoorkeuren (e-mail/WhatsApp)</li>
              <li>Technische gegevens: IP-adres (gehasht), browserinformatie, apparaattype, sessieduur, klikgedrag</li>
              <li>E-mailcommunicatie: interacties met nieuwsbrieven of bevestigingsmails (open/klikgedrag)</li>
              <li>Afspraakbeheer: referentienummers, status en tijdslot van afspraken</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">2.2 Restaurantklanten (QR-app gebruikers)</h3>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Automatisch: IP-adres, browser/device info, tafelcode/sessie-informatie, tijdstempels</li>
              <li>Optioneel: naam, e-mail (voor orderbevestigingen)</li>
              <li>Bestelgegevens: menu-items, hoeveelheden, opmerkingen, modifiers, tafelnummer, besteltijdstip</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">2.3 Restaurantpersoneel</h3>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Accounts: naam, e-mail, wachtwoord (gehashed), rol (Admin, Chef, Ober etc.)</li>
              <li>Logs: login-tijden, sessiegegevens, mislukte pogingen</li>
              <li>Activiteiten: bestellingswijzigingen, menu-updates, exportacties</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">2.4 Restaurantbedrijven</h3>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Bedrijfsnaam en adres, contactinformatie, BTW-gegevens</li>
              <li>Menu- en productinformatie, allergenen, prijzen, valuta</li>
              <li>Afbeeldingen/logo's, voorbereidingstijden</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">2.5 Betalingsgegevens (via Mollie)</h3>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Orderbedrag, BTW, betaalmethode, transactie-ID, status, timestamps</li>
              <li>Fraudepreventie-data en verificatietokens</li>
              <li><strong>Belangrijk:</strong> wij slaan géén betaalkaart- of bankgegevens op</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">2.6 Technische en Auditlogs</h3>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Systeemacties met tijdstempels en IP</li>
              <li>Server- en foutlogs</li>
              <li>Prestatie- en beveiligingsdata</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">3. Rechtsgrondslagen voor Verwerking</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Uitvoering van overeenkomst</strong> (Art. 6(1)(b)): bestellingen, betalingen, afspraakbeheer</li>
              <li><strong>Gerechtvaardigd belang</strong> (Art. 6(1)(f)): fraudepreventie, serviceverbetering, analytics</li>
              <li><strong>Wettelijke verplichting</strong> (Art. 6(1)(c)): fiscale bewaarplicht (7 jaar)</li>
              <li><strong>Toestemming</strong> (Art. 6(1)(a)): nieuwsbrieven, marketing, optionele cookies</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">4. Doeleinden van Gegevensverwerking</h2>
            <p className="mb-4">
              <strong>Primaire doeleinden:</strong> orderafhandeling, keukenbeheer, betalingen, afsprakenbeheer, klantenservice.
            </p>
            <p className="mb-6">
              <strong>Secundaire doeleinden:</strong> serviceverbetering, technische optimalisatie, beveiliging, marketing (alleen met toestemming).
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">5. Delen van Gegevens met Derden</h2>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li><strong>Resend:</strong> e-mailcommunicatie (VS, EU-VS Data Privacy Framework)</li>
              <li><strong>Mollie:</strong> betalingen (PCI DSS compliant, EU datacenters)</li>
              <li><strong>Vercel:</strong> hosting (EU/edge datacenters)</li>
              <li><strong>Railway:</strong> API hosting, database (EU/internationaal met SCC's)</li>
              <li><strong>Redis:</strong> caching (tijdelijke sessies)</li>
            </ul>
            <p className="mb-6">
              Wij verkopen nooit persoonsgegevens aan derden. Alleen wettelijke verzoeken worden gehonoreerd.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">6. Internationale Gegevensoverdracht</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Binnen de EU: standaard verwerking</li>
              <li>Buiten EU: alleen onder SCC's, adequacy decision of passende waarborgen</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">7. Bewaartermijnen</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Bestellingen & transacties: 7 jaar (fiscale verplichting)</li>
              <li>Afspraakgegevens: 2 jaar</li>
              <li>Supportgeschiedenis: 1 jaar</li>
              <li>Technische logs: 30–365 dagen afhankelijk van type</li>
              <li>Nieuwsbriefdata: tot uitschrijving + 1 jaar</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">8. Beveiligingsmaatregelen</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>TLS 1.3 encryptie in transit, AES-256 at rest</li>
              <li>bcrypt hashing voor wachtwoorden</li>
              <li>Role-based access control (RBAC)</li>
              <li>Firewalls, rate limiting, DDoS-bescherming</li>
              <li>Privacy by Design & standaardinstellingen</li>
              <li>Jaarlijkse audits en penetratietests</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">9. Uw Rechten onder de AVG/GDPR</h2>
            <p className="mb-4">
              U heeft recht op inzage, rectificatie, verwijdering, beperking, overdraagbaarheid en bezwaar.
            </p>
            <p className="mb-6">
              Verzoeken: <a href="mailto:privacy@tabletech.nl" className="text-blue-600 hover:text-blue-800 underline">privacy@tabletech.nl</a> – antwoord binnen 30 dagen.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">10. Cookies en Tracking Technologieën</h2>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li><strong>Essentieel:</strong> sessiebeheer, beveiliging, winkelwagen</li>
              <li><strong>Functioneel:</strong> taalinstellingen, foutmeldingen</li>
              <li><strong>Analytisch</strong> (met toestemming): gebruiksstatistieken, performance monitoring</li>
              <li>Geen advertentiecookies</li>
            </ul>
            <p className="mb-6">
              Cookievoorkeuren kunt u beheren via de cookie banner of browserinstellingen.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">11. Data Breach Procedures</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Detectie via 24/7 monitoring</li>
              <li>Melding aan Autoriteit Persoonsgegevens binnen 72 uur (indien vereist)</li>
              <li>Betrokkenen worden geïnformeerd bij hoog risico</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">12. Specifieke Verwerkingen</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>QR-code scanning: lokaal verwerkt, niet opgeslagen</li>
              <li>Betaalverwerking via Mollie: alleen noodzakelijke orderdata, geen kaartnummers</li>
              <li>Staff sessions: max. 3 tegelijk, auto-expiry, IP-validatie</li>
              <li>Menu caching: 5 minuten TTL, enkel functioneel</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">13. Kinderen en Privacy</h2>
            <p className="mb-6">
              Niet gericht op kinderen &lt;16 jaar. Gebruik onder toezicht van ouders aanbevolen.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">14. Wijzigingen in dit Privacybeleid</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Wijzigingen worden aangekondigd via de website of e-mail</li>
              <li>Huidige versie: 1.0 (28 augustus 2025)</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">15. Klachten en Toezichthouder</h2>
            <p className="mb-4">
              <strong>Autoriteit Persoonsgegevens</strong><br />
              Postbus 93374, 2509 AJ Den Haag<br />
              Website: https://autoriteitpersoonsgegevens.nl
            </p>
            <p className="mb-6">
              Eerst contact opnemen via: <a href="mailto:privacy@tabletech.nl" className="text-blue-600 hover:text-blue-800 underline">privacy@tabletech.nl</a>
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">16. Contact en Vragen</h2>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
              <p>
                <strong>Privacy Officer:</strong> <a href="mailto:privacy@tabletech.nl" className="text-blue-600 hover:text-blue-800 underline">privacy@tabletech.nl</a><br />
                <strong>Support:</strong> <a href="mailto:support@tabletech.nl" className="text-blue-600 hover:text-blue-800 underline">support@tabletech.nl</a><br />
                <strong>Security:</strong> <a href="mailto:security@tabletech.nl" className="text-blue-600 hover:text-blue-800 underline">security@tabletech.nl</a>
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">17. Bijlage A: Technische Specificaties</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Database: PostgreSQL met AES-256</li>
              <li>Caching: Redis</li>
              <li>Backups: dagelijks, 30 dagen retentie</li>
              <li>Authenticatie: JWT, RBAC</li>
              <li>Logging: Pino, 30 dagen–7 jaar</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4">18. Bijlage B: Wijzigingslog</h2>
            <p className="mb-6">
              Er zijn nog geen aanpassingen geweest aan dit privacybeleid sinds de publicatie van versie 1.0 op 28 augustus 2025.
            </p>

            <div className="text-sm text-gray-500 mt-8">
              <p>Dit privacybeleid dekt zowel de website (https://tabletech.nl) als de volledige applicatieomgeving van TableTech.</p>
              <p>Documentversie: PRIVACY-001-20250828</p>
              <p>Toepasselijk recht: Nederlands recht</p>
            </div>
          </div>
        </section>

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
