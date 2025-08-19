import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface CustomerConfirmationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  restaurant?: string;
  preferredDate?: string;
  preferredTime?: string;
  message: string;
}

export const CustomerConfirmationEmail = ({
  firstName,
  lastName,
  email,
  phone,
  restaurant,
  preferredDate,
  preferredTime,
  message,
}: CustomerConfirmationEmailProps) => {
  const previewText = `Bevestiging: we hebben je aanvraag ontvangen`;

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <meta name="x-apple-disable-message-reformatting" />
        <style>{`
          @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1a1a1a !important; }
            .dark-mode-text { color: #ffffff !important; }
            .dark-mode-text-secondary { color: #e2e8f0 !important; }
            .dark-mode-border { border-color: #333333 !important; }
          }
          @media (prefers-color-scheme: light) {
            .light-mode-bg { background-color: #ffffff !important; }
            .light-mode-text { color: #1a1a1a !important; }
            .light-mode-text-secondary { color: #4a5568 !important; }
            .light-mode-border { border-color: #e2e8f0 !important; }
          }
          @media only screen and (max-width: 600px) {
            .container { width: 95% !important; margin: 10px auto !important; }
            .content { padding: 15px !important; }
            .header-section { padding: 15px !important; }
            .header-title { font-size: 20px !important; }
            .main-title { font-size: 22px !important; }
          }
          * { box-sizing: border-box; }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main} className="dark-mode-bg light-mode-bg">
        <Container style={outerContainer} className="dark-mode-bg light-mode-bg">
          
          <Container style={container} className="container dark-mode-bg light-mode-bg dark-mode-border light-mode-border">
            
            {/* Header zonder logo */}
            <Section style={headerSection} className="header-section">
              <Text style={headerTitle} className="header-title">TableTech</Text>
            </Section>

            {/* Content sectie */}
            <Section style={contentSection} className="content dark-mode-bg light-mode-bg">
              
              {/* Hoofdtitel */}
              <Heading style={h1} className="main-title dark-mode-text light-mode-text">Bedankt voor je aanvraag!</Heading>
              
              <Text style={greeting} className="dark-mode-text light-mode-text">
                Beste {firstName},
              </Text>
              
              <Text style={bodyText} className="dark-mode-text-secondary light-mode-text-secondary">
                We hebben je aanvraag voor een afspraak ontvangen en zullen spoedig contact met je opnemen om de details te bespreken.
              </Text>

              {/* Appointment highlight */}
              {preferredDate && preferredTime && (
                <Section style={appointmentBox}>
                  <Text style={appointmentIcon}>📅</Text>
                  <Text style={appointmentTitle}>Jouw voorkeur</Text>
                  <Text style={appointmentDate}>
                    {preferredDate} om {preferredTime}
                  </Text>
                  <Text style={appointmentNote}>
                    Telefonisch gesprek van 30 minuten
                  </Text>
                </Section>
              )}

              {/* Details section */}
              <Section style={detailsBox} className="dark-mode-bg light-mode-bg dark-mode-border light-mode-border">
                <Heading as="h2" style={detailsTitle}>
                  Overzicht van je aanvraag
                </Heading>
                
                <table style={detailsTable}>
                  <tr>
                    <td style={labelCell} className="dark-mode-text light-mode-text"><strong>Naam:</strong></td>
                    <td style={valueCell} className="dark-mode-text-secondary light-mode-text-secondary">{firstName} {lastName}</td>
                  </tr>
                  <tr>
                    <td style={labelCell} className="dark-mode-text light-mode-text"><strong>E-mail:</strong></td>
                    <td style={valueCell} className="dark-mode-text-secondary light-mode-text-secondary">{email}</td>
                  </tr>
                  {phone && (
                    <tr>
                      <td style={labelCell} className="dark-mode-text light-mode-text"><strong>Telefoon:</strong></td>
                      <td style={valueCell} className="dark-mode-text-secondary light-mode-text-secondary">{phone}</td>
                    </tr>
                  )}
                  {restaurant && (
                    <tr>
                      <td style={labelCell} className="dark-mode-text light-mode-text"><strong>Restaurant:</strong></td>
                      <td style={valueCell} className="dark-mode-text-secondary light-mode-text-secondary">{restaurant}</td>
                    </tr>
                  )}
                  {preferredDate && (
                    <tr>
                      <td style={labelCell} className="dark-mode-text light-mode-text"><strong>Datum:</strong></td>
                      <td style={valueCell} className="dark-mode-text-secondary light-mode-text-secondary">{preferredDate}</td>
                    </tr>
                  )}
                  {preferredTime && (
                    <tr>
                      <td style={labelCell} className="dark-mode-text light-mode-text"><strong>Tijd:</strong></td>
                      <td style={valueCell} className="dark-mode-text-secondary light-mode-text-secondary">{preferredTime}</td>
                    </tr>
                  )}
                </table>
                
                <Text style={messageLabel} className="dark-mode-text light-mode-text"><strong>Jouw bericht:</strong></Text>
                <Section style={messageBox} className="dark-mode-border light-mode-border">
                  <Text style={messageText} className="dark-mode-text-secondary light-mode-text-secondary">{message}</Text>
                </Section>
              </Section>

              <Hr style={divider} />

              {/* Call to action */}
              <Section style={ctaSection}>
                <Text style={ctaText} className="dark-mode-text-secondary light-mode-text-secondary">
                  Heb je vragen over je aanvraag?
                </Text>
                
                <Button
                  href={`mailto:info@tabletech.nl?subject=Vraag over afspraak aanvraag`}
                  style={ctaButton}
                >
                  Neem contact op
                </Button>
              </Section>

            </Section>
          </Container>
          
          {/* Footer */}
          <Section style={footer} className="dark-mode-bg light-mode-bg dark-mode-border light-mode-border">
            <Container style={footerContainer}>
              
              <Text style={footerCompany} className="dark-mode-text light-mode-text">
                TableTech VOF
              </Text>
              
              <Text style={footerAddress} className="dark-mode-text-secondary light-mode-text-secondary">
                Biezelingeplein 32<br />
                3086 SB Rotterdam<br />
                Nederland
              </Text>
              
              <Text style={footerContact} className="dark-mode-text-secondary light-mode-text-secondary">
                📧 info@tabletech.nl<br />
                📞 +31 85 888 3333
              </Text>
              
              <Link href="https://tabletech.nl" style={footerWebsite}>
                www.tabletech.nl
              </Link>
              
              <Hr style={footerDivider} />
              
              <Text style={footerCopyright} className="dark-mode-text-secondary light-mode-text-secondary">
                © 2025 TableTech VOF - Alle rechten voorbehouden
              </Text>
              
              <Text style={footerDisclaimer} className="dark-mode-text-secondary light-mode-text-secondary">
                Je ontvangt deze e-mail omdat je een afspraak hebt aangevraagd via onze website.
              </Text>
              
            </Container>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Cross-platform compatible styles met automatische dark/light mode
const main = {
  backgroundColor: 'transparent',
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: '0',
  padding: '0',
  width: '100%',
};

const outerContainer = {
  backgroundColor: 'transparent',
  margin: '0 auto',
  padding: '20px 10px',
  width: '100%',
  maxWidth: '600px',
};

const container = {
  backgroundColor: 'transparent',
  margin: '0 auto',
  borderRadius: '8px',
  maxWidth: '600px',
  width: '100%',
  border: '1px solid #E86C28',
};

// Header - verbeterd voor alle platforms
const headerSection = {
  backgroundColor: '#E86C28',
  padding: '25px 30px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
  textAlign: 'center' as const,
};

// Content section
const contentSection = {
  padding: '30px',
  backgroundColor: 'transparent',
};

const h1 = {
  color: 'inherit',
  fontSize: '26px',
  fontWeight: 'bold',
  lineHeight: '1.3',
  margin: '0 0 25px 0',
  textAlign: 'center' as const,
};

const greeting = {
  color: 'inherit',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const bodyText = {
  color: 'inherit',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 25px 0',
};

// Appointment box - verbeterd contrast
const appointmentBox = {
  backgroundColor: '#E86C28',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '25px 0',
  border: '2px solid #E86C28',
};

const appointmentIcon = {
  fontSize: '24px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const appointmentTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  textAlign: 'center' as const,
};

const appointmentDate = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const appointmentNote = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
};

// Details box - automatische kleurdetectie
const detailsBox = {
  backgroundColor: 'transparent',
  borderRadius: '8px',
  padding: '25px',
  margin: '25px 0',
  border: '2px solid #E86C28',
};

const detailsTitle = {
  color: '#E86C28',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  margin: '0 0 20px 0',
};

const labelCell = {
  color: 'inherit',
  fontSize: '14px',
  padding: '8px 15px 8px 0',
  verticalAlign: 'top',
  width: '30%',
};

const valueCell = {
  color: 'inherit',
  fontSize: '14px',
  padding: '8px 0',
  verticalAlign: 'top',
};

const messageLabel = {
  color: 'inherit',
  fontSize: '14px',
  margin: '15px 0 10px 0',
};

const messageBox = {
  backgroundColor: 'transparent',
  border: '2px solid #E86C28',
  borderRadius: '6px',
  padding: '15px',
  margin: '10px 0 0 0',
};

const messageText = {
  color: 'inherit',
  fontSize: '14px',
  lineHeight: '1.4',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const divider = {
  borderColor: '#E86C28',
  margin: '30px 0',
  borderWidth: '1px',
  borderStyle: 'solid',
};

// CTA section
const ctaSection = {
  textAlign: 'center' as const,
  margin: '25px 0',
};

const ctaText = {
  color: 'inherit',
  fontSize: '16px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const ctaButton = {
  backgroundColor: '#E86C28',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 28px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  border: 'none',
};

// Footer - automatische kleurdetectie
const footer = {
  backgroundColor: 'transparent',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderTop: '2px solid #E86C28',
};

const footerContainer = {
  maxWidth: '400px',
  margin: '0 auto',
  textAlign: 'center' as const,
};

const footerCompany = {
  color: 'inherit',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const footerAddress = {
  color: 'inherit',
  fontSize: '14px',
  lineHeight: '1.4',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const footerContact = {
  color: 'inherit',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const footerWebsite = {
  color: '#E86C28',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'underline',
  display: 'block',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const footerDivider = {
  borderColor: '#E86C28',
  margin: '20px 0',
  borderWidth: '1px',
  borderStyle: 'solid',
};

const footerCopyright = {
  color: 'inherit',
  fontSize: '13px',
  margin: '0 0 12px 0',
  textAlign: 'center' as const,
};

const footerDisclaimer = {
  color: 'inherit',
  fontSize: '12px',
  lineHeight: '1.3',
  margin: '0',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};

export default CustomerConfirmationEmail;