import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { ScrollArrows } from "./ScrollArrows";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
  onOpenCookies?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacy,
  onOpenCookies,
}) => {
  // Block body scroll when modal is open but allow modal content scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle scroll events for modal content
  React.useEffect(() => {
    if (!isOpen) return;

    const handleModalScroll = (e: WheelEvent) => {
      const modalContent = document.querySelector(
        '[data-modal-content="true"]'
      ) as HTMLElement | null;

      if (modalContent && modalContent.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();

        const deltaY = e.deltaY;
        const scrollTop = modalContent.scrollTop;
        const scrollHeight = modalContent.scrollHeight;
        const clientHeight = modalContent.clientHeight;

        if (
          (deltaY > 0 && scrollTop + clientHeight < scrollHeight) ||
          (deltaY < 0 && scrollTop > 0)
        ) {
          modalContent.scrollTop += deltaY;
        }
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("wheel", handleModalScroll, { passive: false });
    return () => {
      document.removeEventListener("wheel", handleModalScroll);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-gradient-to-br from-[#2C1E1A] to-[#1a110d] rounded-2xl shadow-2xl overflow-hidden border border-amber-600/30"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2C1E1A] to-[#1a110d] border-b border-amber-600/30 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FFD382]">Algemene voorwaarden</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-amber-600/20 rounded-full transition-colors duration-200"
                aria-label="Sluiten"
              >
                <IoClose size={24} className="text-[#FFD382]" />
              </button>
            </div>

            {/* Content */}
            <div className="relative">
              <div
                className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide terms-modal-content"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                data-modal-content="true"
              >
                <div className="prose prose-lg max-w-none">
                  <p className="text-[#FFD382]/80 mb-6">
                    <strong className="text-[#FFD382]">Laatst bijgewerkt:</strong> 1 september 2025
                  </p>

                  {/* 1. Definities */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">1. Definities</h3>
                  <p className="text-white/90 mb-4">In deze voorwaarden wordt verstaan onder:</p>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li><strong className="text-[#FFD382]">TableTech:</strong> TableTech, gevestigd te Rotterdam, ingeschreven bij de KvK onder nummer 98067826.</li>
                    <li><strong className="text-[#FFD382]">Klant:</strong> iedere natuurlijke of rechtspersoon die gebruikmaakt van de diensten van TableTech.</li>
                    <li><strong className="text-[#FFD382]">Diensten:</strong> het aanbieden van een digitaal bestel- en betalingssysteem voor horeca via web en mobiele apparaten.</li>
                    <li><strong className="text-[#FFD382]">Abonnement:</strong> de periodieke overeenkomst voor het gebruik van de Diensten.</li>
                    <li><strong className="text-[#FFD382]">Overeenkomst:</strong> de overeenkomst tussen TableTech en de Klant m.b.t. de Diensten.</li>
                    <li><strong className="text-[#FFD382]">Gebruiker:</strong> een medewerker of eindgebruiker die via de klant toegang krijgt tot het platform.</li>
                    <li><strong className="text-[#FFD382]">Content:</strong> alle gegevens, teksten, afbeeldingen of andere informatie die door de Klant via het platform wordt geplaatst.</li>
                  </ul>

                  {/* 2. Toepasselijkheid */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">2. Toepasselijkheid</h3>
                  <p className="text-white/90 mb-6">
                    Deze voorwaarden zijn van toepassing op alle offertes, overeenkomsten en leveringen van TableTech, tenzij schriftelijk anders is overeengekomen.
                  </p>

                  {/* 3. Aanbod en Overeenkomst */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">3. Aanbod en Overeenkomst</h3>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>Deze algemene voorwaarden zijn van toepassing op alle offertes, aanbiedingen, overeenkomsten en overige rechtsbetrekkingen waarbij TableTech diensten levert aan een Klant.</li>
                    <li>Indien de Klant eigen algemene voorwaarden hanteert, zijn deze uitdrukkelijk niet van toepassing, tenzij schriftelijk anders is overeengekomen.</li>
                    <li>Indien enige bepaling van deze voorwaarden nietig blijkt te zijn of vernietigd wordt, blijven de overige bepalingen volledig van kracht.</li>
                    <li>TableTech is gerechtigd deze algemene voorwaarden te wijzigen of aan te vullen. Gewijzigde voorwaarden gelden ook voor reeds bestaande overeenkomsten, waarbij TableTech de Klant tijdig van de wijzigingen op de hoogte zal stellen. Indien de Klant niet akkoord gaat met de gewijzigde voorwaarden, heeft de Klant het recht de overeenkomst schriftelijk op te zeggen binnen 30 dagen na kennisgeving.</li>
                    <li>Deze voorwaarden zijn uitsluitend van toepassing op overeenkomsten met zakelijke klanten (B2B). Consumenten kunnen geen beroep doen op deze voorwaarden.</li>
                  </ul>

                  {/* 4. Gebruik van de dienst */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">4. Gebruik van de dienst</h3>
                  <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                    <li>De Klant krijgt een niet-exclusief, niet-overdraagbaar en herroepbaar recht om het platform te gebruiken gedurende de looptijd van de overeenkomst.</li>
                    <li>Alle intellectuele eigendomsrechten met betrekking tot het platform, de software, documentatie en overige materialen berusten uitsluitend bij TableTech of haar licentiegevers. De Klant verkrijgt geen eigendomsrechten.</li>
                  </ul>
                  <p className="text-white/90 mb-4">Het is de Klant niet toegestaan om:</p>
                  <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                    <li>de Dienst of onderdelen daarvan te kopiëren, verhuren, verkopen, verhuren, sublicentiëren of op andere wijze beschikbaar te stellen aan derden;</li>
                    <li>de broncode te decompileren, te wijzigen of te reverse engineeren;</li>
                    <li>de Dienst te gebruiken voor illegale doeleinden, het verspreiden van malware of spam, of activiteiten die de werking van het platform of de infrastructuur van TableTech kunnen verstoren.</li>
                  </ul>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>De Klant is verantwoordelijk voor het zorgvuldig gebruik van inloggegevens en voor het handelen van alle gebruikers die namens de Klant toegang hebben.</li>
                    <li>TableTech is gerechtigd de toegang tot de Dienst tijdelijk of permanent te beperken of te beëindigen bij misbruik, onbevoegd gebruik of schending van deze voorwaarden.</li>
                  </ul>

                  {/* 5. Prijzen en Betaling */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">5. Prijzen en Betaling</h3>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>Alle door TableTech gehanteerde prijzen zijn exclusief btw en andere heffingen die door de overheid worden opgelegd, tenzij uitdrukkelijk anders vermeld.</li>
                    <li>Betaling vindt plaats maandelijks of jaarlijks vooruit, via automatische incasso of factuur, tenzij schriftelijk anders overeengekomen.</li>
                    <li>Facturen dienen binnen 14 dagen na factuurdatum te worden voldaan.</li>
                    <li>Bij uitblijven van (tijdige) betaling is de Klant van rechtswege in verzuim en is TableTech gerechtigd:
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>wettelijke (handels)rente en buitengerechtelijke incassokosten in rekening te brengen;</li>
                        <li>de toegang tot de Dienst tijdelijk te beperken of op te schorten totdat volledige betaling heeft plaatsgevonden.</li>
                      </ul>
                    </li>
                    <li>De Klant is niet gerechtigd betalingen op te schorten of te verrekenen met tegenvorderingen, tenzij deze tegenvorderingen schriftelijk door TableTech zijn erkend of in rechte onherroepelijk zijn vastgesteld.</li>
                    <li>TableTech is gerechtigd haar tarieven tussentijds aan te passen. Prijswijzigingen worden ten minste 30 dagen van tevoren schriftelijk of digitaal aan de Klant medegedeeld. Wijzigingen als gevolg van wet- of regelgeving (zoals btw-wijzigingen) mogen direct worden doorgevoerd.</li>
                  </ul>

                  {/* 6. Duur en Opzegging */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">6. Duur en Opzegging</h3>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>De overeenkomst wordt aangegaan voor de overeengekomen looptijd (maandelijks of jaarlijks) en wordt daarna automatisch verlengd met eenzelfde periode, tenzij de Klant de overeenkomst uiterlijk 30 dagen vóór het einde van de lopende periode schriftelijk of per e-mail opzegt.</li>
                    <li>TableTech is gerechtigd de overeenkomst met onmiddellijke ingang te beëindigen of de toegang tot de Dienst te blokkeren indien de Klant
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>in strijd handelt met deze voorwaarden;</li>
                        <li>in gebreke blijft bij het (tijdig) betalen van facturen, ook na aanmaning;</li>
                        <li>in staat van faillissement wordt verklaard, surseance van betaling aanvraagt of zijn onderneming staakt.</li>
                      </ul>
                    </li>
                    <li>Bij beëindiging van de overeenkomst blijven reeds vervallen betalingsverplichtingen onverkort verschuldigd.</li>
                    <li>Na beëindiging van de overeenkomst zal TableTech de door de Klant ingevoerde gegevens gedurende 30 dagen beschikbaar houden, waarna deze definitief verwijderd kunnen worden, tenzij wettelijke bewaartermijnen anders bepalen. Het is de verantwoordelijkheid van de Klant om tijdig een back-up van de gegevens te maken.</li>
                  </ul>

                  {/* 7. Onderhoud en Beschikbaarheid */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">7. Onderhoud en Beschikbaarheid</h3>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>TableTech streeft naar een zo hoog mogelijke beschikbaarheid van het platform, maar kan geen ononderbroken of foutloze werking garanderen.</li>
                    <li>TableTech voert regelmatig onderhoud en updates uit om de veiligheid, prestaties en functionaliteit van het platform te waarborgen. Gepland onderhoud wordt, waar mogelijk, minimaal 48 uur van tevoren aan de Klant gecommuniceerd en vindt zoveel mogelijk buiten kantooruren plaats.</li>
                    <li>In geval van dringend of ongepland onderhoud (bijvoorbeeld ter voorkoming van storingen, beveiligingsrisico’s of dataverlies) mag TableTech de Dienst zonder voorafgaande kennisgeving tijdelijk beperken of onderbreken.</li>
                    <li>Eventuele beperkingen of onderbrekingen geven de Klant geen recht op schadevergoeding of restitutie, tenzij sprake is van opzet of grove nalatigheid van TableTech. Hiervoor wordt verwezen naar artikel 8 (Aansprakelijkheid).</li>
                  </ul>

                  {/* 8. Aansprakelijkheid */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">8. Aansprakelijkheid</h3>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>TableTech is niet aansprakelijk voor indirecte schade, gevolgschade, gederfde winst, gemiste besparingen, verlies van gegevens of schade door bedrijfsstagnatie.</li>
                    <li>De aansprakelijkheid is in alle gevallen beperkt tot het bedrag dat in het betreffende jaar aan abonnementskosten is betaald.</li>
                    <li>Aansprakelijkheidsbeperkingen gelden niet indien de schade het gevolg is van opzet of bewuste roekeloosheid van TableTech of haar leidinggevende ondergeschikten.</li>
                    <li>Voor zover de wet dit toestaat, is iedere verdere aansprakelijkheid van TableTech uitgesloten.</li>
                    <li>Indien de Klant consument is, gelden de wettelijke bepalingen en beperkingen inzake aansprakelijkheid en consumentbescherming onverkort.</li>
                  </ul>

                  {/* 9. Gegevensbescherming */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">9. Gegevensbescherming</h3>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>TableTech verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG) en zoals beschreven in de Privacyverklaring die integraal onderdeel uitmaakt van deze voorwaarden.</li>
                    <li>Voor zover TableTech in opdracht van de Klant persoonsgegevens verwerkt, treedt TableTech op als verwerker en de Klant als verwerkingsverantwoordelijke. In dat geval wordt een afzonderlijke verwerkersovereenkomst gesloten waarin de rechten en verplichtingen van partijen worden vastgelegd.</li>
                    <li>TableTech zal passende technische en organisatorische maatregelen treffen om persoonsgegevens te beveiligen tegen verlies, misbruik, onbevoegde toegang en andere onrechtmatige vormen van verwerking.</li>
                    <li>TableTech verwerkt persoonsgegevens uitsluitend voor het uitvoeren van de overeengekomen Diensten, tenzij met de Klant uitdrukkelijk anders is overeengekomen of op grond van wettelijke verplichtingen.</li>
                    <li>De Klant is verantwoordelijk voor de juistheid en rechtmatigheid van de door hem ingevoerde persoonsgegevens en vrijwaart TableTech voor aanspraken van derden in dit verband.</li>
                    <li>Persoonsgegevens worden niet langer bewaard dan noodzakelijk voor de uitvoering van de overeenkomst of zolang de wet dit vereist.</li>
                  </ul>

                  {/* 10. Overmacht */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">10. Overmacht</h3>
                  <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                    <li>Onder overmacht wordt verstaan iedere van de wil van TableTech onafhankelijke omstandigheid die de nakoming van de overeenkomst blijvend of tijdelijk verhindert, ook indien deze omstandigheid bij het aangaan van de overeenkomst reeds voorzienbaar was. Hieronder vallen onder meer: storingen in de energievoorziening of telecommunicatie, netwerk- of internetstoringen, storingen bij leveranciers of andere derden, werkstakingen, ziekte van personeel, overheidsmaatregelen, natuurrampen, pandemieën, cyberaanvallen en overige gebeurtenissen waarop TableTech geen beslissende invloed kan uitoefenen.</li>
                    <li>In geval van overmacht worden de verplichtingen van TableTech opgeschort zolang de overmachtssituatie voortduurt.</li>
                    <li>Indien de overmachtssituatie langer dan 30 dagen voortduurt, hebben beide partijen het recht de overeenkomst schriftelijk te beëindigen zonder dat er een verplichting tot schadevergoeding ontstaat.</li>
                    <li>Schade die voortvloeit uit of verband houdt met een situatie van overmacht komt niet voor vergoeding in aanmerking, conform artikel 8 (Aansprakelijkheid).</li>
                  </ul>

                  {/* 11. Toepasselijk recht */}
                  <h3 className="text-xl font-semibold text-[#FFD382] mb-4">11. Toepasselijk recht</h3>
                  <ul className="list-disc pl-6 mb-12 text-white/80 space-y-2 marker:text-amber-500">
                    <li>Op deze algemene voorwaarden en op alle overeenkomsten tussen TableTech en de Klant is uitsluitend Nederlands recht van toepassing.</li>
                    <li>Geschillen die voortvloeien uit of verband houden met de overeenkomst worden in eerste instantie in onderling overleg opgelost. Indien dit niet mogelijk blijkt, worden geschillen uitsluitend voorgelegd aan de bevoegde rechter in het arrondissement waar TableTech is gevestigd.</li>
                    <li>Indien de Klant een consument is, geldt dat de consument ook het recht heeft een geschil voor te leggen aan de volgens de wet bevoegde rechter in zijn/haar eigen woonplaats.</li>
                    <li>Indien de Klant gevestigd is buiten Nederland, blijft eveneens Nederlands recht van toepassing.</li>
                  </ul>

                  <div className="bg-gradient-to-r from-amber-600/10 to-amber-700/10 border border-amber-600/30 p-4 rounded-lg mb-12 mt-8">
                    <p className="text-white/90">
                      <strong className="text-[#FFD382]">Contact:</strong><br />
                      E-mail:{" "}
                      <a
                        href="mailto:info@tabletech.nl"
                        className="text-amber-400 hover:text-amber-300 underline"
                      >
                        info@tabletech.nl
                      </a>
                      <br />
                      Telefoon:{" "}
                      <a
                        href="tel:+31853030723"
                        className="text-amber-400 hover:text-amber-300 underline"
                      >
                        +31 85 303 07 23
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Scroll Arrows - Hidden up to 900px */}
              <div className="max-[900px]:hidden">
                <ScrollArrows targetSelector=".terms-modal-content" />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-[#2C1E1A] to-[#1a110d] border-t border-amber-600/30 px-6 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className="flex gap-3">
                  {onOpenPrivacy && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPrivacy();
                      }}
                      className="px-4 py-2 bg-transparent border border-amber-600/50 text-[#FFD382] rounded-lg hover:bg-amber-600/10 hover:border-amber-600 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl text-center"
                    >
                      Privacybeleid
                    </button>
                  )}
                  {onOpenCookies && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCookies();
                      }}
                      className="px-4 py-2 bg-transparent border border-amber-600/50 text-[#FFD382] rounded-lg hover:bg-amber-600/10 hover:border-amber-600 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl text-center"
                    >
                      Cookiebeleid
                    </button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl text-center"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
